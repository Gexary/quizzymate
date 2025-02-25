"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AppConfig {
  [key: string]: any;
}

interface ConfigContextProps {
  config: AppConfig;
  updateConfig: (newConfig: AppConfig | ((prevConfig: AppConfig) => AppConfig), callback?: () => void) => void;
  getConfig: (key: string) => any;
  setConfigValue: (key: string, value: any, callback?: () => void) => void;
  removeConfig: (key: string) => void;
}

const CONFIG_KEY = "userConfig";

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<AppConfig>(() => {
    if (typeof window === "undefined") return {};
    try {
      const storedConfig = localStorage?.getItem(CONFIG_KEY);
      if (!storedConfig) localStorage?.setItem(CONFIG_KEY, "{}");
      return storedConfig ? JSON.parse(storedConfig) : {};
    } catch (error) {
      localStorage?.setItem(CONFIG_KEY, "{}");
      return {};
    }
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateConfig = (newConfig: AppConfig | ((prevConfig: AppConfig) => AppConfig)) => {
    setConfig((prevConfig) => {
      const finalConfig = typeof newConfig === "function" ? newConfig(prevConfig) : { ...prevConfig, ...newConfig };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(finalConfig));
      return finalConfig;
    });
  };

  const getConfig = (key: string) => config[key];
  const setConfigValue = (key: string, value: any) => updateConfig({ [key]: value });

  const removeConfig = (key: string) => {
    updateConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      delete newConfig[key];
      return newConfig;
    });
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, getConfig, setConfigValue, removeConfig }}>
      {isClient && children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export const useUsername = () => {
  const { config, setConfigValue } = useConfig();
  const username = config?.username?.trim() || "";

  const updateUsername = (newUsername: string) => {
    setConfigValue("username", newUsername);
  };

  return { username, updateUsername };
};
