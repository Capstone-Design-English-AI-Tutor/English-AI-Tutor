import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TestContext } from "../context/TestContext";
import Toast from "react-native-toast-message";

function Test() {
  const { quizList } = useContext(TestContext);
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
        type: 'success',
        text1: '정답입니다!',
        text2: `${currentQuiz.quiz} : ${currentQuiz.answer}`,
        top: 200,
        visibilityTime: 2000, // 2초 동안 표시
        autoHide: true,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: '오답입니다.',
        text2: `올바른 답은 ${currentQuiz.answer}입니다.`,
        top: 200,
        autoHide: true,
      });
    }
    setUserAnswer("");
    setCurrentIndex(currentIndex + 1);
  };

  if (currentIndex >= quizList.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>테스트 결과</Text>

        <Text>
          점수: {score} / {quizList.length}
        </Text>
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text>한글: {item.quiz}</Text>
              <Text>정답: {item.answer}</Text>
              <Text>내가 적은 답: {item.userAnswer}</Text>
              {item.isCorrect ? (
                <Text style={styles.correct}>맞은 단어</Text>
              ) : (
                <Text style={styles.incorrect}>틀린 단어</Text>
              )}
            </View>
          )}
        />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
}

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  quizText: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: 16,
    marginLeft: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 15,
    paddingHorizontal: 8,
  },
  resultItem: {
    padding: 16,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
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
  },
  incorrect: {
    color: "#EB3223",
  },
});
