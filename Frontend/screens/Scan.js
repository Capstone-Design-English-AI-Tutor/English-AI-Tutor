import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CameraIcon from "../assets/camera.png";
import GalleryIcon from "../assets/gallery.png";

function Scan({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const pickImage = async (source) => {
    let result;

    if (source === "gallery") {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", {
      uri: image,
      name: "image.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(
        `http://144.24.83.40:8081/api/ocr?email=komg00@naver.com`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
      console.log(result);
    } catch (error) {
      console.error(error);
      Alert.alert("Error uploading image");
    }
  };

  useEffect(() => {
    if (route.params?.image) {
      setImage(route.params.image);
    }
  }, [route.params?.image]);

  return (
    <View style={styles.container}>
      <View style={styles.scan}>
        <TouchableOpacity
          style={styles.content}
          onPress={() => navigation.navigate("Camera")}
        >
          <Image source={CameraIcon} style={styles.image} />
          <Text style={styles.text}>카메라로 찍기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.content}
          onPress={() => pickImage("gallery")}
        >
          <Image source={GalleryIcon} style={styles.image} />
          <Text style={styles.text}>앨범에서 선택</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.image_container}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
        <Text style={styles.uploadButtonText}>OCR 시작하기</Text>
      </TouchableOpacity>
      {result && (
        <ScrollView style={styles.resultContainer}>
          {result.map((item, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultText}>{item.english}</Text>
              <Text style={styles.resultText}>{item.korean}</Text>
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity style={styles.testButton}>
        <Text style={styles.uploadButtonText}>테스트 시작</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Scan;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  content: {
    alignItems: "center",
    marginHorizontal: 25,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  text: {
    textAlign: "center",
  },
  scan: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  image_container: {
    alignItems: "center",
    marginVertical: 20,
  },
  uploadButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
  },
  resultContainer: {
    height: 220,
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  resultItem: {
    marginBottom: 2,
  },
  resultText: {
    textAlign: "center",
  },
});
