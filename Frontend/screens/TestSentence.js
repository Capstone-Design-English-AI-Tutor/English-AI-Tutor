import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { TestContext } from "../context/TestContext";

const TestSentence = () => {
  const { sentenceList } = useContext(TestContext);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    const currentQuiz = sentenceList[currentIndex];
    const isCorrect =
      userAnswer.trim().toLowerCase() === currentQuiz.answer.toLowerCase();
    setResults([
      ...results,
      { quiz: currentQuiz.quiz, answer: userAnswer, isCorrect },
    ]);
    isCorrect && setScore(score + 1);
    if (isCorrect) {
      Alert.alert("정답입니다!");
    } else {
      Alert.alert("오답입니다.", `올바른 답은 ${currentQuiz.answer}입니다.`);
    }
    setUserAnswer("");
    setCurrentIndex(currentIndex + 1);
  };

  if (currentIndex >= sentenceList.length) {
    return (
      <View style={styles.container}>
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text>{item.quiz}</Text>
              <Text>내가 적은 답: {item.answer}</Text>
              {item.isCorrect ? (
                <Text style={styles.correct}>맞은 단어</Text>
              ) : (
                <Text style={styles.incorrect}>틀린 단어</Text>
              )}
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.quizText}>
        {sentenceList[currentIndex].english_question}
      </Text>
      <Text style={styles.quizText}>
        {sentenceList[currentIndex].korean_translation}
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
    </View>
  );
};

export default TestSentence;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  quizText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resultItem: {
    padding: 16,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "#2D31A6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    color: "#fff",
  },
  correct: {
    color: "#45C486",
  },
  incorrect: {
    color: "#EB3223",
  },
});
