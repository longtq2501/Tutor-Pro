'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    ArrowDownToLine,
    ArrowLeftToLine,
    ArrowRightToLine,
    ArrowUpToLine,
    Bold,
    Grid3x3,
    Image as ImageIcon,
    ImagePlus,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Redo,
    Table as TableIcon,
    TableCellsMerge,
    TableCellsSplit,
    TableProperties,
    Trash2,
    Underline as UnderlineIcon,
    Undo,
    type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CloudinaryUploader } from './CloudinaryUploader';

interface LessonEditorProps {
    content: string;
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

// Google Docs style table grid picker limits
const GRID_PICKER_SIZE = 8;
const TABLE_DIMENSION_MIN = 1;
const TABLE_DIMENSION_MAX = 20;

const clampDimension = (value: string): number => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
        return TABLE_DIMENSION_MIN;
    }
    return Math.min(TABLE_DIMENSION_MAX, Math.max(TABLE_DIMENSION_MIN, parsed));
};

const ToolbarDivider = () => <div className="mx-0.5 h-5 w-px shrink-0 bg-border" />;

/**
 * Paragraph/heading styles offered in the toolbar.
 * Labels follow the document conventions used by imported Google Docs lessons:
 * h3–h5 are the three section levels tutors actually use ("Tiêu đề 1/2/3").
 */
const STYLE_OPTIONS: { value: string; label: string; className?: string }[] = [
    { value: 'p', label: 'Đoạn văn' },
    { value: 'h1', label: 'Tiêu đề lớn', className: 'font-bold' },
    { value: 'h2', label: 'Phụ đề', className: 'text-muted-foreground' },
    { value: 'h3', label: 'Tiêu đề 1', className: 'font-bold' },
    { value: 'h4', label: 'Tiêu đề 2', className: 'font-semibold text-sm' },
    { value: 'h5', label: 'Tiêu đề 3', className: 'font-medium text-xs' },
];

interface ToolbarButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    children: ReactNode;
    className?: string;
}

const ToolbarButton = ({ label, onClick, disabled, active, children, className }: ToolbarButtonProps) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={label}
        title={label}
        onClick={onClick}
        disabled={disabled}
        className={cn('h-8 w-8 shrink-0 p-0', active && 'bg-muted text-foreground', className)}
    >
        {children}
    </Button>
);

interface TableActionButtonProps {
    icon: LucideIcon;
    label: string;
    hint?: string;
    onClick: () => void;
    disabled?: boolean;
    destructive?: boolean;
}

const TableActionButton = ({
    icon: Icon,
    label,
    hint,
    onClick,
    disabled,
    destructive,
}: TableActionButtonProps) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={label}
        title={hint ?? label}
        onClick={onClick}
        disabled={disabled}
        className={cn(
            'h-7 shrink-0 gap-1 px-1.5 text-[11px] font-medium',
            destructive && 'text-destructive hover:bg-destructive/10 hover:text-destructive'
        )}
    >
        <Icon className="h-3.5 w-3.5" />
        {label}
    </Button>
);

/**
 * Google Docs style table size picker: hovering the grid previews the size,
 * clicking a cell inserts the table immediately. Manual row / column inputs
 * cover tables larger than the grid preview.
 */
const TableSizePicker = ({
    disabled,
    onInsert,
}: {
    disabled?: boolean;
    onInsert: (rows: number, cols: number) => void;
}) => {
    const [hovered, setHovered] = useState({ rows: 0, cols: 0 });
    const [rows, setRows] = useState('3');
    const [cols, setCols] = useState('3');

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground">Chèn bảng</p>
                <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                    {hovered.rows > 0 ? `${hovered.rows} hàng x ${hovered.cols} cột` : 'Di chuột để chọn'}
                </span>
            </div>

            <div
                className="grid w-fit gap-1"
                style={{ gridTemplateColumns: `repeat(${GRID_PICKER_SIZE}, 1.25rem)` }}
                onMouseLeave={() => setHovered({ rows: 0, cols: 0 })}
            >
                {Array.from({ length: GRID_PICKER_SIZE }).map((_, rowIndex) =>
                    Array.from({ length: GRID_PICKER_SIZE }).map((_, colIndex) => {
                        const isActive = rowIndex < hovered.rows && colIndex < hovered.cols;

                        return (
                            <button
                                key={`${rowIndex}-${colIndex}`}
                                type="button"
                                disabled={disabled}
                                aria-label={`Chèn bảng ${rowIndex + 1} hàng ${colIndex + 1} cột`}
                                onMouseEnter={() => setHovered({ rows: rowIndex + 1, cols: colIndex + 1 })}
                                onFocus={() => setHovered({ rows: rowIndex + 1, cols: colIndex + 1 })}
                                onClick={() => onInsert(rowIndex + 1, colIndex + 1)}
                                className={cn(
                                    'h-5 w-5 rounded-[4px] border transition-colors',
                                    isActive
                                        ? 'border-primary bg-primary'
                                        : 'border-border bg-background hover:border-primary/60'
                                )}
                            />
                        );
                    })
                )}
            </div>

            <div className="space-y-2 rounded-lg border bg-muted/30 p-2.5">
                <p className="text-[11px] font-medium text-muted-foreground">
                    Hoặc nhập số hàng / cột (tối đa {TABLE_DIMENSION_MAX})
                </p>
                <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                        <label htmlFor="table-rows-input" className="text-[11px] font-medium text-muted-foreground">
                            Hàng
                        </label>
                        <Input
                            id="table-rows-input"
                            type="number"
                            min={TABLE_DIMENSION_MIN}
                            max={TABLE_DIMENSION_MAX}
                            value={rows}
                            disabled={disabled}
                            onChange={(event) => setRows(event.target.value)}
                            onBlur={() => setRows(String(clampDimension(rows)))}
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label htmlFor="table-cols-input" className="text-[11px] font-medium text-muted-foreground">
                            Cột
                        </label>
                        <Input
                            id="table-cols-input"
                            type="number"
                            min={TABLE_DIMENSION_MIN}
                            max={TABLE_DIMENSION_MAX}
                            value={cols}
                            disabled={disabled}
                            onChange={(event) => setCols(event.target.value)}
                            onBlur={() => setCols(String(clampDimension(cols)))}
                            className="h-8 w-full text-xs"
                        />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        disabled={disabled}
                        onClick={() => onInsert(clampDimension(rows), clampDimension(cols))}
                        className="h-8 shrink-0 gap-1 px-3 text-xs"
                    >
                        <Grid3x3 className="h-3.5 w-3.5" />
                        Chèn
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface EditorToolbarProps {
    editor: Editor | null;
    disabled?: boolean;
}

const EditorToolbar = ({ editor, disabled }: EditorToolbarProps) => {
    const [, setUpdateTick] = useState(0);
    const [isTableMenuOpen, setIsTableMenuOpen] = useState(false);
    const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    // Re-render toolbar buttons so active / disabled states stay in sync with the cursor
    useEffect(() => {
        if (!editor) return;

        const forceUpdate = () => setUpdateTick((tick) => tick + 1);

        editor.on('transaction', forceUpdate);
        editor.on('selectionUpdate', forceUpdate);

        return () => {
            editor.off('transaction', forceUpdate);
            editor.off('selectionUpdate', forceUpdate);
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    const getCurrentStyle = () => {
        for (let level = 1; level <= 5; level += 1) {
            if (editor.isActive('heading', { level })) return `h${level}`;
        }
        return 'p';
    };

    const handleStyleChange = (value: string) => {
        if (value === 'p') {
            editor.chain().focus().setParagraph().run();
            return;
        }

        const level = Number.parseInt(value.replace('h', ''), 10);
        if (Number.isNaN(level)) return;

        editor.chain().focus().setHeading({ level: level as 1 | 2 | 3 | 4 | 5 }).run();
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Nhập URL liên kết:', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const insertTable = (rows: number, cols: number) => {
        editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
        setIsTableMenuOpen(false);
    };

    const insertImageFromUrl = () => {
        const url = imageUrl.trim();
        if (!url) return;

        editor.chain().focus().setImage({ src: url }).run();
        setImageUrl('');
        setIsImageMenuOpen(false);
    };

    const isInTable = editor.isActive('table');
    const canMergeCells = editor.can().mergeCells();
    const canSplitCell = editor.can().splitCell();

    return (
        <div className="shrink-0 border-b bg-muted/20">
            {/* Thanh công cụ chính: một hàng cuộn ngang, không bị xuống dòng */}
            <div className="flex flex-nowrap items-center gap-0.5 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <Select value={getCurrentStyle()} onValueChange={handleStyleChange} disabled={disabled}>
                    <SelectTrigger
                        className="h-8 w-[140px] shrink-0 bg-background text-xs"
                        aria-label="Kiểu chữ"
                    >
                        <SelectValue placeholder="Kiểu chữ" />
                    </SelectTrigger>
                    <SelectContent>
                        {STYLE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value} className={option.className}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <ToolbarDivider />

                <ToolbarButton
                    label="In đậm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                    active={editor.isActive('bold')}
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="In nghiêng"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                    active={editor.isActive('italic')}
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Gạch chân"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={disabled}
                    active={editor.isActive('underline')}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    label="Căn trái"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    disabled={disabled}
                    active={editor.isActive({ textAlign: 'left' })}
                >
                    <AlignLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Căn giữa"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    disabled={disabled}
                    active={editor.isActive({ textAlign: 'center' })}
                >
                    <AlignCenter className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Căn phải"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    disabled={disabled}
                    active={editor.isActive({ textAlign: 'right' })}
                >
                    <AlignRight className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    label="Danh sách không thứ tự"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
                    active={editor.isActive('bulletList')}
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Danh sách có thứ tự"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={disabled}
                    active={editor.isActive('orderedList')}
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    label="Chèn liên kết"
                    onClick={setLink}
                    disabled={disabled}
                    active={editor.isActive('link')}
                >
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>

                <Popover open={isImageMenuOpen} onOpenChange={setIsImageMenuOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label="Chèn ảnh"
                            title="Chèn ảnh"
                            disabled={disabled}
                            className="h-8 w-8 shrink-0 p-0"
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        className="w-[340px] p-0"
                        onOpenAutoFocus={(event) => event.preventDefault()}
                    >
                        <div className="border-b px-3 py-2">
                            <p className="text-xs font-semibold text-foreground">Chèn ảnh vào bài giảng</p>
                            <p className="text-[11px] text-muted-foreground">
                                Tải ảnh lên Cloudinary hoặc dán liên kết ảnh
                            </p>
                        </div>

                        <div className="p-3">
                            <CloudinaryUploader
                                type="image"
                                value=""
                                compact
                                className="h-36"
                                onUploadSuccess={(url) => {
                                    if (!url) return;
                                    editor.chain().focus().setImage({ src: url }).run();
                                    setIsImageMenuOpen(false);
                                }}
                            />
                        </div>

                        <div className="space-y-2 border-t bg-muted/30 p-3">
                            <label htmlFor="lesson-image-url" className="text-[11px] font-medium text-muted-foreground">
                                Hoặc dùng liên kết ảnh
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="lesson-image-url"
                                    placeholder="https://..."
                                    value={imageUrl}
                                    disabled={disabled}
                                    onChange={(event) => setImageUrl(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            insertImageFromUrl();
                                        }
                                    }}
                                    className="h-8 text-xs"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={insertImageFromUrl}
                                    disabled={disabled || !imageUrl.trim()}
                                    className="h-8 shrink-0 gap-1 px-3 text-xs"
                                >
                                    <ImagePlus className="h-3.5 w-3.5" />
                                    Chèn
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover open={isTableMenuOpen} onOpenChange={setIsTableMenuOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label="Quản lý bảng"
                            title="Chèn / quản lý bảng"
                            disabled={disabled}
                            className={cn('h-8 w-8 shrink-0 p-0', isInTable && 'bg-muted text-foreground')}
                        >
                            <TableIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        className="w-[290px] p-3"
                        onOpenAutoFocus={(event) => event.preventDefault()}
                    >
                        <TableSizePicker disabled={disabled} onInsert={insertTable} />
                        {isInTable && (
                            <p className="mt-3 rounded-md bg-muted/60 px-2 py-1.5 text-[11px] text-muted-foreground">
                                Đang ở trong bảng: dùng thanh <span className="font-medium text-foreground">Bảng</span> bên
                                dưới để thêm / xóa hàng, cột và gộp ô.
                            </p>
                        )}
                    </PopoverContent>
                </Popover>

                <ToolbarDivider />

                <ToolbarButton
                    label="Hoàn tác"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={disabled || !editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    label="Làm lại"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={disabled || !editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>
            </div>

            {/* Thanh thao tác bảng: chỉ hiện khi con trỏ nằm trong bảng */}
            {isInTable && (
                <div className="flex flex-nowrap items-center gap-1 overflow-x-auto border-t bg-primary/[0.04] px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <span className="flex shrink-0 items-center gap-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                        <TableProperties className="h-3.5 w-3.5" />
                        Bảng
                    </span>

                    <ToolbarDivider />

                    <TableActionButton
                        icon={ArrowUpToLine}
                        label="Hàng trên"
                        hint="Thêm hàng mới bên trên hàng hiện tại"
                        onClick={() => editor.chain().focus().addRowBefore().run()}
                        disabled={disabled || !editor.can().addRowBefore()}
                    />
                    <TableActionButton
                        icon={ArrowDownToLine}
                        label="Hàng dưới"
                        hint="Thêm hàng mới bên dưới hàng hiện tại"
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                        disabled={disabled || !editor.can().addRowAfter()}
                    />
                    <TableActionButton
                        icon={Trash2}
                        label="Xóa hàng"
                        hint="Xóa hàng đang chứa con trỏ"
                        onClick={() => editor.chain().focus().deleteRow().run()}
                        disabled={disabled || !editor.can().deleteRow()}
                        destructive
                    />

                    <ToolbarDivider />

                    <TableActionButton
                        icon={ArrowLeftToLine}
                        label="Cột trái"
                        hint="Thêm cột mới bên trái cột hiện tại"
                        onClick={() => editor.chain().focus().addColumnBefore().run()}
                        disabled={disabled || !editor.can().addColumnBefore()}
                    />
                    <TableActionButton
                        icon={ArrowRightToLine}
                        label="Cột phải"
                        hint="Thêm cột mới bên phải cột hiện tại"
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                        disabled={disabled || !editor.can().addColumnAfter()}
                    />
                    <TableActionButton
                        icon={Trash2}
                        label="Xóa cột"
                        hint="Xóa cột đang chứa con trỏ"
                        onClick={() => editor.chain().focus().deleteColumn().run()}
                        disabled={disabled || !editor.can().deleteColumn()}
                        destructive
                    />

                    <ToolbarDivider />

                    <TableActionButton
                        icon={TableCellsMerge}
                        label="Gộp ô"
                        hint="Gộp ô: bôi đen từ 2 ô trở lên (kéo chuột hoặc Shift + Click) rồi bấm Gộp ô"
                        onClick={() => editor.chain().focus().mergeCells().run()}
                        disabled={disabled || !canMergeCells}
                    />
                    <TableActionButton
                        icon={TableCellsSplit}
                        label="Tách ô"
                        hint="Tách ô: đặt con trỏ vào ô đã gộp rồi bấm Tách ô"
                        onClick={() => editor.chain().focus().splitCell().run()}
                        disabled={disabled || !canSplitCell}
                    />

                    <ToolbarDivider />

                    <TableActionButton
                        icon={Trash2}
                        label="Xóa bảng"
                        hint="Xóa toàn bộ bảng"
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        disabled={disabled || !editor.can().deleteTable()}
                        destructive
                    />

                    <span className="ml-1 shrink-0 text-[11px] text-muted-foreground">
                        {canMergeCells || canSplitCell
                            ? 'Đã chọn nhiều ô'
                            : 'Mẹo: kéo chọn nhiều ô để gộp'}
                    </span>
                </div>
            )}
        </div>
    );
};

interface MarkdownStorage {
    getMarkdown(): string;
}

/**
 * Heading extension that also recognizes Google Docs exports, where headings are
 * plain paragraphs carrying inline font-size / bold styles.
 */
const CustomHeading = Heading.extend({
    parseHTML() {
        return [
            { tag: 'h1', attrs: { level: 1 } },
            { tag: 'h2', attrs: { level: 2 } },
            { tag: 'h3', attrs: { level: 3 } },
            { tag: 'h4', attrs: { level: 4 } },
            { tag: 'h5', attrs: { level: 5 } },
            // Google Docs style detection
            {
                tag: 'p',
                getAttrs: (element) => {
                    const el = element as HTMLElement;
                    const style = el.getAttribute('style') || '';

                    // Check for bold in self or any child (especially spans from Google Docs)
                    const hasBold = el.querySelector('b, strong, span[style*="700"], span[style*="bold"]') ||
                        style.includes('font-weight:700') ||
                        style.includes('bold');

                    // Check font size in self or first child span
                    const firstSpanStyle = el.querySelector('span')?.getAttribute('style') || '';
                    const combinedStyle = style + firstSpanStyle;

                    const fontSizeMatch = combinedStyle.match(/font-size:\s*(\d+(?:\.\d+)?)(pt|px)/);
                    if (fontSizeMatch) {
                        const size = parseFloat(fontSizeMatch[1]);
                        const unit = fontSizeMatch[2];
                        const ptSize = unit === 'px' ? size * 0.75 : size;

                        if (ptSize >= 24) return { level: 1 };
                        if (ptSize >= 18) return { level: 2 };
                        if (ptSize >= 14 && hasBold) return { level: 3 };
                    }

                    // Specific case: Bold + All Caps + Centered/Large enough
                    const text = el.textContent?.trim() || '';
                    if (hasBold && text === text.toUpperCase() && text.length > 3 && text.length < 100) {
                        return { level: 3 };
                    }

                    return false;
                },
                priority: 1100,
            },
        ];
    },
});

export function LessonEditor({ content, onChange, className, disabled = false }: LessonEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false, // Replaced by CustomHeading below
                link: { openOnClick: false },
            }),
            CustomHeading.configure({
                levels: [1, 2, 3, 4, 5],
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image,
            Markdown.configure({
                html: true,
                tightLists: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
                defaultAlignment: 'left',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-6 py-4',
                    'text-foreground ring-offset-background tiptap'
                ),
            },
        },
        onUpdate: ({ editor }) => {
            const storage = editor.storage as unknown as { markdown: MarkdownStorage };
            const markdown = storage.markdown.getMarkdown();
            onChange(markdown);
        },
        immediatelyRender: false,
    });

    // Content Sync Logic
    const isInitialMount = useRef(true);
    const previousContent = useRef(content);

    // Reset isInitialMount when content changes from outside (e.g., opening dialog with different lesson)
    useEffect(() => {
        if (content !== previousContent.current) {
            isInitialMount.current = true;
            previousContent.current = content;
        }
    }, [content]);

    useEffect(() => {
        if (!editor || content === undefined) return;

        // Sync process:
        // Get current markdown from editor
        const storage = editor.storage as unknown as { markdown: MarkdownStorage };
        const currentMarkdown = storage.markdown.getMarkdown();

        // Update if there is a mismatch
        if (content !== currentMarkdown) {
            // Priority update:
            // - Initial mount (content arriving late from API)
            // - Editor not focused (avoid jumping while typing)
            // - Explicit clearing of content
            if (isInitialMount.current || !editor.isFocused || content === '') {
                editor.commands.setContent(content);
                isInitialMount.current = false;
            }
        }
    }, [content, editor]);

    return (
        <div className={cn('border rounded-md overflow-hidden bg-background flex flex-col', className)}>
            <EditorToolbar editor={editor} disabled={disabled} />
            <div className="flex-1 overflow-y-auto min-h-[200px]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
