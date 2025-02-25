import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AppGlobalState {
  [key: string]: any;
}

interface GlobalStateContextProps {
  globalState: AppGlobalState;
  updateGlobalState: (newState: AppGlobalState | ((prevState: AppGlobalState) => AppGlobalState), callback?: () => void) => void;
  getGlobalState: (key: string) => any;
  setGlobalStateValue: (key: string, value: any, callback?: () => void) => void;
  removeGlobalState: (key: string) => void;
}

const GLOBAL_STATE_KEY = "globalState";

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [globalState, setGlobalState] = useState<AppGlobalState>(() => {
    if (typeof window === "undefined") return {};
    try {
      const storedGlobalState = localStorage?.getItem(GLOBAL_STATE_KEY);
      if (!storedGlobalState) localStorage?.setItem(GLOBAL_STATE_KEY, "{}");
      return storedGlobalState ? JSON.parse(storedGlobalState) : {};
    } catch (error) {
      localStorage?.setItem(GLOBAL_STATE_KEY, "{}");
      return {};
    }
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateGlobalState = (newState: AppGlobalState | ((prevState: AppGlobalState) => AppGlobalState)) => {
    setGlobalState((prevState) => {
      const finalState = typeof newState === "function" ? newState(prevState) : { ...prevState, ...newState };
      localStorage.setItem(GLOBAL_STATE_KEY, JSON.stringify(finalState));
      return finalState;
    });
  };

  const getGlobalState = (key: string) => globalState[key];
  const setGlobalStateValue = (key: string, value: any) => updateGlobalState({ [key]: value });

  const removeGlobalState = (key: string) => {
    updateGlobalState((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
  };

  return (
    <GlobalStateContext.Provider
      value={{ globalState, updateGlobalState, getGlobalState, setGlobalStateValue, removeGlobalState }}
    >
      {isClient && children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

export const useUsername = () => {
  const { globalState, setGlobalStateValue } = useGlobalState();
  const username = globalState?.username?.trim() || "";

  const updateUsername = (newUsername: string) => {
    setGlobalStateValue("username", newUsername);
  };

  return { username, updateUsername };
};
