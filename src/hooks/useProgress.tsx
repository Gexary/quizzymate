import { useCallback, useEffect, useRef, useState } from "react";

export function useProgress(seconds: number) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const startProgress = () => {
    clear();
    setProgress(0);
    startTime.current = Date.now();
    intervalRef.current = setInterval(() => {
      setProgress(() => {
        if (startTime.current) {
          const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
          if (elapsed >= seconds) {
            clear();
            return seconds;
          }
          return elapsed;
        }
        return 0;
      });
    }, 1000);
  };

  const percentage = ((seconds - progress) / seconds) * 100;
  return { percentage, progress, seconds, startProgress, remainingTime: seconds - progress };
}
