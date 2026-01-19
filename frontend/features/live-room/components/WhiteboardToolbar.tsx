"use client";

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eraser, Pen, Trash2, Undo2, Redo2 } from 'lucide-react';

export interface WhiteboardToolbarProps {
    selectedColor: string;
    selectedWidth: number;
    selectedTool: 'pen' | 'eraser';
    onColorChange: (color: string) => void;
    onWidthChange: (width: number) => void;
    onToolChange: (tool: 'pen' | 'eraser') => void;
    onClear: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
}

const PRESET_COLORS = [
    '#000000', // Black
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#8B5CF6', // Purple
];

const STROKE_WIDTHS = [2, 4, 8];

const RESPONSIVE_SIZES = {
    button: "h-12 w-12 md:h-9 md:w-9",
    icon: "h-6 w-6 md:h-4 md:w-4",
    colorSwatch: "w-10 h-10 md:w-6 md:h-6",
    widthOption: "w-12 h-12 md:w-8 md:h-8",
} as const;

/**
 * Toolbar component for whiteboard drawing controls.
 * Provides color picker, stroke width, tool selection, and clear button.
 */
export const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
    selectedColor,
    selectedWidth,
    selectedTool,
    onColorChange,
    onWidthChange,
    onToolChange,
    onClear,
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false,
}) => {
    const handleHaptic = useCallback(() => {
        if ('vibrate' in navigator) navigator.vibrate(10);
    }, []);

    const handleToolSelect = (tool: 'pen' | 'eraser') => {
        handleHaptic();
        onToolChange(tool);
    };

    return (
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 p-2 bg-background border rounded-lg shadow-sm contain-layout">
            {/* Tool Selection */}
            <div className="flex gap-2 md:gap-1">
                <Button
                    variant={selectedTool === 'pen' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleToolSelect('pen')}
                    className={RESPONSIVE_SIZES.button}
                    aria-label="Pen tool"
                >
                    <Pen className={RESPONSIVE_SIZES.icon} />
                </Button>
                <Button
                    variant={selectedTool === 'eraser' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handleToolSelect('eraser')}
                    className={RESPONSIVE_SIZES.button}
                    aria-label="Eraser tool"
                >
                    <Eraser className={RESPONSIVE_SIZES.icon} />
                </Button>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-8 bg-border" />
            <div className="md:hidden w-full h-px bg-border/50" />

            {/* History Controls */}
            <div className="flex gap-2 md:gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => { handleHaptic(); onUndo?.(); }}
                    disabled={!canUndo}
                    className={RESPONSIVE_SIZES.button}
                    aria-label="Undo"
                >
                    <Undo2 className={RESPONSIVE_SIZES.icon} />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => { handleHaptic(); onRedo?.(); }}
                    disabled={!canRedo}
                    className={RESPONSIVE_SIZES.button}
                    aria-label="Redo"
                >
                    <Redo2 className={RESPONSIVE_SIZES.icon} />
                </Button>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-8 bg-border" />
            <div className="md:hidden w-full h-px bg-border/50" />

            {/* Color Picker */}
            <ColorPicker
                colors={PRESET_COLORS}
                selectedColor={selectedColor}
                onColorChange={(c) => { handleHaptic(); onColorChange(c); }}
            />

            <Separator orientation="vertical" className="hidden md:block h-8 bg-border" />
            <div className="md:hidden w-full h-px bg-border/50" />

            {/* Stroke Width */}
            <WidthSelector
                widths={STROKE_WIDTHS}
                selectedWidth={selectedWidth}
                onWidthChange={(w) => { handleHaptic(); onWidthChange(w); }}
            />

            <Separator orientation="vertical" className="hidden md:block h-8 bg-border" />
            <div className="md:hidden w-full h-px bg-border/50" />

            {/* Clear Button */}
            <Button
                variant="destructive"
                size="icon"
                onClick={() => { handleHaptic(); onClear(); }}
                className={RESPONSIVE_SIZES.button}
                aria-label="Clear whiteboard"
            >
                <Trash2 className={RESPONSIVE_SIZES.icon} />
            </Button>
        </div>
    );
};

/**
 * Color picker sub-component.
 */
const ColorPicker = React.memo<{
    colors: string[];
    selectedColor: string;
    onColorChange: (color: string) => void;
}>(({ colors, selectedColor, onColorChange }) => {
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            onColorChange(colors[(index + 1) % colors.length]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            onColorChange(colors[(index - 1 + colors.length) % colors.length]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 md:gap-1 justify-center" role="group" aria-label="Color selection">
            {colors.map((color, index) => (
                <button
                    key={color}
                    tabIndex={selectedColor === color ? 0 : -1}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onTouchStart={(e) => { e.preventDefault(); onColorChange(color); }}
                    onClick={() => onColorChange(color)}
                    className={`rounded-full border-2 transition-transform hover:scale-110 active:scale-95 shadow-sm ${selectedColor === color ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-gray-300'
                        } ${RESPONSIVE_SIZES.colorSwatch}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color.toLowerCase()}`}
                />
            ))}
        </div>
    );
});
ColorPicker.displayName = "ColorPicker";

/**
 * Stroke width selector sub-component.
 */
const WidthSelector = React.memo<{
    widths: number[];
    selectedWidth: number;
    onWidthChange: (width: number) => void;
}>(({ widths, selectedWidth, onWidthChange }) => {
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            onWidthChange(widths[(index + 1) % widths.length]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            onWidthChange(widths[(index - 1 + widths.length) % widths.length]);
        }
    };

    return (
        <div className="flex gap-2 md:gap-1" role="group" aria-label="Stroke width selection">
            {widths.map((width, index) => (
                <button
                    key={width}
                    tabIndex={selectedWidth === width ? 0 : -1}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onTouchStart={(e) => { e.preventDefault(); onWidthChange(width); }}
                    onClick={() => onWidthChange(width)}
                    className={`rounded-lg flex items-center justify-center border-2 transition-colors active:scale-95 shadow-sm ${selectedWidth === width
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-gray-400'
                        } ${RESPONSIVE_SIZES.widthOption}`}
                    aria-label={`Stroke width ${width}px`}
                >
                    <div
                        className="rounded-full bg-current"
                        style={{ width: `${width}px`, height: `${width}px` }}
                    />
                </button>
            ))}
        </div>
    );
});
WidthSelector.displayName = "WidthSelector";
