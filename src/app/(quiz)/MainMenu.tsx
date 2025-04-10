"use client";

import { CompleteInput, ToggleLabel } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePage } from "@/contexts/page.context";
import { useWebsocket } from "@/contexts/websocket.context";
import { useToast } from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const CODE_LENGTH = 6

const joinRoomSchema = (isPasswordRequired: boolean) =>
  z.object({
    roomId: z
      .string()
      .trim()
      .length(CODE_LENGTH, `Invalid room id, please enter ${CODE_LENGTH} digits code`)
      .regex(/^[1-9][0-9]*$/, "Invalid room id"),
    password: isPasswordRequired
      ? z.string().min(1, "Please enter your room password").max(255, "Password is too long")
      : z.string().optional(),
  });

type joinRoomForm = z.infer<ReturnType<typeof joinRoomSchema>>;

export function MainMenu() {
  const { setPage } = usePage();
  const { connect, onMessage, onCloseEvent, removeMessageEvent } = useWebsocket();
  const { displayError } = useToast();

  const [loading, setLoading] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);

  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<joinRoomForm>({
    resolver: zodResolver(joinRoomSchema(isPasswordRequired)),
  });

  useEffect(() => {
    const kickListener = (data: any) => {
      setLoading(false);
      const reason = data.reason;
      if (typeof reason === "string") displayError(reason);
      else {
        const errorField = Object.keys(reason)[0];
        if (errorField === "password") setIsPasswordRequired(true);
        setError(errorField as keyof joinRoomForm, { type: "manual", message: reason[errorField] });
        // setTimeout(() => {
        //   setFocus(errorField as keyof joinRoomForm);
        // }, 10);
      }
    };
    const joinListener = (data: any) => {
      setLoading(false);
    };
    const closeListener = () => {
      setLoading(false);
      displayError("Connection closed, please try again");
    };
    onMessage("kick", kickListener);
    onMessage("room_info", joinListener);
    onCloseEvent(closeListener);
    return () => {
      removeMessageEvent("kick", kickListener);
      removeMessageEvent("_close", closeListener);
    };
  }, []);

  const onSubmit: SubmitHandler<joinRoomForm> = ({ roomId, password }) => {
    setLoading(true);
    const data: { roomId: string; password?: string } = { roomId };
    if (password) data.password = password;
    connect("join_room", data);
  };

  return (
    <Card className="p-8 w-[30rem]">
      <h1 className="text-2xl font-bold mb-4">Welcome to Quizzy Mate!</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CompleteInput
          label="Room id"
          placeholder={`${CODE_LENGTH} digits code for your room`}
          error={errors.roomId?.message}
          disabled={loading}
          maxLength={CODE_LENGTH}
          {...register("roomId")}
        />
        <ToggleLabel
          label="Room password"
          className="mt-0"
          error={errors.password?.message}
          disabled={loading}
          checked={isPasswordRequired}
          setChecked={setIsPasswordRequired}
          {...register("password")}
        />
        <div className="flex flex-col gap-2">
          <Button disabled={loading} type="submit" variant="primary">
            Join a room
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ArrowRight
                className="transition-transform group-hover:translate-x-0.5"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </Button>
          <Button className="group" variant="outline" onClick={() => setPage("create_quiz")}>
            Create a Quiz
          </Button>
        </div>
      </form>
    </Card>
  );
}
