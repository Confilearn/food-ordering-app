import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(
    appwriteConfig.databaseId!,
    collectionId
  );

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(
        appwriteConfig.databaseId!,
        collectionId,
        doc.$id
      )
    )
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteConfig.bucketId!);

  await Promise.all(
    list.files.map((file: any) =>
      storage.deleteFile(appwriteConfig.bucketId!, file.$id)
    )
  );
}

async function uploadImageToStorage(imageUrl: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  const fileObj = {
    name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
    type: blob.type || "image/png",
    size: blob.size,
    uri: imageUrl,
  };

  const file = await storage.createFile(
    appwriteConfig.bucketId!,
    ID.unique(),
    fileObj
  );

  console.log("Uploaded file:", file);

  return storage.getFileViewURL(appwriteConfig.bucketId!, file.$id);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 500
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = initialDelay * Math.pow(2, i); // exponential backoff
      console.log(
        `Retry attempt ${i + 1}/${maxRetries} after ${delay}ms...`,
        error
      );
      await sleep(delay);
    }
  }
  throw lastError;
}

async function seed(): Promise<void> {
  try {
    // 1. Clear all
    console.log("Clearing collections...");
    await clearAll(appwriteConfig.categoriesCollectionId!);
    await clearAll(appwriteConfig.customizationsCollectionId!);
    await clearAll(appwriteConfig.menuCollectionId!);
    await clearAll(appwriteConfig.menuCustomizationsCollectionId!);
    await clearStorage();
    console.log("Collections cleared.");

    // 2. Create Categories
    console.log("Creating categories...");
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.categoriesCollectionId!,
        ID.unique(),
        cat
      );
      await sleep(100); // Small delay to ensure document is indexed
      categoryMap[cat.name] = doc.$id;
    }
    console.log("Categories created.");

    // 3. Create Customizations
    console.log("Creating customizations...");
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.customizationsCollectionId!,
        ID.unique(),
        {
          name: cus.name,
          price: cus.price,
          type: cus.type,
        }
      );
      await sleep(100); // Small delay to ensure document is indexed
      customizationMap[cus.name] = doc.$id;
    }
    console.log("Customizations created.");

    // 4. Create Menu Items
    console.log("Creating menu items...");
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
      try {
        console.log(`Uploading image for "${item.name}"...`);
        const uploadedImage = await retryWithBackoff(() =>
          uploadImageToStorage(item.image_url)
        );
        console.log(`Image uploaded: ${uploadedImage}`);

        const doc = await retryWithBackoff(() =>
          databases.createDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.menuCollectionId!,
            ID.unique(),
            {
              name: item.name,
              description: item.description,
              image_url: uploadedImage,
              price: item.price,
              rating: item.rating,
              calories: item.calories,
              protein: item.protein,
              categories: categoryMap[item.category_name],
            }
          )
        );
        await sleep(100); // Small delay to ensure document is indexed

        menuMap[item.name] = doc.$id;

        // 5. Create menu_customizations
        for (const cusName of item.customizations) {
          await retryWithBackoff(() =>
            databases.createDocument(
              appwriteConfig.databaseId!,
              appwriteConfig.menuCustomizationsCollectionId!,
              ID.unique(),
              {
                menu: doc.$id,
                customizations: customizationMap[cusName],
              }
            )
          );
          await sleep(50); // Small delay between customizations
        }
      } catch (error) {
        console.error(`Failed to create menu item "${item.name}":`, error);
        throw error;
      }
    }

    console.log("✅ Seeding complete.");
  } catch (error) {
    console.error("❌ Failed to seed the database:", error);
    throw error;
  }
}

export default seed;
