import { useUsername } from "@/hooks/useConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const MAX = 32;
const usernameSchema = z.object({
  username: z.string().trim().min(1, "Please enter your username").max(MAX, `Username must be less than ${MAX} characters`),
});

type usernameForm = z.infer<typeof usernameSchema>;

export const useUsernameForm = () => {
  const { username, updateUsername } = useUsername();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<usernameForm>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username,
    },
  });

  const onSubmit: SubmitHandler<usernameForm> = (data) => {
    updateUsername(data.username.trim());
  };

  const handleSubmitForm = (callback?: () => void) => {
    return handleSubmit((data) => {
      onSubmit(data);
      callback?.();
    });
  };

  return {
    registerInput: { ...register("username"), error: errors.username?.message },
    handleSubmitForm,
  };
};
