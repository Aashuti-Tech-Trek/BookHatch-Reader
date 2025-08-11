
"use client";

import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react";
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
import { cn } from "@/lib/utils";

interface StoryEditorProps {
    content: string;
    onChange: (richText: string) => void;
}

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
            class: "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
        },
    },
    onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="relative flex flex-col h-full">
        {editor && <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-background border rounded-md shadow-lg p-1 flex gap-1">
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                size="sm"
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                size="sm"
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </Button>
             <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
                size="sm"
                title="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
                size="sm"
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
                size="sm"
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
             <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                size="sm"
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </Button>
             <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                size="sm"
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
        </FloatingMenu>}

        <EditorContent editor={editor} style={{minHeight: "500px"}} />
    </div>
  );
}
