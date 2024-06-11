import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  Pressable
} from "react-native";
import Toast from "react-native-toast-message";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.toastSuccess}>
      <Text style={styles.toastText1}>{text1}</Text>
      <Text style={styles.toastText2}>{text2}</Text>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={styles.toastError}>
      <Text style={styles.toastText1}>{text1}</Text>
      <Text style={styles.toastText2}>{text2}</Text>
    </View>
  ),
};

const TestSentence = ({ route }) => {
  const { sentenceList } = route.params;
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [quizList, setQuizList] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    const transformedList = Object.values(sentenceList).map((item) => ({
      ...item,
      bookmarked: false, // 북마크 상태 추가
    }));
    setQuizList(transformedList);
    setCurrentIndex(0);
  }, [sentenceList]);

  const toggleBookmark = (index) => {
    setQuizList((prevList) =>
      prevList.map((item, idx) =>
        idx === index ? { ...item, bookmarked: !item.bookmarked } : item
      )
    );
  };

  const handleSubmit = () => {
    const currentQuiz = quizList[currentIndex];
    const isCorrect =
      userAnswer.trim().toLowerCase() === currentQuiz.answer.toLowerCase();
    setResults([
      ...results,
      {
        answer: currentQuiz.answer,
        english_question: currentQuiz.english_question,
        korean_translation: currentQuiz.korean_translation,
        userAnswer: userAnswer,
        isCorrect,
      },
    ]);
    if (isCorrect) {
      setScore(score + 1);
      Toast.show({
        type: "success",
        text1: "정답입니다!",
        text2: `제출한 답 : ${userAnswer}`,
        visibilityTime: 2000, // 2초 동안 표시
        autoHide: true,
        topOffset: 330,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "오답입니다.",
        text2: `올바른 답은 ${currentQuiz.answer}입니다.`,
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 330,
      });
    }
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
        <Text style={styles.resultText}>
          맞은 단어: {score} / {currentIndex}
        </Text>
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
                      quizList[index].bookmarked
                        ? "bookmark-add"
                        : "bookmark-border"
                    }
                    color="#999999"
                    size={50}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.quiz}>{item.english_question}</Text>
              <Text style={styles.quiz}>{item.korean_translation}</Text>
              <Text style={styles.userAnswer}>
                내가 적은 답: {item.userAnswer}
              </Text>
              {item.isCorrect ? (
                <Text style={styles.correct}>맞은 단어</Text>
              ) : (
                <Text style={styles.incorrect}>틀린 단어</Text>
              )}
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
      {quizList && quizList.length > 0 ? (
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
      ) : (
        <Text>Loading...</Text>
      )}

      {quizList && quizList.length > 0 ? (
        <>
          <Text style={styles.quizText}>
            {quizList[currentIndex].english_question}
          </Text>
          <Text style={styles.quizKor}>
            {quizList[currentIndex].korean_translation}
          </Text>
          <TextInput
            style={styles.input}
            value={userAnswer}
            onChangeText={(text) => setUserAnswer(text)}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.text}>제출</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default TestSentence;

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
    marginBottom: 10,
    marginHorizontal: 15,
    marginTop: 20,
    fontWeight: "bold",
  },
  quizKor: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 30,
    marginLeft: 20,
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
  toastSuccess: {
    width: 350,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#C6F6D5",
  },
  toastError: {
    width: 350,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FEEBCB",
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
    justifyContent: "flex-end"
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
