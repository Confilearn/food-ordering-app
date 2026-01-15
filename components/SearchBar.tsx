import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query || "");

  const handleSearch = (text: string) => {
    setQuery(text);

    if (!text) router.setParams({ query: undefined });
  };

  const handleSubmit = () => {
    if (query.trim()) {
      router.setParams({ query });
    }
  };

  return (
    <View
      className="searchbar"
      style={
        Platform.OS === "android"
          ? { elevation: 5, shadowColor: "#878787" }
          : {}
      }
    >
      <TextInput
        className="flex-1 p-5"
        placeholder="Search for pizzas, burgers ..."
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        placeholderTextColor="#AOAOAO"
      />
      <TouchableOpacity
        className="pr-5"
        onPress={() => router.setParams({ query })}
      >
        <Image source={images.search} className="size-6"></Image>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
