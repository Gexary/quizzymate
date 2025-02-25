import { CompleteInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUsername } from "@/hooks/useConfig";
import { Pencil } from "lucide-react";
import { useUsernameForm } from "./form";

export default function UsernameEdit() {
  const { username } = useUsername();

  return (
    <div className="flex flex-row items-center gap-4 w-fit border border-input bg-background px-4 py-1 rounded-lg absolute left-4 bottom-4">
      Your username is: {username}
      <UsernameFormDialog />
    </div>
  );
}

export function UsernameFormDialog() {
  const { registerInput, handleSubmitForm } = useUsernameForm();

  return (
    <Dialog>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Pencil />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">Click to edit your username</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmitForm()} className="flex flex-col gap-4 justify-end">
          <DialogTitle>Edit username</DialogTitle>
          <CompleteInput label="Username" placeholder="Public username used to join the quiz" maxLength={32} {...registerInput} />
          <Button type="submit" variant="primary" className="w-fit">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
