"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eraser, Pen, Trash2 } from 'lucide-react';

export interface WhiteboardToolbarProps {
    selectedColor: string;
    selectedWidth: number;
    selectedTool: 'pen' | 'eraser';
    onColorChange: (color: string) => void;
    onWidthChange: (width: number) => void;
    onToolChange: (tool: 'pen' | 'eraser') => void;
    onClear: () => void;
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
}) => {
    return (
        <div className="flex items-center gap-2 p-2 bg-background border rounded-lg shadow-sm">
            {/* Tool Selection */}
            <div className="flex gap-1">
                <Button
                    variant={selectedTool === 'pen' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => onToolChange('pen')}
                    aria-label="Pen tool"
                >
                    <Pen className="h-4 w-4" />
                </Button>
                <Button
                    variant={selectedTool === 'eraser' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => onToolChange('eraser')}
                    aria-label="Eraser tool"
                >
                    <Eraser className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Color Picker */}
            <ColorPicker
                colors={PRESET_COLORS}
                selectedColor={selectedColor}
                onColorChange={onColorChange}
            />

            <Separator orientation="vertical" className="h-8" />

            {/* Stroke Width */}
            <WidthSelector
                widths={STROKE_WIDTHS}
                selectedWidth={selectedWidth}
                onWidthChange={onWidthChange}
            />

            <Separator orientation="vertical" className="h-8" />

            {/* Clear Button */}
            <Button
                variant="destructive"
                size="icon"
                onClick={onClear}
                aria-label="Clear whiteboard"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
};

/**
 * Color picker sub-component.
 */
const ColorPicker: React.FC<{
    colors: string[];
    selectedColor: string;
    onColorChange: (color: string) => void;
}> = ({ colors, selectedColor, onColorChange }) => (
    <div className="flex gap-1">
        {colors.map(color => (
            <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === color ? 'border-primary scale-110' : 'border-gray-300'
                    }`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
                aria-label={`Select color ${color}`}
            />
        ))}
    </div>
);

/**
 * Stroke width selector sub-component.
 */
const WidthSelector: React.FC<{
    widths: number[];
    selectedWidth: number;
    onWidthChange: (width: number) => void;
}> = ({ widths, selectedWidth, onWidthChange }) => (
    <div className="flex gap-1">
        {widths.map(width => (
            <button
                key={width}
                className={`w-8 h-8 rounded flex items-center justify-center border-2 transition-colors ${selectedWidth === width
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                onClick={() => onWidthChange(width)}
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
