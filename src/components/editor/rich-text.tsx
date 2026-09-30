"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  RiAlignCenter,
  RiAlignLeft,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiBold,
  RiCodeBoxLine,
  RiDoubleQuotesL,
  RiH2,
  RiH3,
  RiImageAddLine,
  RiItalic,
  RiLinkM,
  RiLinkUnlink,
  RiListOrdered,
  RiListUnordered,
  RiSeparator,
  RiStrikethrough,
  RiUnderline,
  type RemixiconComponentType,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/image";

function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: RemixiconComponentType;
  label: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-accent-soft text-accent"
          : "text-secondary hover:bg-raised hover:text-primary",
      )}
    >
      <Icon size={18} aria-hidden />
    </button>
  );
}

function Divider() {
  return <span className="bg-line mx-1 h-6 w-px" aria-hidden />;
}

function Toolbar({ editor, onInsertImage }: { editor: Editor; onInsertImage: () => void }) {
  const addLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border-line bg-card flex shrink-0 flex-wrap items-center gap-0.5 border-b px-4 py-2">
      <ToolbarButton
        icon={RiBold}
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={RiItalic}
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={RiUnderline}
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        icon={RiStrikethrough}
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <Divider />

      <ToolbarButton
        icon={RiH2}
        label="Heading"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={RiH3}
        label="Subheading"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <ToolbarButton
        icon={RiListUnordered}
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={RiListOrdered}
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={RiDoubleQuotesL}
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        icon={RiCodeBoxLine}
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <Divider />

      <ToolbarButton icon={RiLinkM} label="Add link" active={editor.isActive("link")} onClick={addLink} />
      <ToolbarButton
        icon={RiLinkUnlink}
        label="Remove link"
        disabled={!editor.isActive("link")}
        onClick={() => editor.chain().focus().unsetLink().run()}
      />
      <ToolbarButton icon={RiImageAddLine} label="Insert image" onClick={onInsertImage} />
      <ToolbarButton
        icon={RiSeparator}
        label="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />

      <Divider />

      <ToolbarButton
        icon={RiAlignLeft}
        label="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      />
      <ToolbarButton
        icon={RiAlignCenter}
        label="Align centre"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      />

      <Divider />

      <ToolbarButton
        icon={RiArrowGoBackLine}
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        icon={RiArrowGoForwardLine}
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </div>
  );
}

/**
 * Writing surface. The HTML is mirrored into a hidden input so the whole thing
 * posts with a plain form action — no client-side submit handler needed.
 */
export function RichTextEditor({
  name,
  defaultValue = "",
  onStats,
}: {
  name: string;
  defaultValue?: string;
  onStats?: (stats: { words: number; minutes: number }) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write the post…" }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        /** Tall by default, so a click anywhere in the blank area lands in the text. */
        class: "prose-cvspan min-h-[60vh] max-w-none px-4 py-6 focus:outline-none sm:px-6",
      },
    },
    onUpdate: ({ editor }) => {
      const words = editor.getText().split(/\s+/).filter(Boolean).length;
      onStats?.({ words, minutes: Math.max(1, Math.round(words / 200)) });
    },
  });

  async function insertUploadedImage(file: File) {
    setImageError(null);
    try {
      const url = await uploadImage(file);
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (problem) {
      setImageError(problem instanceof Error ? problem.message : "Upload failed");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {editor ? (
        <Toolbar editor={editor} onInsertImage={() => fileRef.current?.click()} />
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        aria-label="Insert an image into the post"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) insertUploadedImage(file);
          event.target.value = "";
        }}
      />

      {imageError ? (
        <p role="alert" className="text-error-text border-line border-b px-4 py-2 text-caption">
          {imageError}
        </p>
      ) : null}
      <div
        className="flex flex-1 cursor-text flex-col"
        onClick={() => editor?.chain().focus("end").run()}
      >
        <EditorContent editor={editor} className="flex-1" />
      </div>
      <input type="hidden" name={name} value={editor?.getHTML() ?? defaultValue} readOnly />
    </div>
  );
}
