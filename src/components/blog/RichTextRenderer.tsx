import { generateHTML } from '@tiptap/html';
import DOMPurify from 'isomorphic-dompurify';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';

// Must match the extension set used by the admin editor
// (src/components/admin/TiptapEditor.tsx) so content round-trips correctly.
const EXTENSIONS = [StarterKit, Link, Underline, Image];

type Props = {
  content: Record<string, unknown>;
  className?: string;
};

/**
 * Converts a Tiptap JSON document (as stored in blog_posts.content) into
 * sanitized HTML for public rendering. We never trust editor output as
 * inherently safe — DOMPurify strips anything unexpected (script tags,
 * inline event handlers, etc.) even though only authorized admins can write
 * this content, as defense in depth.
 */
export function RichTextRenderer({ content, className }: Props) {
  if (!content || Object.keys(content).length === 0) {
    return null;
  }

  let rawHtml = '';
  try {
    rawHtml = generateHTML(content, EXTENSIONS);
  } catch (err) {
    console.error('Failed to render article content:', err);
    return <p className="text-ink-muted">{"This article's content could not be displayed."}</p>;
  }

  const safeHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'u', 's',
      'a', 'blockquote', 'hr', 'img', 'br', 'code', 'pre',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
  });

  return (
    <div
      className={className ?? 'article-prose'}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
