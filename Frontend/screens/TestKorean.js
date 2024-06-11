import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  Pressable,
} from "react-native";
import { TestContext } from "../context/TestContext";
import Toast from "react-native-toast-message";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const toastConfig = {
  submit: ({ text1, text2 }) => (
    <View style={styles.toastSubmit}>
      <Text style={styles.toastText1}>{text1}</Text>
      <Text style={styles.toastText2}>{text2}</Text>
    </View>
  ),
};

function TestKorean() {
  const { quizList } = useContext(TestContext);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [editedQuizList, setEditedQuizList] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    const transformedList = Object.values(quizList).map((item) => ({
      ...item,
      bookmarked: false, // 북마크 상태 추가
    }));
    setEditedQuizList(transformedList);
    setCurrentIndex(0);
  }, [quizList]);

  const toggleBookmark = (index) => {
    setEditedQuizList((prevList) =>
      prevList.map((item, idx) =>
        idx === index ? { ...item, bookmarked: !item.bookmarked } : item
      )
    );
  };

  const handleSubmit = () => {
    const currentQuiz = quizList[currentIndex];
    setResults([
      ...results,
      {
        quiz: currentQuiz.quiz,
        answer: currentQuiz.answer,
        userAnswer: userAnswer,
      },
    ]);
    Toast.show({
      type: "submit",
      text1: `${currentQuiz.quiz} : ${currentQuiz.answer}`,
      text2: `내가 적은 답: ${userAnswer}`,
      topOffset: 300,
    });
    setUserAnswer("");
    setCurrentIndex(currentIndex + 1);
  };

  const handleCreateFolder = () => {
    if (folderName.trim().length > 0) {
      setFolders([...folders, { name: folderName, words: [] }]);
      setFolderName("");
      setIsModalVisible(false);
    }
  };

  const saveBookmarkedWords = () => {
    const bookmarkedWords = quizList.filter((item) => item.bookmarked);
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.name === currentFolder
          ? { ...folder, words: [...folder.words, ...bookmarkedWords] }
          : folder
      )
    );
  };

  const handleExit = () => {
    setCurrentIndex(quizList.length);
  };

  if (currentIndex >= quizList.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultTitle}>문제 풀이 결과</Text>
        <Text style={styles.resultText}>{quizList.length}개 단어 학습</Text>
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.resultItem}>
              <View style={styles.icon}>
                <Text style={styles.answer}>{item.answer}</Text>
                <TouchableOpacity onPress={() => toggleBookmark(index)}>
                  <MaterialIcons
                    name={
                      editedQuizList[index].bookmarked
                        ? "bookmark-add"
                        : "bookmark-border"
                    }
                    color="#999999"
                    size={50}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.quiz}>{item.quiz}</Text>
              <Text style={styles.userAnswer}>
                내가 적은 답: {item.userAnswer}
              </Text>
            </View>
          )}
        />
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.folder}
            onPress={() => setIsModalVisible(true)}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              폴더 생성
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.home}
            onPress={() => navigation.navigate("Scan")}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              홈으로 가기
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <Pressable
            onPress={() => {
              setIsModalVisible(false);
            }}
            style={styles.modalBackground}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>폴더 이름 입력</Text>
              <TextInput
                style={styles.modalInput}
                value={folderName}
                onChangeText={setFolderName}
              />
              <View style={styles.modalButtonContainer}>
                <Button title="생성" onPress={handleCreateFolder} />
                <Button title="취소" onPress={() => setIsModalVisible(false)} />
              </View>
            </View>
          </Pressable>
        </Modal>
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </View>
    );
  }

  const progress = currentIndex / quizList.length;

  return (
    <View style={styles.container}>
      <View style={styles.progresContainer}>
        <Progress.Bar
          progress={progress}
          width={null}
          height={12}
          color={"#2D31A6"}
          style={styles.progress}
          borderRadius={16}
          flex={1}
          marginHorizontal={10}
        />
        <Text>
          {currentIndex}/{quizList.length}
        </Text>
        <TouchableOpacity style={styles.close} onPress={handleExit}>
          <Text style={{ fontSize: 15, color: "white" }}>종료</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.quizText}>{quizList[currentIndex].quiz}</Text>
      <TextInput
        style={styles.input}
        value={userAnswer}
        onChangeText={setUserAnswer}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.text}>제출</Text>
      </TouchableOpacity>
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
}

export default TestKorean;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  progresContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  close: {
    backgroundColor: "#F88600",
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  quizText: {
    fontSize: 22,
    textAlign: "left",
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 15,
    paddingHorizontal: 12,
    fontSize: 17,
  },
  resultItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: "#F4F3F6",
    marginVertical: 7,
    display: "flex",
    flexDirection: "column",
  },
  icon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answer: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  quiz: {
    fontSize: 16,
    marginBottom: 5,
  },
  userAnswer: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    width: 60,
    height: 40,
    backgroundColor: "#2D31A6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  text: {
    color: "#fff",
    fontSize: 15,
  },
  correct: {
    color: "#45C486",
    alignSelf: "flex-end",
  },
  incorrect: {
    color: "#EB3223",
    alignSelf: "flex-end",
  },
  toastSubmit: {
    width: 350,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#F4F3F6",
  },
  toastText1: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  toastText2: {
    fontSize: 15,
    color: "#4F4F4F",
  },
  resultTitle: {
    marginBottom: 7,
    fontSize: 21,
    fontWeight: "bold",
  },
  resultText: {
    marginBottom: 7,
    fontSize: 18,
  },
  bottomContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  folder: {
    paddingVertical: 15,
    paddingHorizontal: 45,
    marginTop: 15,
    textAlign: "center",
    borderRadius: 8,
    backgroundColor: "#1849A9",
  },
  home: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 15,
    textAlign: "center",
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    paddingVertical: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 100,
    borderRadius: 30,
  },
  modalButtonContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "70%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
