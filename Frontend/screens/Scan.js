import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CameraIcon from "../assets/camera.png";
import GalleryIcon from "../assets/gallery.png";
import { TestContext } from "../context/TestContext";

function Scan({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { testType, setTestType, setQuizList, setSentenceList } =
    useContext(TestContext);

  const pickImage = async (source) => {
    let result;

    if (source === "gallery") {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
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
      console.log(response.data);
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

  const handleTestSelection = (type) => {
    setTestType(type);
  };

  const CreateTest = async () => {
    try {
      const response = await axios.post(
        `http://144.24.83.40:8081/api/problem/${testType}?email=komg00@naver.com`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (testType === "sentence") {
        setSentenceList(response.data);
        console.log(response.data);
      } else {
        setQuizList(response.data.quizList);
        console.log(response.data.quizList);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error");
    }
  };

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
      {image && (
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Text style={styles.uploadButtonText}>텍스트 추출</Text>
        </TouchableOpacity>
      )}
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
      {result && (
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.uploadButtonText}>유형 선택</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => {
            setModalVisible(false);
            console.log(testType);
            setTestType(null);
          }}
          style={styles.modalBackground}
        ></Pressable>
        <View style={styles.modalView}>
          <Text style={styles.textStyle}>테스트 유형 선택</Text>
          <TouchableOpacity
            style={[
              styles.button,
              testType === "english" && { backgroundColor: "#717BBC" },
            ]}
            activeOpacity={0.7}
            onPress={() => handleTestSelection("english")}
          >
            <Text style={styles.textStyle}>영단어 맞추기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              testType === "korean" && { backgroundColor: "#717BBC" },
            ]}
            activeOpacity={0.7}
            onPress={() => handleTestSelection("korean")}
          >
            <Text style={styles.textStyle}>한글 뜻 맞추기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              testType === "sentence" && { backgroundColor: "#717BBC" },
            ]}
            activeOpacity={0.7}
            onPress={() => handleTestSelection("sentence")}
          >
            <Text style={styles.textStyle}>문장 속에 들어갈 영단어 맞추기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => {
              CreateTest(testType);
              setModalVisible(false);
              testType === "sentence"
                ? navigation.navigate("TestSentence")
                : navigation.navigate("Test");
            }}
          >
            <Text style={styles.uploadButtonText}>시작하기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    width: 80,
    height: 80,
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
    backgroundColor: "#7F56D9",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
  },
  resultContainer: {
    height: 180,
    marginTop: 20,
    paddingBottom: 30,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  resultItem: {
    marginBottom: 2,
  },
  resultText: {
    textAlign: "center",
    fontSize: 20,
  },
  testButton: {
    backgroundColor: "#7F56D9",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  modalView: {
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
  },
  textStyle: {
    fontSize: 20,
  },
});
