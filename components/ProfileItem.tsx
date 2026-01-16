import { Image, Text, View } from "react-native";

const ProfileItem = ({
  icon,
  title,
  value,
}: {
  icon: any;
  title: any;
  value: any;
}) => {
  return (
    <View className="flex-row gap-3 items-center">
      <View className="p-4 bg-primary/10 rounded-full">
        <Image source={icon} className="size-6" />
      </View>

      <View>
        <Text className="paragraph-semibold text-gray-200">{title}</Text>
        <Text className="base-bold text-dark-100">{value}</Text>
      </View>
    </View>
  );
};

export default ProfileItem;
