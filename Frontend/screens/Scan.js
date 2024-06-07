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
  ActivityIndicator,
  TextInput
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CameraIcon from "../assets/camera.png";
import GalleryIcon from "../assets/gallery.png";
import { TestContext } from "../context/TestContext";

function Scan({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editEnglish, setEditEnglish] = useState("");
  const [editKorean, setEditKorean] = useState("");
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.image) {
      setImage(route.params.image);
    }
  }, [route.params?.image]);

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

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

  const handleEdit = (index, field, value) => {
    if (field === 'english') {
      setEditEnglish(value);
    } else {
      setEditKorean(value);
    }
    setEditIndex(index);
  };

  const submitEdit = () => {
    const updatedResult = result.map((item, index) =>
      index === editIndex ? { english: editEnglish, korean: editKorean } : item
    );
    setResult(updatedResult);
    setEditIndex(null);
    setEditEnglish('');
    setEditKorean('');
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
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#7F56D9"
          style={{ marginTop: 20 }}
        />
      ) : (
        result && (
          <ScrollView style={styles.resultContainer}>
            {result.map((item, index) => (
              <View key={index} style={styles.resultRow}>
                {editIndex === index ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={editEnglish}
                      onChangeText={(text) => handleEdit(index, 'english', text)}
                    />
                    <TextInput
                      style={styles.input}
                      value={editKorean}
                      onChangeText={(text) => handleEdit(index, 'korean', text)}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={submitEdit}>
                      <Text style={styles.submitButtonText}>수정</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.resultIndex}>{index + 1}.</Text>
                    <Text style={styles.resultEnglish}>{item.english}</Text>
                    <Text style={styles.resultKorean}>{item.korean}</Text>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => setEditIndex(index)}
                    >
                      <Text style={styles.editButtonText}>편집</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))}
          </ScrollView>
        )
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
          <Text style={styles.title}>테스트 유형 선택</Text>
          <TouchableOpacity
            style={[
              styles.button,
              testType === "english" && { backgroundColor: "#717BBC" },
            ]}
            activeOpacity={0.7}
            onPress={() => handleTestSelection("english")}
          >
            <Text
              style={[
                styles.textStyle,
                testType === "english" && { color: "white" },
              ]}
            >
              영단어 맞추기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              testType === "korean" && { backgroundColor: "#717BBC" },
            ]}
            activeOpacity={0.7}
            onPress={() => handleTestSelection("korean")}
          >
            <Text
              style={[
                styles.textStyle,
                testType === "korean" && { color: "white" },
              ]}
            >
              한글 뜻 맞추기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              testType === "sentence" && { backgroundColor: "#717BBC" },
            ]}
            activeOpacity={0.7}
            onPress={() => handleTestSelection("sentence")}
          >
            <Text
              style={[
                styles.textStyle,
                testType === "sentence" && { color: "white" },
              ]}
            >
              문장 속에 들어갈 영단어 맞추기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.start}
            onPress={() => {
              CreateTest(testType);
              setModalVisible(false);
              testType === "sentence"
                ? navigation.navigate("TestSentence")
                : navigation.navigate("Test");
            }}
          >
            <Text style={styles.startText}>시작</Text>
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
    marginTop: 15,
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
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
  },
  resultContainer: {
    height: 380,
    marginTop: 30,
    paddingBottom: 30,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultEnglish: {
    flex: 4,
    textAlign: "left",
    fontSize: 18,
    paddingLeft: 15,
  },
  resultKorean: {
    flex: 4,
    textAlign: "left",
    fontSize: 18,
    paddingLeft: 10,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: "bold",
  },
  textStyle: {
    fontSize: 18,
  },
  start: {
    fontWeight: "bold",
    paddingHorizontal: 50,
    backgroundColor: "#7F56D9",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  startText: {
    color: "white",
    fontSize: 18,
  },
  input: {
    flex: 4,
    fontSize: 18,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  submitButton: {
    backgroundColor: "#7F56D9",
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  submitButtonText: {
    color: "white",
  },
  editButton: {
    backgroundColor: "#717BBC",
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  editButtonText: {
    color: "white",
  },
});
