import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Plus,
  ArrowRightToLine,
  Heading1,
  Heading2,
  Pilcrow,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Eraser,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const normalizedValue = value || '';
    if (editor.getHTML() !== normalizedValue) {
      editor.commands.setContent(normalizedValue, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const insertParagraph = () => {
    const inserted = editor.chain().focus().splitBlock().setParagraph().run();
    if (!inserted) {
      editor.chain().focus().insertContent('<p></p>').run();
    }
  };

  const insertTabSpace = () => {
    editor.chain().focus().insertContent('\u00A0\u00A0\u00A0\u00A0').run();
  };

  const ToolbarButton = ({
    label,
    children,
    ...props
  }: React.ComponentProps<typeof Button> & {
    label: string;
    children: React.ReactNode;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...props} title={label}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <TooltipProvider>
        <div className="flex gap-1 border-b bg-muted/30 p-2 flex-wrap">
          <ToolbarButton
            label="Bold"
            type="button"
            size="sm"
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            type="button"
            size="sm"
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            type="button"
            size="sm"
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={16} />
          </ToolbarButton>
          <div className="w-px bg-border mx-1" />
          <ToolbarButton
            label="Paragraph"
            type="button"
            size="sm"
            variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <Pilcrow size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="New Paragraph"
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={keepEditorFocus}
            onClick={insertParagraph}
          >
            <Plus size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Tab Space"
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={keepEditorFocus}
            onClick={insertTabSpace}
          >
            <ArrowRightToLine size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Heading 1"
            type="button"
            size="sm"
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Heading 2"
            type="button"
            size="sm"
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Bullet List"
            type="button"
            size="sm"
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered List"
            type="button"
            size="sm"
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Blockquote"
            type="button"
            size="sm"
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Horizontal Rule"
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus size={16} />
          </ToolbarButton>
          <div className="w-px bg-border mx-1" />
          <ToolbarButton
            label="Align Left"
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Align Center"
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Align Right"
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Justify"
            type="button"
            size="sm"
            variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify size={16} />
          </ToolbarButton>
          <div className="w-px bg-border mx-1" />
          <ToolbarButton
            label="Clear Formatting"
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          >
            <Eraser size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Undo"
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            type="button"
            size="sm"
            variant="ghost"
            onMouseDown={keepEditorFocus}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo2 size={16} />
          </ToolbarButton>
        </div>
      </TooltipProvider>
      <EditorContent
        editor={editor}
        className="h-48 overflow-y-auto p-3 text-sm focus-within:outline-none [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:ring-0 [&_.ProseMirror]:border-0 [&_.ProseMirror-focused]:outline-none [&_.ProseMirror-focused]:ring-0 [&_.ProseMirror_p]:my-2 [&_.ProseMirror_h1]:my-3 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:my-3 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_li]:my-1 [&_.ProseMirror_blockquote]:my-3 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-primary/40 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_hr]:my-4 [&_.ProseMirror_hr]:border-border"
      />
    </div>
  );
};
