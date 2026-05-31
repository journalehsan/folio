import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { useDocumentStore } from '../../store/useDocumentStore';
import type { PageData } from '../../store/useDocumentStore';
import BubbleToolbar from './BubbleToolbar';

interface PageEditorProps {
  page: PageData;
  isActive: boolean;
}

const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4, 5, 6] },
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  Underline,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  Typography,
];

const PageEditor: React.FC<PageEditorProps> = ({ page, isActive }) => {
  const { setActiveEditor, setActivePageId, updatePage, setFormatState, activePageId } =
    useDocumentStore();

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: page.content,
    editorProps: {
      attributes: {
        class: 'outline-none min-h-full prose prose-sm max-w-none focus:outline-none',
        spellcheck: 'true',
      },
    },
    onFocus: () => {
      setActivePageId(page.id);
      setActiveEditor(editor);
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      updatePage(page.id, {
        content: html,
        wordCount: words,
        characterCount: text.length,
      });

      // Sync format state
      setFormatState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strikethrough: editor.isActive('strike'),
        textAlign: editor.isActive({ textAlign: 'center' })
          ? 'center'
          : editor.isActive({ textAlign: 'right' })
          ? 'right'
          : editor.isActive({ textAlign: 'justify' })
          ? 'justify'
          : 'left',
        paragraphStyle: editor.isActive('heading', { level: 1 })
          ? 'Heading 1'
          : editor.isActive('heading', { level: 2 })
          ? 'Heading 2'
          : editor.isActive('heading', { level: 3 })
          ? 'Heading 3'
          : editor.isActive('heading', { level: 4 })
          ? 'Heading 4'
          : editor.isActive('blockquote')
          ? 'Quote'
          : editor.isActive('codeBlock')
          ? 'Code Block'
          : 'Normal',
        listType: editor.isActive('bulletList')
          ? 'bullet'
          : editor.isActive('orderedList')
          ? 'ordered'
          : 'none',
      });
    },
    onSelectionUpdate: ({ editor }) => {
      setFormatState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strikethrough: editor.isActive('strike'),
        textAlign: editor.isActive({ textAlign: 'center' })
          ? 'center'
          : editor.isActive({ textAlign: 'right' })
          ? 'right'
          : editor.isActive({ textAlign: 'justify' })
          ? 'justify'
          : 'left',
        paragraphStyle: editor.isActive('heading', { level: 1 })
          ? 'Heading 1'
          : editor.isActive('heading', { level: 2 })
          ? 'Heading 2'
          : editor.isActive('heading', { level: 3 })
          ? 'Heading 3'
          : editor.isActive('heading', { level: 4 })
          ? 'Heading 4'
          : editor.isActive('blockquote')
          ? 'Quote'
          : editor.isActive('codeBlock')
          ? 'Code Block'
          : 'Normal',
        listType: editor.isActive('bulletList')
          ? 'bullet'
          : editor.isActive('orderedList')
          ? 'ordered'
          : 'none',
      });
    },
  });

  // Update active editor when this page becomes active
  useEffect(() => {
    if (isActive && editor) {
      setActiveEditor(editor);
    }
  }, [isActive, editor, setActiveEditor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activePageId === page.id) {
        setActiveEditor(null);
      }
    };
  }, []);

  return (
    <div
      className={`w-full h-full cursor-text`}
      onClick={() => {
        editor?.commands.focus();
        setActivePageId(page.id);
        if (editor) setActiveEditor(editor);
      }}
    >
      {editor && <BubbleToolbar editor={editor} />}
      <EditorContent editor={editor} className="h-full" />
    </div>
  );
};

export default PageEditor;
