
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface StoryEditorProps {
    content: string;
    onChange: (richText: string) => void;
}

const EditorToolbar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
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
                <Underline className="h-4 w-4" />
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
        </div>
    );
};

export function StoryEditor({ content, onChange }: StoryEditorProps) {
  const editor = useEditor({
    extensions: [
        StarterKit,
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
