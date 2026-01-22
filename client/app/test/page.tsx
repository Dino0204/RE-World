"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/shared/api";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export default function WebSocketTestPage() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const socketRef = useRef<ReturnType<typeof api.chat.subscribe> | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current) {
      return;
    }

    setConnectionStatus("connecting");

    const socket = api.chat.subscribe();

    socket.on("open", () => {
      setConnectionStatus("connected");
      setMessages((previousMessages) => [
        ...previousMessages,
        "[시스템] 서버에 연결되었습니다.",
      ]);
    });

    socket.on("message", (event: MessageEvent) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        `[서버] ${event.data}`,
      ]);
    });

    socket.on("error", () => {
      setConnectionStatus("error");
      setMessages((previousMessages) => [
        ...previousMessages,
        "[시스템] 연결 오류가 발생했습니다.",
      ]);
    });

    socket.on("close", () => {
      setConnectionStatus("disconnected");
      setMessages((previousMessages) => [
        ...previousMessages,
        "[시스템] 연결이 종료되었습니다.",
      ]);
      socketRef.current = null;
    });

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (socketRef.current && inputMessage) {
      socketRef.current.send(inputMessage);
      setMessages((previousMessages) => [
        ...previousMessages,
        `[나] ${inputMessage}`,
      ]);
      setInputMessage("");
    }
  }, [inputMessage]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    },
    [sendMessage],
  );

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return "text-green-500";
      case "connecting":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return "연결됨";
      case "connecting":
        return "연결 중...";
      case "error":
        return "오류";
      default:
        return "연결 안됨";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          WebSocket 통신 테스트 (Eden Treaty)
        </h1>

        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>상태:</span>
              <span
                className={`font-semibold ${getStatusColor(connectionStatus)}`}
              >
                {getStatusText(connectionStatus)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={connect}
                disabled={
                  connectionStatus === "connected" ||
                  connectionStatus === "connecting"
                }
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                연결
              </button>
              <button
                onClick={disconnect}
                disabled={connectionStatus === "disconnected"}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                연결 해제
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              disabled={connectionStatus !== "connected"}
              className="flex-1 px-4 py-2 bg-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={connectionStatus !== "connected" || !inputMessage}
              className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전송
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">메시지 로그</h2>
          <div className="h-96 overflow-y-auto bg-gray-900 rounded p-4 space-y-2">
            {messages.length === 0 ? (
              <p className="text-gray-500">
                메시지가 없습니다. 서버에 연결해주세요.
              </p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    message.startsWith("[시스템]")
                      ? "bg-gray-700 text-gray-300"
                      : message.startsWith("[서버]")
                        ? "bg-blue-900 text-blue-200"
                        : "bg-green-900 text-green-200"
                  }`}
                >
                  {message}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">테스트 방법</h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-300">
            <li>서버가 실행 중인지 확인하세요 (포트 3001)</li>
            <li>
              &quot;연결&quot; 버튼을 클릭하여 WebSocket 연결을 시작합니다
            </li>
            <li>메시지를 입력하고 &quot;전송&quot; 버튼을 클릭합니다</li>
            <li>서버가 메시지를 에코백하면 메시지 로그에 표시됩니다</li>
          </ol>
        </div>

        <div className="mt-6 p-4 bg-indigo-900/50 rounded-lg border border-indigo-500/30">
          <h2 className="text-xl font-semibold mb-2 text-indigo-300">
            Eden Treaty 정보
          </h2>
          <p className="text-gray-300">
            이 페이지는 ElysiaJS Eden Treaty를 사용하여 타입 안전한 WebSocket
            통신을 구현했습니다. 서버의 타입 정의가 클라이언트에 자동으로
            공유됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
