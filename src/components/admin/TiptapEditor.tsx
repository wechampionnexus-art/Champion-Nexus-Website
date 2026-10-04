'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from 'react';
import {
  Bold, Italic, UnderlineIcon, Heading1, Heading2, Heading3, List, ListOrdered,
  LinkIcon, Quote, Minus, Undo, Redo, ImageIcon, RemoveFormatting, Eye, Pencil,
} from 'lucide-react';
import { RichTextRenderer } from '@/components/blog/RichTextRenderer';

type Props = {
  name: string; // hidden input name the parent <form> reads on submit
  initialContent?: Record<string, unknown>;
};

const EXTENSIONS = [
  StarterKit,
  Underline,
  Link.configure({ openOnClick: false, autolink: true }),
  Image,
  Placeholder.configure({ placeholder: 'Start writing your article…' }),
];

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`p-2 rounded-md transition-colors ${
        active ? 'bg-brand-orange-light text-brand-orange' : 'text-ink-muted hover:bg-surface-gray'
      }`}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({ name, initialContent }: Props) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [jsonValue, setJsonValue] = useState<Record<string, unknown>>(initialContent ?? {});

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: initialContent && Object.keys(initialContent).length > 0 ? initialContent : '<p></p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setJsonValue(editor.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class: 'article-prose min-h-[320px] focus:outline-none px-4 py-4',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      setJsonValue(editor.getJSON() as Record<string, unknown>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) {
    return <div className="border border-line rounded-lg p-4 text-ink-soft text-sm">Loading editor…</div>;
  }

  function setLink() {
    const url = window.prompt('Enter a URL');
    if (url === null) return;
    if (url === '') {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt('Image URL (upload to Supabase Storage first, then paste the public URL here)');
    if (url) editor!.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="border border-line rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-line p-2 bg-surface-gray">
        <ToolbarButton label="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </ToolbarButton>
        <span className="w-px h-5 bg-line mx-1" />
        <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <span className="w-px h-5 bg-line mx-1" />
        <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton label="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>
        <span className="w-px h-5 bg-line mx-1" />
        <ToolbarButton label="Link" active={editor.isActive('link')} onClick={setLink}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={addImage}>
          <ImageIcon size={16} />
        </ToolbarButton>
        <ToolbarButton label="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <RemoveFormatting size={16} />
        </ToolbarButton>
        <span className="w-px h-5 bg-line mx-1" />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </ToolbarButton>

        <span className="flex-1" />

        <ToolbarButton label="Toggle preview" active={mode === 'preview'} onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}>
          {mode === 'edit' ? <Eye size={16} /> : <Pencil size={16} />}
        </ToolbarButton>
      </div>

      {mode === 'edit' ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="px-4 py-4">
          <RichTextRenderer content={jsonValue} />
        </div>
      )}

      {/* The surrounding <form> (a Server Action) reads this field on submit. */}
      <input type="hidden" name={name} value={JSON.stringify(jsonValue)} />
    </div>
  );
}
