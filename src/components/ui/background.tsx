import { cn } from "@/lib/utils";
import "./background.css";

type BackgroundColor = "red" | "blue" | "green" | "purple" | "yellow";

const colors: Record<BackgroundColor, string> = {
  red: "from-red-600 to-red-500",
  blue: "from-blue-600 to-blue-500",
  green: "from-green-600 to-green-500",
  purple: "from-purple-600 to-purple-500",
  yellow: "from-yellow-500 to-yellow-300",
};

const patterns: Record<BackgroundColor, string> = {
  purple: "bg-pattern-1",
  blue: "bg-pattern-2",
  red: "",
  green: "",
  yellow: "",
};

export function Background({ children, color = "blue" }: { children: React.ReactNode; color?: BackgroundColor }) {
  return (
    <div className={cn("bg-gradient-to-t h-screen w-full", colors[color])}>
      <div className={`bg-pattern w-full h-full flex flex-col items-center justify-center overflow-y-auto ${patterns[color]}`}>
        {children}
      </div>
    </div>
  );
}
