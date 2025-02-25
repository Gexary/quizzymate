import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfig } from "@/hooks/useConfig";
import twemoji from "@twemoji/api";
import { useId } from "react";

const languages = [
  { value: "en-US", label: "English", flag: "🇺🇸" },
  { value: "es-ES", label: "Spanish", flag: "🇪🇸" },
  { value: "fr-FR", label: "French", flag: "🇫🇷" },
  { value: "zh-CN", label: "Mandarin", flag: "🇨🇳" },
  { value: "ar-AR", label: "Arabic", flag: "🇸🇦" },
];

const parseFlag = (flag: string) => {
  return twemoji.parse(flag, {
    folder: "svg",
    ext: ".svg",
  });
};

export default function LanguageSelector({ ...props }) {
  const id = useId();
  const { setConfigValue } = useConfig();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Language</Label>
      <Select
        onValueChange={(e) => {
          setConfigValue("language", e);
          props.onChange(e);
        }}
        {...props}
      >
        <SelectTrigger
          id={id}
          className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80"
        >
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
          {languages.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <span
                className="text-lg leading-none inline-block h-5 test-img"
                dangerouslySetInnerHTML={{ __html: parseFlag(item.flag) }}
              />{" "}
              <span className="truncate">{item.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
