import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import * as Speech from "expo-speech";
import IconButton from "../components/UI/IconButton";

const data = [
  { id: "1", word: "appreciate", meaning: "~을 고맙게 생각하다" },
  { id: "2", word: "impressive", meaning: "인상적인" },
  { id: "3", word: "delicious", meaning: "맛있는" },
  { id: "4", word: "beautiful", meaning: "아름다운" },
  { id: "5", word: "wonderful", meaning: "멋진" },
  { id: "6", word: "wonderful", meaning: "멋진" },
  { id: "7", word: "wonderful", meaning: "멋진" },
  { id: "8", word: "wonderful", meaning: "멋진" },
];

function renderItem({ item }) {
  // 단어 눌렀을 때 TTS
  const speak = (word) => {
    Speech.speak(word, {
      language: "en-US",
      pitch: 1.0,
      rate: 1.0,
      volume: 1.0,
      onError: (error) => {
        console.error("An error occurred:", error);
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.word}>{item.word}</Text>
        <Text>{item.meaning}</Text>
      </View>
      <View style={styles.iconContainer}>
        <IconButton
          icon="volume-medium"
          size={36}
          style={styles.icon}
          color="#B7B7B7"
          onPress={() => speak(item.word)} // 아이콘 눌렀을 때 소리 재생
        />
      </View>
    </View>
  );
}

function Voca() {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.flatlist}
    />
  );
}

export default Voca;

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FC",
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: "#EAECF5",
    marginVertical: 8,
    marginHorizontal: 25,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  contentContainer: {
    flex: 1,
  },
  word: {
    marginBottom: 8,
  },
  iconContainer: {
    marginLeft: 10,
    alignItems: "center",
  },
  icon: {
    resizeMode: "contain",
  },
});
