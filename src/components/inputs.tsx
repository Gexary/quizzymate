import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ChangeEvent, useId, useState } from "react";
import { Textarea } from "./ui/textarea";

export function CompleteInput({
  label,
  description,
  required,
  onChange,
  error,
  ...props
}: {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  [key: string]: any;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="select-none">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Input
        inputMode="numeric"
        id={id}
        type="text"
        required={required}
        {...props}
        onChange={onChange}
        className={cn({
          "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20": error,
        })}
      />
      {error ? (
        <p className="mt-2 text-xs text-destructive" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
      {description ? (
        <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function onlyDigits(value: string) {
  return /^\d*$/.test(value);
}

export function CompleteTextarea({
  label,
  description,
  required,
  error,
  onChange,
  ...props
}: {
  label: string;
  description?: string;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  [key: string]: any;
}) {
  const id = useId();
  const maxLength = 180;
  const [characterCount, setCharacterCount] = useState(0);

  const onInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCharacterCount(e.target.value.length);
    onChange(e);
  };

  const remainingCharacters = maxLength - characterCount;

  return (
    <div className="space-y-2">
      <div className="flex flex-row items-end justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </Label>
        <p id={`${id}-description`} className="text-right text-xs text-muted-foreground" role="status" aria-live="polite">
          <span className="tabular-nums">{remainingCharacters}</span> character{remainingCharacters > 1 ? "s" : ""} left
        </p>
      </div>
      <Textarea
        id={id}
        maxLength={maxLength}
        {...props}
        aria-describedby={`${id}-description`}
        className={cn({
          "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20": error,
        })}
        onChange={(e) => onInputChange(e)}
      />
      {error ? (
        <p className="mt-2 text-xs text-destructive" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
      {description ? (
        <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ToggleLabel({
  label,
  className,
  disabled,
  error,
  checked,
  setChecked,
  ...props
}: {
  label?: string;
  className?: string;
  error?: string | null;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  [key: string]: any;
}) {
  const id = useId();

  return (
    <div>
      <div className={cn("inline-flex items-center gap-2 mt-4", className)}>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={setChecked}
          disabled={disabled}
          className="h-5 w-8 [&_span]:size-4 [&_span]:data-[state=checked]:translate-x-3 rtl:[&_span]:data-[state=checked]:-translate-x-3"
        />
        <Label htmlFor={id}>{label || "Password"}</Label>
      </div>
      {checked ? (
        <>
          <Input
            type="password"
            className={cn(
              "mt-2",
              error &&
                "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20"
            )}
            disabled={disabled}
            placeholder="Enter your password"
            {...props}
          />
          {error ? (
            <p className="mt-2 text-xs text-destructive" role="alert" aria-live="polite">
              {error}
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
