import React, { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { usePage } from "./page.context";
import { useWebsocket } from "./websocket.context";

type QuestionType = "true_or_false" | "multiple_choice" | "single_choice" | "free_text";
type Points = 1000 | 1500 | 2000 | 2500 | 3000;

type UserScore = {
  username: string;
  score: number;
};

type Leaderboard = UserScore[];

export type Answer = string | number[] | number | boolean;

export interface QuestionResultInterface {
  id: number;
  correct: boolean;
  correctCount: number;
  correctAnswer: string | number[] | number | boolean;
  points: number;
  position: number;
  leaderboard: Leaderboard;
}

interface QuestionOptions {
  choices?: string[];
}

interface Question {
  id: number;
  questionType: QuestionType;
  question: string;
  timeLimit: number;
  points: Points;
  answerCount: number;
  choices: string[] | true | null;
  result?: QuestionResultInterface;
}

interface QuestionContextType extends Question {
  answer: (answer: Answer, questionId: number) => void;
  setQuestion: (question: Question) => void;
  setResult: (result: QuestionResultInterface) => void;
  setChoices: (options: QuestionOptions | undefined) => void;
  setAnswerCount: (answerCount: number) => void;
}

const initialQuestion: QuestionContextType = {
  id: 0,
  questionType: "single_choice",
  question: "",
  timeLimit: 20,
  points: 1000,
  answerCount: 0,
  choices: null,
  answer: () => {},
  setQuestion: () => {},
  setChoices: () => {},
  setResult: () => {},
  setAnswerCount: () => {},
};

const QuestionContext = createContext<QuestionContextType | null>(null);

const questionReducer = (state: QuestionContextType, action: any) => {
  switch (action.type) {
    case "SET_QUESTION":
      return {
        ...state,
        choices: null,
        answerCount: 0,
        result: null,
        ...action.payload,
      };
    case "SET_RESULT":
      return {
        ...state,
        result: action.payload,
      };
    case "SET_OPTIONS":
      return {
        ...state,
        choices: action.payload?.choices || true,
      };
    case "SET_ANSWER_COUNT":
      return {
        ...state,
        answerCount: action.payload,
      };
    default:
      return state;
  }
};

export const QuestionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(questionReducer, initialQuestion);
  const { onMessage, removeEvents, sendPacket } = useWebsocket();
  const { setPage } = usePage();

  const setQuestion = (question: Question) => {
    dispatch({ type: "SET_QUESTION", payload: question });
  };

  const setResult = (result: QuestionResultInterface) => {
    dispatch({ type: "SET_RESULT", payload: result });
  };

  const setChoices = (options: QuestionOptions | undefined) => {
    dispatch({ type: "SET_OPTIONS", payload: options });
  };

  const answer = (answer: Answer, questionId: number) => {
    sendPacket("answer", { answer, questionId });
  };

  const setAnswerCount = (answerCount: number) => {
    dispatch({ type: "SET_ANSWER_COUNT", payload: answerCount });
  };

  useEffect(() => {
    onMessage("new_question", (data: Question) => {
      setPage("question");
      setQuestion(data);
    });

    return () => {
      removeEvents("new_question");
    };
  }, []);

  return (
    <QuestionContext.Provider value={{ ...state, setQuestion, setResult, answer, setChoices, setAnswerCount }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestion = (): QuestionContextType => {
  const context = useContext(QuestionContext);
  if (context === null) throw new Error("useQuestion must be used within a QuestionProvider");
  return context;
};

export const useQuestionResult = () => {
  const { result } = useQuestion();
  if (!result) throw new Error("useQuestionResult must be used within a QuestionProvider");
  return result;
};
