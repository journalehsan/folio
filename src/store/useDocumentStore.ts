import { create } from 'zustand';
import { Editor } from '@tiptap/react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ParagraphStyle =
  | 'Normal'
  | 'Heading 1'
  | 'Heading 2'
  | 'Heading 3'
  | 'Heading 4'
  | 'Quote'
  | 'Code Block'
  | 'Caption'
  | 'Title'
  | 'Subtitle';

export interface StyleDef {
  id: string;
  name: ParagraphStyle | string;
  description: string;
  htmlTag: string;
  color: string;
}

export interface PageData {
  id: string;
  title: string;
  content: string;        // TipTap JSON / HTML string
  wordCount: number;
  characterCount: number;
  thumbnail?: string;     // base64 or URL placeholder
}

export interface DocumentMeta {
  id: string;
  title: string;
  author: string;
  createdAt: Date;
  modifiedAt: Date;
  template: string;
  pageSize: 'A4' | 'Letter' | 'A3' | 'Legal';
  orientation: 'Portrait' | 'Landscape';
  marginTop: number;    // mm
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  headerEnabled: boolean;
  footerEnabled: boolean;
  pageNumbering: boolean;
  columnCount: 1 | 2 | 3;
}

export interface OutlineNode {
  id: string;
  pageId: string;
  level: number;       // 1–6 heading level
  text: string;
  position: number;
}

export type ContextMenuPayload = {
  x: number;
  y: number;
  target: 'workspace' | 'page' | 'sidebar';
} | null;

export type RightSidebarTab = 'format' | 'document';
export type LeftSidebarTab = 'outline' | 'thumbnails';

export interface FormatState {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  textColor: string;
  highlight: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  paragraphStyle: string;
  lineHeight: number;
  letterSpacing: number;
  listType: 'none' | 'bullet' | 'ordered';
}

// ─── Default Data ─────────────────────────────────────────────────────────────

const DEFAULT_STYLES: StyleDef[] = [
  { id: 'normal',    name: 'Normal',    description: 'Default paragraph text',      htmlTag: 'p',  color: '#374151' },
  { id: 'title',     name: 'Title',     description: 'Document title',               htmlTag: 'h1', color: '#111827' },
  { id: 'subtitle',  name: 'Subtitle',  description: 'Document subtitle',            htmlTag: 'h2', color: '#1f2937' },
  { id: 'heading1',  name: 'Heading 1', description: 'Top-level section heading',    htmlTag: 'h1', color: '#1e3a8a' },
  { id: 'heading2',  name: 'Heading 2', description: 'Second-level heading',         htmlTag: 'h2', color: '#1e40af' },
  { id: 'heading3',  name: 'Heading 3', description: 'Third-level heading',          htmlTag: 'h3', color: '#1d4ed8' },
  { id: 'heading4',  name: 'Heading 4', description: 'Fourth-level heading',         htmlTag: 'h4', color: '#2563eb' },
  { id: 'quote',     name: 'Quote',     description: 'Block quotation style',        htmlTag: 'blockquote', color: '#6b7280' },
  { id: 'code',      name: 'Code Block',description: 'Monospace code block',         htmlTag: 'pre', color: '#065f46' },
  { id: 'caption',   name: 'Caption',   description: 'Image or table caption',       htmlTag: 'p',  color: '#9ca3af' },
];

const DEFAULT_PAGES: PageData[] = [
  {
    id: 'page-1',
    title: 'Page 1',
    content: '<h1>Untitled Document</h1><p>Start typing your content here...</p>',
    wordCount: 0,
    characterCount: 0,
  },
];

const DEFAULT_META: DocumentMeta = {
  id: 'doc-001',
  title: 'Untitled Document',
  author: 'Author',
  createdAt: new Date(),
  modifiedAt: new Date(),
  template: 'Blank',
  pageSize: 'A4',
  orientation: 'Portrait',
  marginTop: 25,
  marginBottom: 25,
  marginLeft: 30,
  marginRight: 25,
  headerEnabled: false,
  footerEnabled: false,
  pageNumbering: true,
  columnCount: 1,
};

const DEFAULT_FORMAT: FormatState = {
  fontFamily: 'Inter',
  fontSize: 12,
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  textColor: '#000000',
  highlight: 'none',
  textAlign: 'left',
  paragraphStyle: 'Normal',
  lineHeight: 1.5,
  letterSpacing: 0,
  listType: 'none',
};

// ─── Store Interface ──────────────────────────────────────────────────────────

interface DocumentStore {
  // Document data
  meta: DocumentMeta;
  pages: PageData[];
  outline: OutlineNode[];
  styles: StyleDef[];

  // Active state
  activePageId: string;
  activeEditor: Editor | null;
  selectedStyleId: string;
  formatState: FormatState;

  // UI state
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  leftSidebarTab: LeftSidebarTab;
  rightSidebarTab: RightSidebarTab;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  contextMenu: ContextMenuPayload;
  zoom: number;
  showRuler: boolean;
  showGrid: boolean;
  darkMode: boolean;

  // Actions — Document
  updateMeta: (partial: Partial<DocumentMeta>) => void;
  addPage: () => void;
  removePage: (id: string) => void;
  updatePage: (id: string, partial: Partial<PageData>) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  setActivePageId: (id: string) => void;

  // Actions — Editor
  setActiveEditor: (editor: Editor | null) => void;
  setFormatState: (partial: Partial<FormatState>) => void;

  // Actions — Styles
  setSelectedStyle: (id: string) => void;

  // Actions — Outline
  setOutline: (nodes: OutlineNode[]) => void;

  // Actions — UI
  setLeftSidebarOpen: (open: boolean) => void;
  setRightSidebarOpen: (open: boolean) => void;
  setLeftSidebarTab: (tab: LeftSidebarTab) => void;
  setRightSidebarTab: (tab: RightSidebarTab) => void;
  setLeftSidebarWidth: (w: number) => void;
  setRightSidebarWidth: (w: number) => void;
  setContextMenu: (payload: ContextMenuPayload) => void;
  setZoom: (zoom: number) => void;
  toggleRuler: () => void;
  toggleGrid: () => void;
  setDarkMode: (dark: boolean) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

let pageCounter = 2;

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // Initial state
  meta: DEFAULT_META,
  pages: DEFAULT_PAGES,
  outline: [],
  styles: DEFAULT_STYLES,
  activePageId: 'page-1',
  activeEditor: null,
  selectedStyleId: 'normal',
  formatState: DEFAULT_FORMAT,
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  leftSidebarTab: 'outline',
  rightSidebarTab: 'format',
  leftSidebarWidth: 220,
  rightSidebarWidth: 260,
  contextMenu: null,
  zoom: 100,
  showRuler: true,
  showGrid: false,
  darkMode: false,

  // Document actions
  updateMeta: (partial) =>
    set((s) => ({ meta: { ...s.meta, ...partial, modifiedAt: new Date() } })),

  addPage: () => {
    const newPage: PageData = {
      id: `page-${pageCounter++}`,
      title: `Page ${get().pages.length + 1}`,
      content: '<p></p>',
      wordCount: 0,
      characterCount: 0,
    };
    set((s) => ({
      pages: [...s.pages, newPage],
      activePageId: newPage.id,
    }));
  },

  removePage: (id) =>
    set((s) => {
      if (s.pages.length === 1) return s;
      const pages = s.pages.filter((p) => p.id !== id);
      const activePageId =
        s.activePageId === id ? pages[pages.length - 1].id : s.activePageId;
      return { pages, activePageId };
    }),

  updatePage: (id, partial) =>
    set((s) => ({
      pages: s.pages.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    })),

  reorderPages: (fromIndex, toIndex) =>
    set((s) => {
      const pages = [...s.pages];
      const [moved] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, moved);
      return { pages };
    }),

  setActivePageId: (id) => set({ activePageId: id }),

  // Editor actions
  setActiveEditor: (editor) => set({ activeEditor: editor }),

  setFormatState: (partial) =>
    set((s) => ({ formatState: { ...s.formatState, ...partial } })),

  // Style actions
  setSelectedStyle: (id) => set({ selectedStyleId: id }),

  // Outline actions
  setOutline: (nodes) => set({ outline: nodes }),

  // UI actions
  setLeftSidebarOpen: (open) => set({ leftSidebarOpen: open }),
  setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),
  setLeftSidebarTab: (tab) => set({ leftSidebarTab: tab }),
  setRightSidebarTab: (tab) => set({ rightSidebarTab: tab }),
  setLeftSidebarWidth: (w) => set({ leftSidebarWidth: w }),
  setRightSidebarWidth: (w) => set({ rightSidebarWidth: w }),
  setContextMenu: (payload) => set({ contextMenu: payload }),
  setZoom: (zoom) => set({ zoom }),
  toggleRuler: () => set((s) => ({ showRuler: !s.showRuler })),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  setDarkMode: (dark) => set({ darkMode: dark }),
}));
