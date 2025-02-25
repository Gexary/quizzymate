import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatCorrectCount, formatPosition } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { QuestionResultInterface, useQuestion, useQuestionResult } from "../../contexts/question.context";
import { useQuiz } from "../../contexts/quiz.context";
import { useWebsocket } from "../../contexts/websocket.context";

export default function QuestionResult() {
  const { correct } = useQuestionResult();

  return (
    <div
      className={cn("bg-gradient-to-t h-screen w-full flex flex-col items-center justify-center", {
        "from-green-600 to-green-500": correct,
        "from-red-600 to-red-500": !correct,
      })}
    >
      <div className="flex flex-row items-center gap-4">
        <QuestionCorrection />
        <QuestionLeaderboard />
      </div>
    </div>
  );
}

function NextQuestionButton() {
  const { sendPacket } = useWebsocket();
  const { id } = useQuestion();
  const { questionCount } = useQuiz().settings;
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setIsLoading(true);
    sendPacket("next_question");
  };
  const handleEndClick = () => {
    setIsLoading(true);
    sendPacket("end_quiz");
  };
  if (questionCount === id + 1) {
    return (
      <Button onClick={handleEndClick} variant="primary" disabled={isLoading} className="mt-8 w-full">
        Next
        {isLoading ? <Loader2 className="animate-spin" /> : null}
      </Button>
    );
  }
  return (
    <Button onClick={handleClick} variant="primary" disabled={isLoading} className="mt-8 w-full">
      Next question
      {isLoading ? <Loader2 className="animate-spin" /> : null}
    </Button>
  );
}

function QuestionCorrection() {
  const { isAdmin } = useQuiz();
  const { correct, correctCount, correctAnswer, points } = useQuestionResult();
  return (
    <Card className="w-[30rem] p-8">
      <h1 className="text-center text-2xl font-bold text-foreground mb-2">{correct ? "Correct" : "Incorrect"}</h1>
      <div className="flex flex-row items-center gap-4 w-full">
        <Image
          src={correct ? "./correct.svg" : "./incorrect.svg"}
          alt="Correct"
          width={200}
          height={200}
          className="inline-block h-16 w-auto"
        />
        <div className="text-center text-2xl font-bold text-foreground bg-muted rounded-sm px-4 py-2 w-full border border-input">
          {`${points > 0 ? "+" : ""}${points}`}
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-2">{formatCorrectCount(correctCount)}</p>
      <p className="text-sm text-foreground mt-2 mb-2">The correct answer was:</p>
      <CorrectAnswer answer={correctAnswer} />
      {isAdmin ? <NextQuestionButton /> : null}
    </Card>
  );
}

function CorrectAnswer({ answer }: { answer: QuestionResultInterface }) {
  const { questionType, choices } = useQuestion();

  switch (questionType) {
    case "single_choice":
      return <AnswerText answer={choices[answer]} />;
    case "free_text":
      return (
        <div className="flex flex-row gap-1 w-full">
          {answer.map((answer, index) => (
            <AnswerText answer={answer} key={index} />
          ))}
        </div>
      );
    case "multiple_choice":
      return (
        <div className="flex flex-row gap-1 w-full">
          {answer.map((answer, index) => (
            <AnswerText answer={choices[answer]} key={index} />
          ))}
        </div>
      );
    case "true_or_false":
      return <AnswerText answer={answer ? "Vrai" : "Faux"} />;
  }
}

function AnswerText({ answer }: { answer: string }) {
  return (
    <div className="text-center text-foreground px-4 py-1 rounded-lg border text-base font-medium inline-block bg-zinc-100 text-zinc-900 border-zinc-200">
      {answer}
    </div>
  );
}

function UserPosition({ position }: { position: number }) {
  if (position > 2) return `${position + 1}`;
  return (
    <Image
      src={`./top${position + 1}.svg`}
      alt={`Top ${position + 1}`}
      width={24}
      height={24}
      className="inline-block h-4 w-auto scale-[175%]"
    />
  );
}

function QuestionLeaderboard() {
  const { leaderboard, position } = useQuestionResult();
  return (
    <Card className="w-[30rem] p-8">
      <h1 className="text-center text-2xl font-bold text-foreground mb-4 flex flex-row items-center gap-4 justify-center">
        <Image src="./trophee.png" alt="logo" width={200} height={200} className="inline-block h-6 w-auto scale-[175%]" />
        Top {Math.min(leaderboard.length, 5)} player{leaderboard.length > 1 && "s"}
      </h1>
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-14 "></TableHead>
            <TableHead>Username</TableHead>
            <TableHead className="text-center w-28">Score</TableHead>
          </TableRow>
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-2"></tbody>
        <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
          {leaderboard.map((item, i) => (
            <TableRow key={i} className="border-none odd:bg-muted/50 hover:bg-transparent odd:hover:bg-muted/50">
              <TableCell className="py-2.5 text-center">
                <UserPosition position={i} />
              </TableCell>
              <TableCell className="py-2.5 font-medium">{item.username}</TableCell>
              <TableCell className="py-2.5 text-center">{item.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-center text-sm text-muted-foreground">Leaderboard, your are the {formatPosition(position)} one</p>
    </Card>
  );
}
