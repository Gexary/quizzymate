"use client";

import { Background } from "@/components/ui/background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePage } from "@/contexts/page.context";
import { useQuestionResult } from "@/contexts/question.context";
import { cn, plural } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

export default function FinalLeaderboard() {
  const { leaderboard } = useQuestionResult();
  const podium = leaderboard.slice(0, 3);

  const { setPage } = usePage();
  useEffect(() => {
    const duration = 3 * 1000,
      animationEnd = Date.now() + duration,
      defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          colors: ["#ffffff"],
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          colors: ["#ffffff"],
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }, []);

  const firstPlace = podium.shift();
  const secondPlace = podium.shift();
  const thirdPlace = podium.shift();

  return (
    <Background color="yellow">
      <Card className="p-8 w-[30rem]">
        <div className="flex flex-row gap-4 items-center mb-8">
          <Image src="/top.png" width={100} height={100} alt="Quiz App Logo" className="h-14 w-auto" />
          <div>
            <h1 className="text-2xl font-bold">Final Leaderboard</h1>
            <p className="text-sm text-gray-500">The final leaderboard will be displayed here.</p>
          </div>
        </div>
        <div className="w-full grid grid-cols-3 gap-4 h-64">
          <PodiumPosition
            className="podium-2 from-slate-500 to-slate-300"
            player={secondPlace ? secondPlace.username : ""}
            position={2}
            points={secondPlace ? secondPlace.score : 0}
          />
          <PodiumPosition
            className="podium-1 from-yellow-500 to-yellow-300"
            player={firstPlace.username}
            position={1}
            points={firstPlace.score}
          />
          <PodiumPosition
            className="podium-3 from-amber-500 to-amber-300"
            player={thirdPlace ? thirdPlace.username : ""}
            position={3}
            points={thirdPlace ? thirdPlace.score : 0}
          />
        </div>
        <div className="w-full flex flex-row justify-center">
          <Button variant={"primary"} className="mt-8 px-8 group" onClick={() => setPage("main_menu")}>
            Back to main menu
            <ArrowRight className="inline-block h-4 w-auto ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </Background>
  );
}

function PodiumPosition({
  position,
  className,
  player,
  points,
}: {
  className?: string;
  player: string;
  position: number;
  points: number;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-end">
      <h2 className="text-base font-medium text-center mb-2">
        <span className="text-sm text-gray-400 font-medium mr-1">#{position}</span>
        {player}
      </h2>
      <div
        className={cn(
          "w-full rounded-sm bg-gradient-to-tl text-[0] flex flex-col items-center justify-end pb-4 h-[calc(3rem_+_2px)]",
          className
        )}
      >
        <Badge className="bg-white text-foreground shadow-sm">{plural(points, "point")}</Badge>
      </div>
    </div>
  );
}

/*

podium:
[
  {
    username: "Gexary",
    points: "test",
  },
  {
    username: "Gexary",
    points: "test",
  },
  {
    username: "Gexary",
    points: "test",
  }
]
player: {
position: 1,
points: "test",
}
leaderboard: [
  {
    username: "Gexary",
    points: "test",
    position: 1,
  },
  {
    username: "Gexary",
    points: "test",
    position: 2,
  },
  {
    username: "Gexary",
    points: "test",
    position: 3,
  }
]

*/
