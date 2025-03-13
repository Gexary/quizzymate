import LanguageSelector from "@/components/(creation)/LanguageSelector";
import LevelSelector from "@/components/(creation)/LevelSelector";
import { CompleteTextarea, ToggleLabel } from "@/components/inputs";
import SliderSection from "@/components/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useConfig } from "@/hooks/useConfig";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { usePage } from "../../contexts/page.context";
import { useQuiz } from "../../contexts/quiz.context";
import { useWebsocket } from "../../contexts/websocket.context";
import { Language } from "./CreationForm";

const createQuizSchema = (isPasswordRequired: boolean) =>
  z.object({
    subject: z.string().min(1, "This field is required"),
    settings: z.object({
      level: z.enum(["easy", "medium", "hard"]),
      questionCount: z.number().min(1).max(40),
      language: z.enum(["en-US", "es-ES", "fr-FR", "zh-CN", "ar-AR"]),
    }),
    password: isPasswordRequired
      ? z.string().min(1, "Please enter your room password").max(255, "Password is too long")
      : z.string().optional(),
  });

type CreateQuizFormValues = z.infer<ReturnType<typeof createQuizSchema>>;

const languages = ["en-US", "es-ES", "fr-FR", "zh-CN", "ar-AR"];

export function CreateQuiz() {
  const { connect, onMessage, removeEvents, onCloseEvent, removeMessageEvent } = useWebsocket();
  const { setPage } = usePage();
  const { displayError } = useToast();

  const [disabled, setDisabled] = useState(false);
  const [serverErrors, setErrors] = useState<any>({});
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const localLang = useConfig().getConfig("language");
  const browserLang = navigator.language;
  const browserLangCode = browserLang.split("-")[0];
  const { setAdmin } = useQuiz();
  const language = languages.filter((item) => item.startsWith(browserLangCode))[0] as Language;

  const {
    register,
    handleSubmit,
    control,
    setFocus,
    formState: { errors },
  } = useForm<CreateQuizFormValues>({
    resolver: zodResolver(createQuizSchema(isPasswordRequired)),
    defaultValues: {
      settings: {
        language: localLang || language || "en-US",
        level: "easy",
        questionCount: 10,
      },
    },
  });

  useEffect(() => {
    const kickListener = (data: any) => {
      displayError(data.reason);
      setDisabled(false);
    };
    const closeListener = () => {
      displayError("Connection closed, please try again");
      setDisabled(false);
    };
    setFocus("subject");
    const joinListener = () => {
      setAdmin(true);
      setDisabled(false);
    };
    onMessage("room_info", joinListener);
    onCloseEvent(closeListener);
    onMessage("kick", kickListener);
    return () => {
      removeMessageEvent("kick", kickListener);
      removeMessageEvent("_close", closeListener);
    };
  }, []);

  const onSubmit: SubmitHandler<CreateQuizFormValues> = (data) => {
    if (!data.password) delete data.password;
    setDisabled(true);
    connect("create_quiz", data);
  };

  return (
    <Card className="p-8 flex flex-col gap-4 w-[30rem]">
      <h1 className="text-2xl font-bold">Build your own quiz!</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CompleteTextarea
          required={true}
          label="Quiz Subject"
          placeholder="Type your subject, e.g. Math..."
          {...register("subject", { required: "This field is required" })}
          error={errors.subject?.message || serverErrors.subject?.message}
          disabled={disabled}
          description="Use this field to describe all possible questions in your quiz. Add as many details as you want."
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="settings.language"
            control={control}
            render={({ field }) => <LanguageSelector {...field} disabled={disabled} />}
          />
          <Controller
            name="settings.level"
            control={control}
            render={({ field }) => <LevelSelector {...field} disabled={disabled} />}
          />
        </div>
        <SliderSection {...register("settings.questionCount")} disabled={disabled} />
        <ToggleLabel
          {...register("password")}
          disabled={disabled}
          checked={isPasswordRequired}
          setChecked={setIsPasswordRequired}
        />
        <div className="flex flex-col gap-2 mt-4">
          <Button disabled={disabled} type="submit" variant="primary">
            Generate the Quiz
            {disabled ? <Loader2 className="animate-spin" /> : <Sparkles size={16} strokeWidth={2} aria-hidden="true" />}
          </Button>
          <Button className="group" variant="outline" onClick={() => setPage("browse_quiz")}>
            Browse generated quizzes
            <ArrowRight
              className="transition-transform group-hover:translate-x-0.5"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </div>
      </form>
    </Card>
  );
}
