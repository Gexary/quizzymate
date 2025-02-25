import { createContext, useContext, useEffect, useReducer } from "react";
import { usePage } from "./page.context";
import { useWebsocket } from "./websocket.context";

export interface Quiz {
  roomId: string;
  title: string;
  description: string;
  users: string[];
  userCount: number;
  admin: string;
  isAdmin: boolean;
  settings: {
    level: string;
    questionCount: number;
    language: string;
  };
}

interface QuizContext extends Quiz {
  setAdmin: (isAdmin: boolean) => void;
  setQuiz: (quiz: any) => void;
}

const QuizContext = createContext<QuizContext | null>(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === null) throw new Error("useQuiz must be used within a QuizProvider");
  return context;
};

const initialState: QuizContext = {
  roomId: "",
  title: "",
  description: "",
  admin: "",
  users: [],
  userCount: 0,
  isAdmin: false,
  settings: {
    level: "",
    questionCount: 0,
    language: "",
  },
  setAdmin: () => {},
  setQuiz: () => {},
};

const quizReducer = (state: QuizContext, action: any) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.payload.username],
        userCount: action.payload.userCount,
      };
    case "REMOVE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user !== action.payload.username),
        userCount: action.payload.userCount,
      };
    case "SET_QUIZ":
      return {
        ...state,
        ...action.payload,
      };
    case "SET_ADMIN":
      return {
        ...state,
        isAdmin: action.payload,
      };
    default:
      return state;
  }
};

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { onMessage, removeEvents } = useWebsocket();
  const { setPage } = usePage();

  const dispatchAction = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const updateUsers = (action: string, data: { username: string; userCount: number }) => {
    dispatchAction(action, data);
  };

  const setQuiz = (quiz: any) => {
    dispatchAction("SET_QUIZ", quiz);
  };

  useEffect(() => {
    onMessage("room_info", (data) => {
      setQuiz(data);
      setPage("waiting_room");
    });
    onMessage("new_user", (data) => updateUsers("ADD_USER", data));
    onMessage("user_left", (data) => updateUsers("REMOVE_USER", data));

    return () => {
      removeEvents("new_user", "user_left");
    };
  }, []);

  const setAdmin = (admin: boolean) => {
    dispatchAction("SET_ADMIN", admin);
  };

  return <QuizContext.Provider value={{ ...state, setQuiz, setAdmin }}>{children}</QuizContext.Provider>;
}
