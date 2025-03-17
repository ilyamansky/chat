"use client";
//import { useContext, useEffect, useState, use } from "react";
import { ChatContext } from "../../chatState";
import Head from "next/head";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import ChatDetails from "../../components/ChatDetails";
import ChatInput from "@/app/components/ChatInput";
//import { useRouter } from "next/navigation";
//import { useSelector } from "react-redux";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export default function ChatPage({ params }) {
  //const { name } = params;
  const { name } = use(params);
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const currentToken = token || storedToken;

    if (!currentToken) {
      router.push("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(currentToken);
      const userId = decodedToken.user_id.toString(); // Convert to string to match URL param

      // Validate URL parameter against token's user ID
      if (userId !== name) {
        router.push("/");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("jwtToken");
      router.push("/");
    }
  }, [token, name, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-custom-bg-gray">
      <div className="w-screen justify-center h-screen shadow-xl flex">
        <ChatList />
        <ChatWindow />
        <ChatDetails />
      </div>
    </div>
  );
}

{
  /*"use client";

import { useContext, useEffect, useState, use } from "react";
import { ChatContext } from "../../chatState";
import Head from "next/head";
import ChatList from "../../components/ChatList";
import ChatWindow from "../../components/ChatWindow";
import ChatDetails from "../../components/ChatDetails";
import ChatInput from "@/app/components/ChatInput";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ChatPage({ params }) {
  const { name } = use(params);
  console.log(name, "name");
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (!token && !storedToken && !name) {
      router.push("/");
    }

    
  }, [token, name, router]);

  if (!token) {
    return null; // Loading state
  }

  return (
    <div className="h-screen flex items-center justify-center bg-custom-bg-gray">
      <div className="w-screen h-screen shadow-xl flex">
      
        <ChatList />
    

        
        <ChatWindow />

        <ChatDetails />
      </div>
    </div>
  );
}
*/
}
