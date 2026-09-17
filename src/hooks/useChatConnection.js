import { useEffect, useRef, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { BASE_URL } from "constants/common";

export default function useChatConnection(onMessage) {
  const connectionRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // Giữ callback mới nhất mà không cần reconnect
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/chat`, {
        accessTokenFactory: () => localStorage.getItem("accessToken"),
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveMessage", (msg) => onMessageRef.current?.(msg));
    connection.onreconnected(() => setConnected(true));
    connection.onclose(() => setConnected(false));

    connection
      .start()
      .then(() => setConnected(true))
      .catch(() => setConnected(false));

    connectionRef.current = connection;
    return () => connection.stop();
  }, []);

  return { connectionRef, connected };
}