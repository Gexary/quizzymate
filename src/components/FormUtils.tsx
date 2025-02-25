import { cn } from "@/lib/utils";

import React, { useId, useState } from "react";

function isDigit(str: string) {
  return /^\d+$/.test(str);
}

export function FormInput({ label, error, ...props }: { label: string; error?: string }) {
  const [value, setValue] = useState("");
  const inputId = useId();
  return (
    <div className="w-full h-full">
      <label className="text-sm font-medium text-foreground mb-2 block w-full select-none" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        {...props}
        onChange={(e) => {
          if (isDigit(e.target.value)) {
            setValue(e.target.value);
          }
        }}
        value={value}
        className="rounded-lg px-4 py-2 w-full border-2 border-input bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:border-blue-600 test"
      />
      <p className="text-sm text-red-500 mt-1 w-full font-medium" style={{ display: error ? "block" : "none" }}>
        {error}
      </p>
    </div>
  );
}

const btn = [
  "text-white rounded-lg px-4 py-2 w-full text-center font-medium text-base bg-gradient-to-t border-2 shadow-[0px_2px_0px_0px_#FFFFFF1A_inset,0px_2px_8px_0px_#FFFFFF29_inset] from-blue-600 to-blue-500 border-blue-600 outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-600",
  "text-foreground rounded-lg px-4 py-2 w-full text-center font-medium text-base border-2",
];

export function FormButton({
  children,
  variant,
  className,
  ...props
}: {
  children: React.ReactNode;
  variant?: "outline";
  className?: string;
}) {
  return (
    <button className={cn(variant ? btn[1] : btn[0], "cursor-pointer", className)} {...props}>
      {children}
    </button>
  );
}
