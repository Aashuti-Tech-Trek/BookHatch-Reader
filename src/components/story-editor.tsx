
"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { continueStoryAction } from "@/lib/actions/stories";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

interface StoryEditorProps {
    content: string;
    onChange: (richText: string) => void;
}

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
    const [isGenerating, startTransition] = useTransition();
    const { toast } = useToast();

    if (!editor) {
        return null;
    }

    const handleGenerateText = () => {
        startTransition(async () => {
            const currentText = editor.getText();
            const result = await continueStoryAction(currentText);

            if (result.continuation) {
                editor.chain().focus().insertContent(` ${result.continuation}`).run();
            } else {
                 toast({
                    variant: "destructive",
                    title: "Generation Failed",
                    description: result.error || "Could not generate text. Please try again.",
                });
            }
        });
    }

    return (
        <div className="p-2 border-b flex items-center gap-1 flex-wrap">
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                size="icon"
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                size="icon"
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
                size="icon"
                title="Underline"
            >
                <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
                size="icon"
                title="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
                size="icon"
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
                size="icon"
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
             <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
                size="icon"
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                size="icon"
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                size="icon"
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-1" />
             <Button
                onClick={handleGenerateText}
                variant='ghost'
                size="icon"
                title="Generate Text"
                disabled={isGenerating}
            >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
        </div>
    );
};

export function StoryEditor({ content, onChange }: StoryEditorProps) {
  const editor = useEditor({
    extensions: [
        StarterKit,
        Underline,
        Placeholder.configure({
            placeholder: 'Once upon a time...',
        })
    ],
    content: content,
    editorProps: {
        attributes: {
            class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px]",
        },
    },
    onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
    },
  });

  return (
    <div className="relative flex flex-col h-full border-t">
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
    </div>
  );
}
