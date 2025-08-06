
"use client";
import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

export function StoryEditor() {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const toggleBold = () => setIsBold(!isBold);
  const toggleItalic = () => setIsItalic(!isItalic);
  const toggleUnderline = () => setIsUnderline(!isUnderline);
  const toggleStrikethrough = () => setIsStrikethrough(!isStrikethrough);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 p-2 border-b">
        <Button variant="ghost" size="icon" onClick={toggleBold} data-active={isBold} className="data-[active=true]:bg-muted">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleItalic} data-active={isItalic} className="data-[active=true]:bg-muted">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleUnderline} data-active={isUnderline} className="data-[active=true]:bg-muted">
          <Underline className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleStrikethrough} data-active={isStrikethrough} className="data-[active=true]:bg-muted">
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button variant="ghost" size="icon" disabled>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled>
          <Quote className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button variant="ghost" size="icon" disabled>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled>
          <Video className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        placeholder="Once upon a time..."
        className={cn(
            "flex-grow w-full rounded-none border-none resize-none focus-visible:ring-0 text-base p-6",
            {
                "font-bold": isBold,
                "italic": isItalic,
                "underline": isUnderline,
                "line-through": isStrikethrough,
            }
        )}
        style={{ minHeight: "500px" }}
      />
    </div>
  );
}
