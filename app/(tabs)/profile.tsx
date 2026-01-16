import CustomHeader from "@/components/CustomHeader";
import ProfileItem from "@/components/ProfileItem";
import { images } from "@/constants";
import { getCurrentUser } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { data, refetch, loading } = useAppwrite({
    fn: getCurrentUser,
  });

  const handlePress = async () => {};

  const profileData = [
    {
      id: "1",
      icon: images.user,
      title: "Full Name",
      value: data?.name,
    },
    {
      id: "2",
      icon: images.envelope,
      title: "Email",
      value: data?.email,
    },
    {
      id: "3",
      icon: images.phone,
      title: "Phone Number",
      value: "+1234567890",
    },
    {
      id: "4",
      icon: images.location,
      title: "Address",
      value: "123 Main St, City, Country",
    },
  ];

  return (
    <SafeAreaView className="bg-white h-full">
      {loading ? (
        <Text className="base-bold text-dark-100 pt-5 px-5">Loading...</Text>
      ) : (
        <FlatList
          data={profileData}
          renderItem={({ item }) => (
            <ProfileItem
              icon={item.icon}
              title={item.title}
              value={item.value}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-7 px-5 pb-28 pt-5"
          ListHeaderComponent={() => (
            <View>
              <CustomHeader title="Profile" />

              <Image
                source={{ uri: data?.avatar }}
                className="size-24 rounded-full mx-auto pb-5"
              />
            </View>
          )}
          ListFooterComponent={() => (
            <TouchableOpacity
              onPress={handlePress}
              className="items-center justify-center gap-3 flex-row mt-5 w-full border border-red-500 bg-red-500/5 rounded-full p-3"
            >
              <Image source={images.logout} className="size-8" />
              <Text className="base-bold text-red-500">Logout</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
