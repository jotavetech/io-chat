"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import socket from "@/lib/socket";
import { useRouter } from "next/navigation";

import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [chatname, setChatname] = useState("");
  const [chats, setChats] = useState<string[]>(["geral", "esportes", "games"]);

  const router = useRouter();

  useEffect(() => {
    socket.emit("connected");

    socket.on("received-chat", (chatname) => {
      setChats((prev) => [...prev, chatname]);
    });

    return () => {
      socket.off("connected");
      socket.off("received-chat");
    };
  }, []);

  const createChat = (e: FormEvent) => {
    e.preventDefault();

    socket.emit("create-chat", chatname);

    router.push(`/chat/${chatname}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <h1 className="text-center text-lg mb-5">socket chat!</h1>
        <form className="space-y-2" onSubmit={createChat}>
          <Input
            placeholder="nome do chat"
            type="text"
            value={chatname}
            onChange={({ target }) => setChatname(target.value)}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={chatname.length < 3}
          >
            criar chat
          </Button>
        </form>

        <div className="flex mt-2 w-[300px] flex-wrap gap-2 justify-center">
          {chats.map((chat) => (
            <Button
              key={chat}
              variant={"outline"}
              onClick={() => router.push(`/chat/${chat}`)}
            >
              {chat}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
