import { Card } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { useToast } from "@/hooks/useToast";
import { plural } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { usePage } from "../../contexts/page.context";
import { useQuestion } from "../../contexts/question.context";
import { useQuiz } from "../../contexts/quiz.context";
import { useWebsocket } from "../../contexts/websocket.context";
import MultipleChoice, { FreeText, ProgressBar, SingleChoice, TrueOrFalse } from "./MultipleChoice";

export default function Question() {
  const { id, timeLimit, answerCount, setResult, question, setChoices, choices, setAnswerCount } = useQuestion();
  const { onMessage, onCloseEvent, removeMessageEvent } = useWebsocket();
  const { setPage } = usePage();
  const { questionCount } = useQuiz().settings;
  const [choicesState, setChoicesState] = useState(choices);
  const [isWaiting, setIsWaiting] = useState(false);
  const { percentage, remainingTime, startProgress } = useProgress(timeLimit);
  const { displayError } = useToast();

  useEffect(() => {
    setChoices(undefined);
    const kickListener = (data: any) => {
      setPage("main_menu");
      displayError(`You have been kicked from the quiz${", reason: " + data.reason} !`);
    };
    const answerCountListener = (data: any) => {
      setAnswerCount(data.answerCount);
    };
    const questionEndListener = (data: any) => {
      setResult(data);
      setChoicesState(null);
      setPage("question_result");
    };
    const questionChoicesListener = (data: any) => {
      setChoices(data);
      startProgress();
      setChoicesState(data);
    };
    const waitAnswerListener = (data: any) => {
      setIsWaiting(true);
    };
    onMessage("kick", kickListener);
    onMessage("answer_count", answerCountListener);
    onMessage("question_end", questionEndListener);
    onMessage("question_choices", questionChoicesListener);
    onMessage("wait_answer", waitAnswerListener);

    const closeListener = () => {
      setPage("main_menu");
      displayError(`You have been disconnected from the quiz !`);
    };
    onCloseEvent(closeListener);
    return () => {
      removeMessageEvent("kick", kickListener);
      removeMessageEvent("answer_count", answerCountListener);
      removeMessageEvent("question_end", questionEndListener);
      removeMessageEvent("question_choices", questionChoicesListener);
      removeMessageEvent("wait_answer", waitAnswerListener);
      removeMessageEvent("_close", closeListener);
    };
  }, []);

  useEffect(() => {
    document.title = question;
  }, []);

  if (isWaiting) return <QuestionWaiting />;
  return (
    <Card className="flex flex-col items-center justify-center w-[64rem] gap-4 p-8">
      <div className="flex flex-row items-center w-full gap-8 h-min">
        {/* <div className="w-16 h-16">
          <Image src="/images/multiple_choice.png" alt="logo" width={200} height={200} className="h-16 w-auto" />
        </div> */}
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="grid grid-cols-3 w-full">
            <span className="text-base font-bold text-center border border-zinc-300 p-2 px-4 rounded-full bg-zinc-100 mr-auto">
              {plural(remainingTime, "seconde")}
            </span>
            <span className="text-base font-bold text-center border border-zinc-300 p-2 px-4 rounded-full bg-zinc-100 mx-auto">
              {id + 1}/{questionCount}
            </span>
            <span className="text-base font-bold text-center border border-zinc-300 p-2 px-4 rounded-full bg-zinc-100 ml-auto">
              {plural(answerCount, "réponse")}
            </span>
          </div>
          <ProgressBar percentage={percentage} />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-center py-2 w-full leading-relaxed text-zinc-900">{question}</h1>
      {choicesState ? <QuestionChoices /> : null}
    </Card>
  );
}

function QuestionWaiting() {
  return (
    <Card className="flex flex-col items-center justify-center w-[64rem] gap-4 p-8">
      <div className="flex flex-row items-center w-full gap-8 h-min">
        <Loader2 className="animate-spin" />
        <h1 className="text-4xl font-bold text-center py-2 w-full leading-relaxed text-zinc-900">
          Waiting for answer or end of time ...
        </h1>
      </div>
    </Card>
  );
}

function QuestionChoices() {
  const { questionType } = useQuestion();
  switch (questionType) {
    case "multiple_choice":
      return <MultipleChoice />;
    case "true_or_false":
      return <TrueOrFalse />;
    case "free_text":
      return <FreeText />;
    case "single_choice":
      return <SingleChoice />;
    default:
      return null;
  }
}
