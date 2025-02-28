"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function TestSocket() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newSocket = io("wss://adapter.vbrag.online");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected with ID:", newSocket.id);
    });

    newSocket.on("test", (data) => {
      console.log("Received:", data);
    });

    return () => newSocket.disconnect();
  }, []);

  const sendViaWebSocket = () => {
    socket.emit("testqqq", {
      data: message,
    });
  };

  {
    /*const sendViaPost = () => {
    fetch("https://adapter.vbrag.online/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "test",
        data: "strange data",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("POST Response:", data));
  };*/
  }

  const sendViaPost = async () => {
    try {
      const response = await fetch("https://adapter.vbrag.online/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "test",
          data: "some data",
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      // Здесь вы можете обработать успешный ответ
      console.log("Request successful");
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full"
        placeholder="Enter message"
      />
      <button onClick={sendViaWebSocket} className="bg-blue-500 text-white p-2">
        Send via WebSocket
      </button>
      <button onClick={sendViaPost} className="bg-green-500 text-white p-2">
        Send via POST
      </button>
    </div>
  );
}

{
  /*"use client";
import { useEffect } from "react";
import { initSocket } from "../lib/socket";

export default function TestSocket() {
  useEffect(() => {
    const socket = initSocket();

    // Test event listener
    socket.on("test", (data) => {
      console.log("Received test event:", data);
    });

    // Send test event
    socket.emit("test", { message: "Hello from client" });

    return () => {
      socket.off("test");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="hidden">
      WebSocket Test Component (check browser console)
    </div>
  );
} */
}
