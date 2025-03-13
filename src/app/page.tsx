"use client";

import { Background } from "@/components/ui/background";
import { Card } from "@/components/ui/card";
import { useUsername } from "@/hooks/useConfig";
import { JSX } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import { PageProvider, PageType, usePage } from "../contexts/page.context";
import { QuestionProvider } from "../contexts/question.context";
import { QuizProvider } from "../contexts/quiz.context";
import { WebsocketProvider } from "../contexts/websocket.context";
import { CreateQuiz } from "./(creation)/CreateQuiz";
import Question from "./(question)/Question";
import QuestionResultDisplay from "./(question)/QuestionResult";
import { Countdown } from "./(question)/StartingCount";
import FinalLeaderboard from "./(quiz)/FinalLeaderboard";
import { MainMenu } from "./(quiz)/MainMenu";
import WaitingRoom from "./(quiz)/WaitingRoom";
import UsernameEdit from "./(username)/UsernameEdit";
import { UsernameMenu } from "./(username)/UsernameForm";

const pages: PageType[] = [{ name: "menu_username" }, { name: "menu_join_room" }, { name: "menu_create_quiz" }];

export default function Page() {
  const { username } = useUsername();

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {/* <AppGlobalState> */}
      <PageProvider pages={pages} defaultPage={username === "" ? "username_form" : "main_menu"}>
        <WebsocketProvider>
          <QuizProvider>
            <QuestionProvider>
              <PageContent />
            </QuestionProvider>
          </QuizProvider>
        </WebsocketProvider>
      </PageProvider>
      {/* </AppGlobalState> */}
    </>
  );
}

function PageContent(): JSX.Element {
  const { currentPage } = usePage();

  switch (currentPage) {
    case "username_form":
      return (
        <Background>
          <UsernameMenu />
        </Background>
      );
    case "main_menu":
      return (
        <Background>
          <MainMenu />
          <UsernameEdit />
        </Background>
      );
    case "create_quiz":
      return (
        <Background>
          <CreateQuiz />
        </Background>
      );
    case "waiting_room":
      return (
        <Background color="purple">
          <WaitingRoom />
        </Background>
      );
    case "starting_count":
      return (
        <Background>
          <Countdown />
        </Background>
      );
    case "question":
      return (
        <Background>
          <Question />
        </Background>
      );
    case "question_result":
      return <QuestionResultDisplay />;
    case "final_leaderboard":
      return <FinalLeaderboard />;
    default:
      return (
        <Background>
          <Card className="p-8">
            <h1 className="text-center text-2xl font-bold text-foreground mb-4">Page not found</h1>
            <p className="text-center text-sm text-muted-foreground">
              The page you are looking for does not exist or will be available soon.
            </p>
          </Card>
        </Background>
      );
  }
}

// TODO: add quiz favicon and Logo everywhere
