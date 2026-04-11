import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Pilcrow,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Eraser,
  Strikethrough,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Enter text...',
}: RichTextEditorProps) => {
  const keepEditorFocus = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex gap-1 border-b bg-muted/30 p-2 flex-wrap">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </Button>
        <div className="w-px bg-border mx-1" />
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().setParagraph().run()}
          title="Paragraph"
        >
          <Pilcrow size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </Button>
        <div className="w-px bg-border mx-1" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={keepEditorFocus}
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Clear Formatting"
        >
          <Eraser size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        >
          <Undo2 size={16} />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={keepEditorFocus}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        >
          <Redo2 size={16} />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none min-h-48 p-3 focus-within:outline-none [&_.ProseMirror]:min-h-40 [&_.ProseMirror]:outline-none [&_.ProseMirror]:ring-0 [&_.ProseMirror]:border-0 [&_.ProseMirror-focused]:outline-none [&_.ProseMirror-focused]:ring-0"
      />
    </div>
  );
};
