import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TestContext } from "../context/TestContext";
import Toast from "react-native-toast-message";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";

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

function Test() {
  const { quizList } = useContext(TestContext);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    const currentQuiz = quizList[currentIndex];
    const isCorrect =
      userAnswer.trim().toLowerCase() === currentQuiz.answer.toLowerCase();
    setResults([
      ...results,
      {
        quiz: currentQuiz.quiz,
        answer: currentQuiz.answer,
        userAnswer: userAnswer,
        isCorrect,
      },
    ]);
    if (isCorrect) {
      setScore(score + 1);
      Toast.show({
        type: "success",
        text1: "정답입니다!",
        text2: `${currentQuiz.quiz} : ${currentQuiz.answer}`,
        visibilityTime: 2000, // 2초 동안 표시
        autoHide: true,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "오답입니다.",
        text2: `올바른 답은 ${currentQuiz.answer}입니다.`,
        visibilityTime: 2000,
        autoHide: true,
      });
    }
    setUserAnswer("");
    setCurrentIndex(currentIndex + 1);
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
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.answer}>{item.answer}</Text>
              <Text style={styles.quiz}>{item.quiz}</Text>
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
        <TouchableOpacity
          style={styles.home}
          onPress={() => navigation.navigate("Scan")}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            홈으로 가기
          </Text>
        </TouchableOpacity>
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

export default Test;

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
  answer: {
    fontSize: 20,
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
  home: {
    paddingVertical: 15,
    backgroundColor: "#1849A9",
    marginTop: 15,
    textAlign: "center",
    borderRadius: 8,
  },
});
