import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { Image } from "react-native";
import Camera from "../assets/camera.png";
import Gallery from "../assets/gallery.png";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

function Scan() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleGalleryPress = () => {
    const options = {
      mediaType: "photo",
      includeBase64: true,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];

        const formData = new FormData();
        formData.append("image", {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });

        try {
          const res = await axios.post("http://localhost:8000/ocr", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setResult(res.data);
        } catch (error) {
          console.error("Error uploading file:", error);
          Alert.alert("Error", "There was an error uploading the file.");
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={Camera} style={styles.image} />
        <Text style={styles.text}>카메라로 찍기</Text>
      </View>
      <TouchableOpacity style={styles.content} onPress={handleGalleryPress}>
        <Image source={Gallery} style={styles.image} />
        <Text style={styles.text}>갤러리에서 불러오기</Text>
      </TouchableOpacity>
      <View style={styles.image_container}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
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
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  resultText: {
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
