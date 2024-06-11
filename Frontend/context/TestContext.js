import React, { createContext, useState } from "react";

export const TestContext = createContext();

export const TestTypeProvider = ({ children }) => {
  const [testType, setTestType] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [sentenceList, setSentenceList] = useState([]);

  return (
    <TestContext.Provider
      value={{
        testType,
        setTestType,
        quizList,
        setQuizList,
        sentenceList,
        setSentenceList,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};
