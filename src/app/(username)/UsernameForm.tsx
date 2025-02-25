"use client";

import { CompleteInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { usePage } from "../../contexts/page.context";
import { useUsernameForm } from "./form";

export function UsernameMenu() {
  const { setPage } = usePage();
  const onSubmit = () => setPage("main_menu");

  const { registerInput, handleSubmitForm } = useUsernameForm();

  return (
    <Card className="p-8 w-[30rem]">
      <h1 className="text-2xl font-bold mb-4">Choose your username</h1>
      <form onSubmit={handleSubmitForm(onSubmit)} className="flex flex-col gap-4">
        <CompleteInput label="Username" placeholder="Public username used to join the quiz" {...registerInput} />
        <Button type="submit" variant="primary">
          Start
          <ArrowRight
            className="-me-1 ms-2 transition-transform group-hover:translate-x-0.5"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </form>
    </Card>
  );
}
