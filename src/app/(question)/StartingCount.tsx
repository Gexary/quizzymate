import animationData from "@/lotties/countdown.json";
import Lottie from "lottie-react";

export function Countdown() {
  return (
    <div>
      <Lottie
        animationData={animationData}
        loop={false}
        autoplay={true}
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        width={400}
        height={400}
      />
    </div>
  );
}
