import { cn } from "@/lib/utils";

type BackgroundColor = "red" | "blue" | "green" | "purple" | "yellow";

const colors: Record<BackgroundColor, string> = {
  red: "from-red-600 to-red-500",
  blue: "from-blue-600 to-blue-500",
  green: "from-green-600 to-green-500",
  purple: "from-purple-600 to-purple-500",
  yellow: "from-yellow-500 to-yellow-300",
};

export function Background({ children, color = "blue" }: { children: React.ReactNode; color?: BackgroundColor }) {
  return (
    <div
      className={cn("bg-gradient-to-t h-screen w-full flex flex-col items-center justify-center overflow-y-auto", colors[color])}
    >
      {children}
    </div>
  );
}
