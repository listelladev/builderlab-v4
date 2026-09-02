"use client";

import { useEffect, useRef } from "react";
import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Quote,
  ImagePlus,
  Minus,
  Undo2,
  Redo2,
  Heading2,
  Heading3,
  Pilcrow,
  type LucideIcon,
} from "lucide-react";
import { Figure } from "./tiptap-figure";
import { uploadImage } from "@/lib/admin/api";
import { imageUrl } from "@/lib/sanity/image";
import { useToast } from "@/components/admin/Toast";

// What-you-see-is-what-you-get editor for rich text fields. Emits HTML;
// the API sanitizes it against an allow-list before it is stored, and the
// public templates style the same tag set (see .article-html in
// globals.css), so the editor surface and the live page match.
//
// `features="full"` (blog articles, case-study copy) exposes headings,
// images, dividers and quotes. `features="basic"` keeps just inline
// formatting, links and lists — for short fields that render inside a
// fixed typographic slot.
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
  minHeight = 320,
  features = "full",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  features?: "full" | "basic";
}) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const lastEmitted = useRef(value);
  const full = features === "full";

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: full ? { levels: [2, 3] } : false,
        blockquote: full ? undefined : false,
        horizontalRule: full ? undefined : false,
        codeBlock: false,
        code: false,
        strike: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        },
      }),
      Placeholder.configure({ placeholder }),
      ...(full ? [Figure, Image.configure({ inline: false, allowBase64: false })] : []),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "tiptap-body",
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? "" : editor.getHTML();
      lastEmitted.current = html;
      onChangeRef.current(html);
    },
  });

  // Adopt outside changes to `value` (e.g. a post finishing loading) without
  // resetting the document on the editor's own keystrokes.
  useEffect(() => {
    if (!editor) return;
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className="rounded-xl border border-white/10 bg-white/[0.02] text-white/30 text-sm px-4 py-3"
        style={{ minHeight }}
      >
        Loading editor…
      </div>
    );
  }

  return (
    <div className="rte-shell rounded-xl border border-white/10 bg-white/[0.02] focus-within:border-[#38B685] transition-colors">
      <Toolbar editor={editor} full={full} onPickImage={() => fileRef.current?.click()} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageFile(editor, file, toast);
          e.target.value = "";
        }}
      />
      <EditorContent editor={editor} className="px-5 py-4" />
    </div>
  );
}

async function onImageFile(editor: Editor, file: File, toast: ReturnType<typeof useToast>) {
  if (file.size > 4 * 1024 * 1024) {
    toast("That image is larger than the 4 MB limit.", "error");
    return;
  }
  try {
    const { image } = await uploadImage(file, "");
    const src = imageUrl(image, 1600);
    if (!src) throw new Error("Upload did not return an image.");
    const alt = window.prompt("Describe the image (alt text, optional)", "") || "";
    editor.chain().focus().insertContent({ type: "figure", attrs: { src, alt } }).run();
  } catch (err) {
    toast(err instanceof Error ? err.message : "Upload failed.", "error");
  }
}

// Mounted only once the editor instance exists, so useEditorState is
// always bound to a live editor: bound to `null` first, its snapshot never
// refreshes when the instance later appears (TipTap v3 quirk), which left
// the toolbar stuck on "Loading editor…".
function Toolbar({ editor, full, onPickImage }: { editor: Editor; full: boolean; onPickImage: () => void }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      paragraph: editor.isActive("paragraph"),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      link: editor.isActive("link"),
      bullet: editor.isActive("bulletList"),
      ordered: editor.isActive("orderedList"),
      quote: editor.isActive("blockquote"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-white/10">
      {full && (
        <>
          <Tool icon={Pilcrow} label="Paragraph" active={state.paragraph} onClick={() => editor.chain().focus().setParagraph().run()} />
          <Tool icon={Heading2} label="Heading 2" active={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
          <Tool icon={Heading3} label="Heading 3" active={state.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
          <Sep />
        </>
      )}
      <Tool icon={Bold} label="Bold" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
      <Tool icon={Italic} label="Italic" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <Tool icon={Underline} label="Underline" active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <Tool icon={state.link ? Link2Off : Link2} label={state.link ? "Edit or remove link" : "Link"} active={state.link} onClick={setLink} />
      <Sep />
      <Tool icon={List} label="Bulleted list" active={state.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <Tool icon={ListOrdered} label="Numbered list" active={state.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      {full && (
        <>
          <Tool icon={Quote} label="Quote" active={state.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
          <Sep />
          <Tool icon={ImagePlus} label="Insert image" onClick={onPickImage} />
          <Tool icon={Minus} label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        </>
      )}
      <div className="flex-1" />
      <Tool icon={Undo2} label="Undo" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()} />
      <Tool icon={Redo2} label="Redo" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()} />
    </div>
  );
}

function Sep() {
  return <span className="w-px self-stretch my-1 bg-white/10 mx-1" aria-hidden />;
}

function Tool({
  icon: Icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 ${
        active ? "bg-[#38B685] text-[#08120E]" : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

