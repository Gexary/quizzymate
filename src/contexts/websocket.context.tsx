import { useUsername } from "@/hooks/useConfig";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";

type WebsocketContextType = {
  connect: (type: string, data: any) => void;
  sendPacket: (packetType: string, data?: any) => void;
  onMessage: (packetType: string, callback: (data: any) => void) => void;
  removeMessageEvent: (packetType: string, callback: (data: any) => void) => void;
  removeEvents: (...packetTypes: string[]) => void;
  ws: React.RefObject<WebSocket | null>;
  onCloseEvent: (callback: () => void) => void;
} | null;

export const WebsocketContext = createContext<WebsocketContextType>(null);

// const WS_URL = "ws://localhost:8080/";
const WS_URL = "wss://quiz-app-backend-1p6i.onrender.com/";

interface WebsocketProviderProps {
  children: ReactNode;
}

export const WebsocketProvider: React.FC<WebsocketProviderProps> = ({ children }) => {
  const { username } = useUsername();
  const ws = useRef<WebSocket | null>(null);
  const isKick = useRef<boolean>(false);
  const listeners = useRef<Record<string, ((data?: any) => void)[]>>({
    kick: [
      () => {
        isKick.current = true;
      },
    ],
  });

  const sendPacket = (packetType: string, data = {}) => {
    ws.current?.send(JSON.stringify({ type: packetType, ...data }));
  };

  const sendConnectPacket = (packetType: string, data: any) => sendPacket(packetType, { ...data, username });

  const onClose = () => {
    ws.current = null;
    if (isKick.current) {
      isKick.current = false;
      return;
    }
    const closeListeners = listeners.current["_close"];
    if (closeListeners) closeListeners.forEach((callback) => callback());
  };

  const connect = (type: string, data: any) => {
    if (ws.current) ws.current.close();
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => sendConnectPacket(type, data);
    socket.onclose = onClose;
    socket.onmessage = onMessageEvent;
  };

  useEffect(() => () => ws.current?.close(), []);

  const onMessage = (packetType: string, callback: (data: any) => void) => {
    listeners.current[packetType] = [...(listeners.current[packetType] || []), callback];
  };

  const removeMessageEvent = (packetType: string, callback: (data: any) => void) => {
    listeners.current[packetType] = (listeners.current[packetType] || []).filter((cb) => cb !== callback);
  };

  const removeEvents = (...packetTypes: string[]) => {
    for (const packetType of packetTypes) delete listeners.current[packetType];
  };

  const onCloseEvent = (callback: () => void) => {
    listeners.current["_close"] = (listeners.current["close"] || []).concat(callback);
  };

  const onMessageEvent = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const { type } = data;
      listeners.current[type]?.forEach((callback) => callback(data));
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  return (
    <WebsocketContext.Provider value={{ connect, sendPacket, onMessage, removeMessageEvent, ws, removeEvents, onCloseEvent }}>
      {children}
    </WebsocketContext.Provider>
  );
};

export const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (!context) throw new Error("useWebsocket must be used within a WebsocketProvider");
  return context;
};

const useQuizLoading = () => {};
