"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import socket from "@/lib/socket";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const { chatname } = useParams();

  const router = useRouter();

  useEffect(() => {
    socket.emit("join-chat", chatname);
  }, [chatname]);

  useEffect(() => {
    !socket.connected && router.push("/");

    socket.on("message", (message) => {
      console.log("recebeu mensagem");
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();

    setMessage("");

    socket.emit("send-message", { chatname, message });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <h1 className="mb-6">Welcome to {chatname}</h1>
      <div className="w-[270px] h-[300px] border rounded-md p-4 space-y-2 overflow-y-auto">
        <p className="text-zinc-400">O chat começa aqui!</p>
        {messages.map((message, i) => (
          <div key={i}>
            <p className="text-sm">{message}</p>
          </div>
        ))}
      </div>
      <form className="w-[270px] flex mt-2 gap-2" onSubmit={sendMessage}>
        <Input
          placeholder="Digite sua mensagem"
          value={message}
          onChange={({ target }) => setMessage(target.value)}
        />
        <Button disabled={!message}>Enviar</Button>
      </form>
    </div>
  );
};

export default ChatPage;
