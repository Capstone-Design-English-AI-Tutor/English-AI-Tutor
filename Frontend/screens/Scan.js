import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Image } from "react-native";
import Camera from "../assets/camera.png";
import Gallery from "../assets/gallery.png";

function Scan() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={Camera} style={styles.image} />
        <Text style={styles.text}>카메라로 찍기</Text>
      </View>
      <View style={styles.content}>
        <Image source={Gallery} style={styles.image} />
        <Text style={styles.text}>갤러리에서 불러오기</Text>
      </View>
    </View>
  );
}

export default Scan;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  content: {
    alignItems: "center",
    marginHorizontal: 25,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  text: {
    textAlign: "center",
  },
});
