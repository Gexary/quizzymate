import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import { Answer, useQuestion } from "../../contexts/question.context";

const shadow = "shadow-[0px_2px_0px_0px_#FFFFFF1A_inset,0px_8px_16px_0px_#FFFFFF29_inset]";

const BTN_COLORS = [
  "from-red-600 to-red-500 border-red-600",
  "from-blue-600 to-blue-500 border-blue-600",
  "from-green-600 to-green-500 border-green-600",
  "from-yellow-600 to-yellow-500 border-yellow-600",
  "from-purple-600 to-purple-500 border-purple-600",
  "from-pink-600 to-pink-500 border-pink-600",
];

export default function MultipleChoice() {
  const choices = useQuestion().choices as string[];
  const [checkedItem, setCheckedItem] = useState(Array(choices.length).fill(false));
  const [shuffledList, setShuffledList] = useState(shuffleArray(choices));

  const { answer, id } = useQuestion();
  const handleSubmit = () => {
    const answerList = checkedItem.map((checked, index) => checked && index).filter((index) => index !== false);
    console.log(answerList);

    answer(answerList, id);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-8">
      <div className="grid grid-cols-2 gap-2 w-full">
        {shuffledList.map(({ item, index }, i) => (
          <ChoiceBtn
            name={item}
            answerValue={index}
            color={i}
            key={index}
            checked={checkedItem[index]}
            onChange={(checked) =>
              setCheckedItem((prev) => {
                const newArr = [...prev];
                newArr[index] = checked;
                return newArr;
              })
            }
          />
        ))}
      </div>
      <Button variant={"primary"} size={"lg"} className="min-w-32 text-base flex items-center gap-2" onClick={handleSubmit}>
        <Send className="mr-2" />
        Envoyer
      </Button>
    </div>
  );
}

interface ChoiceBtnProps {
  name: string;
  answerValue: Answer;
  color: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const shuffleArray = (array: string[]) => {
  let shuffled = array.map((item, index) => ({ item, index }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function ChoiceBtn({ name, color, checked, onChange }: ChoiceBtnProps) {
  return (
    <label className="checkbox-container">
      <div
        className={cn(
          "rounded-lg w-xl h-24 group select-none bg-gradient-to-t border shadow-[0px_1px_0px_0px_#FFFFFF1A_inset,0px_2px_4px_0px_#FFFFFF29_inset]",
          "flex flex-row items-center gap-2 px-8 cursor-pointer w-full justify-between",
          BTN_COLORS[color],
          shadow
        )}
      >
        <span className="text-center font-bold text-2xl text-white">{name}</span>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="checkmark"></span>
      </div>
    </label>
  );
}

export function ProgressBar({ percentage = 100 }: { percentage: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-xl">
      <div
        className="bg-blue-500 rounded-xl h-full transition-[width] ease-in-out duration-300 progress-animation"
        style={{ width: `${Math.round(percentage)}%` }}
      ></div>
    </div>
  );
}

export function SingleChoice() {
  const choices = useQuestion().choices as string[];
  const [shuffledList, setShuffledList] = useState(shuffleArray(choices));
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {shuffledList.map(({ item, index }, i) => (
        <SingleChoiceBtn name={item} answerValue={index} color={i} key={index} />
      ))}
    </div>
  );
}

export function SingleChoiceBtn({ name, answerValue, color }: { name: string; answerValue: Answer; color: number }) {
  const { answer, id } = useQuestion();

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg w-xl h-24 group select-none bg-gradient-to-t border shadow-[0px_1px_0px_0px_#FFFFFF1A_inset,0px_2px_4px_0px_#FFFFFF29_inset]",
        "flex flex-row items-center gap-2 px-8 w-full justify-center text-center font-bold text-2xl text-white",
        BTN_COLORS[color],
        shadow
      )}
      onClick={() => answer(answerValue, id)}
    >
      {name}
    </div>
  );
}

export function FreeText() {
  const { answer, id } = useQuestion();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <input
        ref={inputRef}
        placeholder="Type your answer here"
        className="flex w-32 border border-input bg-background text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20
        rounded-lg px-6 py-4 text-xl min-w-[32rem] disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Button
        variant={"primary"}
        size={"lg"}
        className="min-w-32 text-base"
        onClick={() => answer(inputRef.current?.value.trim() || "", id)}
      >
        <Send />
        Envoyer
      </Button>
    </div>
  );
}

export function TrueOrFalse() {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      <SingleChoiceBtn name={"Faux"} answerValue={false} color={0} />
      <SingleChoiceBtn name={"Vrai"} answerValue={true} color={1} />
    </div>
  );
}
