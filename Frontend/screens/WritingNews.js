import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import * as Progress from "react-native-progress";
import axios from "axios";

function WritingNews({ route }) {
  const { newsSentenceList, articleTitle } = route.params; // 전달된 데이터 접근
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [sentenceData, setSentenceData] = useState(null);
  const [grade, setGrade] = useState("");
  const [testResult, setTestResult] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async () => {
    const currentSentenceId = newsSentenceList[currentIndex].sentenceId;

    try {
      console.log("문장id", currentSentenceId);
      const response = await fetch(
        `http://34.22.72.154:12300/api/writing/sentence/${currentSentenceId}`
      );
      const data = await response.json();
      console.log("문장", data);
      setSentenceData({
        korean: newsSentenceList[currentIndex].korean,
        english: data.english,
        userAnswer: userAnswer,
      });
    } catch (error) {
      console.error(error);
    }

    // 유사성 검사(grade 조회)
    try {
      const response = await axios.post(
        "http://34.22.72.154:12300/api/writing/check/similarity",
        {
          userInput: userAnswer,
          sentenceId: currentSentenceId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("유사성 검사 결과", response.data);
      setGrade(response.data.grade);
    } catch (error) {
      console.error(error);
    }

    // 문법, 철자 검사
    try {
      const response = await axios.post(
        `http://34.22.72.154:12300/api/writing/check/grammar-and-spell`,
        {
          input: userAnswer,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("문법 검사 결과", response.data.result);
      setTestResult(response.data.result);
    } catch (error) {
      console.error(error);
    }
    console.log(testResult);
    setShowResult(true);
  };

  const handleConfirm = () => {
    setShowResult(false); // Hide result screen
    setUserAnswer(""); // 입력 필드 초기화
    setCurrentIndex(currentIndex + 1); // 다음 문장으로 이동
    setSentenceData(null); // Clear previous sentence data
    setGrade(""); // Clear previous grade
    setTestResult([]); // Clear previous test results
  };

  const progress = currentIndex / newsSentenceList.length;

  const highlightErrors = () => {
    if (!sentenceData?.userAnswer || testResult.length === 0) return null;

    const elements = [];
    let lastIndex = 0;

    testResult.forEach((error, index) => {
      const startIdx = error.startIdx;
      const endIdx = error.endIdx;
      
      // Add the text before the error
      if (lastIndex < startIdx) {
        elements.push(
          <Text key={`text-${lastIndex}-${startIdx}`}>
            {sentenceData.userAnswer.slice(lastIndex, startIdx)}
          </Text>
        );
      }

      // Add the highlighted error text
      elements.push(
        <Text key={`error-${startIdx}-${endIdx}`} style={styles.errorText}>
          {sentenceData.userAnswer.slice(startIdx, endIdx)}
        </Text>
      );

      lastIndex = endIdx;
    });

    // Add the remaining text after the last error
    if (lastIndex < sentenceData.userAnswer.length) {
      elements.push(
        <Text key={`text-${lastIndex}-end`}>
          {sentenceData.userAnswer.slice(lastIndex)}
        </Text>
      );
    }
    return <Text>{elements}</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{articleTitle}</Text>
      {showResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>번역: {sentenceData.korean}</Text>
          <Text style={styles.resultText}>원문: {sentenceData.english}</Text>
          <Text style={styles.resultText}>내 답변:</Text>
          <View style={styles.userAnswerContainer}>{highlightErrors()}</View>
          <Text style={styles.resultText}>유사성 점수: {grade}</Text>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>문법/철자 검사</Text>
            {testResult.map((error, index) => (
              <View key={index} style={styles.errorItem}>
                <Text>{error.error_message} (위치: {error.startIdx} - {error.endIdx})</Text>
                <Text style={styles.replacementText}>수정 제안: {error.replacement}</Text>
              </View>
            ))}
          </View>
          <Button title="확인" onPress={handleConfirm} />
        </View>
      ) : (
        <View style={styles.sentenceContainer}>
          <View style={styles.progressBar}>
            <Progress.Bar
              progress={progress}
              width={null}
              height={12}
              color={"#2D31A6"}
              borderRadius={16}
              flex={1}
              marginHorizontal={10}
            />
            <Text>
              {currentIndex} / {newsSentenceList.length}
            </Text>
          </View>
          <View style={styles.wrap}>
            <Text style={styles.text}>
              {newsSentenceList[currentIndex].korean}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="여기에 입력하세요"
          />
          <Button title="제출" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
}

export default WritingNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 7,
  },
  wrap: {
    backgroundColor: "#F4F3F6",
    borderRadius: 30,
    padding: 20,
    marginVertical: 20,
  },
  text: {
    fontSize: 17,
  },
  sentenceContainer: {
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "#EEF4FF",
    borderWidth: 1,
    marginBottom: 35,
    paddingHorizontal: 8,
    borderRadius: 30,
    fontSize: 17,
  },
  resultContainer: {
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  errorContainer: {
    marginVertical: 10,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  errorItem: {
    fontSize: 14,
    marginBottom: 3,
  },
  replacementText: {
    color: 'green',
  },
  userAnswerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  errorText: {
    textDecorationLine: 'underline',
    textDecorationColor: 'red',
  },
});
