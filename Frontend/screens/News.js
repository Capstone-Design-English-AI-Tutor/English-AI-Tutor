import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";

function News() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleLevelPress = (level) => {
    setSelectedLevel(level);
  };

  return (
    <View>
      <View style={styles.optionContainer}>
        <Text style={styles.text}>난이도를 선택해주세요</Text>
        <View style={styles.container}>
          <TouchableOpacity
            style={[
              styles.option,
              selectedLevel === "Level 1" && { backgroundColor: "#717BBC" },
            ]}
            activeOpacity={0.7}
            onPress={() => handleLevelPress("Level 1")}
          >
            <Text style={styles.buttonText}>Level 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.option,
              selectedLevel === "Level 2" && { backgroundColor: "#717BBC" },
            ]}
            activeOpacity={0.7}
            onPress={() => handleLevelPress("Level 2")}
          >
            <Text style={styles.buttonText}>Level 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.option,
              selectedLevel === "Level 3" && { backgroundColor: "#717BBC" },
            ]}
            activeOpacity={0.7}
            onPress={() => handleLevelPress("Level 3")}
          >
            <Text style={styles.buttonText}>Level 3</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <View style={styles.newsContainer}>
          <Text style={styles.text}>기사를 선택해주세요</Text>
          <TouchableOpacity style={styles.item}>
            <Image source={image1} style={styles.image} />
            <Text>People breathe bad air</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Image source={image2} style={styles.image} />
            <Text>Princess of Wales has cancer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Image source={image3} style={styles.image} />
            <Text>German football ends a deal with Adidas</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>테스트 시작</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default News;

const styles = StyleSheet.create({
  optionContainer: {
    marginTop: 8,
    borderColor: "#D9D9D9",
  },
  container: {
    flexDirection: "row",
    marginLeft: 10,
    backgroundColor: "white",
  },
  option: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 6,
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
  },
  text: {
    marginLeft: 15,
    marginVertical: 7,
  },
  newsContainer: {
    marginTop: 12,
    borderColor: "#D9D9D9",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 8,
    marginVertical: 7,
  },
  image: {
    width: 110,
    height: 60,
    marginRight: 10,
  },
  button: {
    width: 380,
    backgroundColor: "#4E5BA6",
    alignSelf: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
