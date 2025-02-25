import { z } from "zod";

export type Language = "en-US" | "es-ES" | "fr-FR" | "zh-CN" | "ar-AR";
export type Level = "easy" | "medium" | "hard";

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
