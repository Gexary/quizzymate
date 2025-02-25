"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePage } from "@/contexts/page.context";
import { cn, plural } from "@/lib/utils";
import Image from "next/image";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import { Level } from "../(creation)/CreationForm";
import { useQuiz } from "../../contexts/quiz.context";
import { useWebsocket } from "../../contexts/websocket.context";

export default function WaitingRoom() {
  const { onMessage, removeEvents } = useWebsocket();
  const { setPage } = usePage();

  useEffect(() => {
    onMessage("quiz_started", () => {
      setPage("starting_count");
    });
    return () => {
      removeEvents("quiz_started");
    };
  }, []);

  return (
    <div className="parent py-16 px-32 w-full gap-4">
      <QuizInfo />
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Image src="./quizzy_mate_logo.png" alt="logo" width={240} height={240} />
      </div>
      <QuizPlayers />
      <QuizJoinMethod />
    </div>
  );
}

function QuizInfo() {
  const {
    title,
    description,
    settings: { level, questionCount },
  } = useQuiz();
  return (
    <Card className="flex flex-col w-full p-8">
      <h1 className="text-3xl font-bold mb-4 text-zinc-800">{title}</h1>
      <p className="text-zinc-600 leading-relaxed">{description}</p>
      <div className="flex flex-row gap-2 mt-2 items-center">
        <Badge variant="outline" className="gap-1.5 w-fit">
          {plural(questionCount, "question")}
        </Badge>
        <Badge variant="outline" className="gap-1.5 w-fit">
          <span className={cn("size-1.5 rounded-full", colors[level])} aria-hidden="true"></span>
          {level}
        </Badge>
      </div>
    </Card>
  );
}

function QuizPlayers() {
  const { userCount } = useQuiz();
  return (
    <Card className="w-full p-8">
      <div className="flex items-center justify-center gap-4 mb-8 w-full">
        <Image src="./images/worldwide.png" alt="logo" width={64} height={64} className="w-12 h-12" />
        <span className="text-2xl font-semibold text-gray-700">{plural(userCount, "player")}</span>
      </div>
      <UserList />
    </Card>
  );
}

function QuizJoinMethod() {
  const { isAdmin, roomId } = useQuiz();
  const { sendPacket } = useWebsocket();
  const startQuiz = () => {
    sendPacket("start_quiz", {});
  };
  if (!isAdmin) return null;
  return (
    <Card className="p-8 h-fit flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4 text-zinc-800">Comment rejoindre la partie ?</h2>
        <p className="text-zinc-600 leading-relaxed">
          Pour rejoindre la partie, scannez le code QR ci-dessous avec votre appareil mobile ou entrez le code de jeu sur{" "}
          <span className="text-blue-600 underline">quiz.com</span>.
        </p>
      </div>
      <div className="flex flex-row gap-4">
        <div>
          <label className="block text-base font-medium text-gray-800 mb-2">Code du quiz:</label>
          <div className="text-5xl font-bold text-blue-600 tracking-wider cursor-pointer">{roomId}</div>
        </div>
        <Separator orientation="vertical" />
        <div className="w-full h-28">
          <QRCode
            size={256}
            style={{ height: "100%", maxHeight: "100%", width: "auto" }}
            value={`http://localhost:3000/room/${roomId}`}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>
      <Button variant="primary" className="w-full" onClick={startQuiz}>
        Démarrer la partie
      </Button>
    </Card>
  );
}

const colors: Record<Level, "bg-emerald-500" | "bg-yellow-500" | "bg-red-500"> = {
  easy: "bg-emerald-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
};

function UserList() {
  const { users } = useQuiz();
  return (
    <div className="flex flex-row flex-wrap items-start gap-4 justify-center content-start w-full h-full overflow-y-auto">
      {users.map((user) => (
        <UsernameTag key={user} username={user} />
      ))}
    </div>
  );
}

function UsernameTag({ username }: { username: string }) {
  return (
    <div className="bg-white rounded-lg py-2 px-4 border border-gray-200 text-base text-gray-700">
      {username === "" ? "\u00A0" : username}
    </div>
  );
}
