export type PageColor = "red" | "blue" | "green" | "purple";
export const defaultColor: PageColor = "blue";

export interface PageConfig {
  name: string;
  backgroundColor?: PageColor;
  // title: string;
  // description: string;
  // icon: string;
}

export const appPages: Record<string, PageConfig> = {
  USERNAME_FORM: {
    name: "username_form",
  },
  MAIN_MENU: {
    name: "main_menu",
  },
  CREATE_QUIZ: {
    name: "create_quiz",
  },
  WAITING_ROOM: {
    name: "waiting_room",
    backgroundColor: "purple",
  },
  STARTING_COUNT: {
    name: "starting_count",
  },
  QUESTION: {
    name: "question",
  },
  QUESTION_RESULT: {
    name: "question_result",
  },
};
