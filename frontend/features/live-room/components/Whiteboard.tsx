"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { useWhiteboardSync } from '../hooks/useWhiteboardSync';
import { WhiteboardToolbar } from './WhiteboardToolbar';
import type { StrokePoint } from '../hooks/useWhiteboardSync';

export interface WhiteboardProps {
    roomId: string;
    currentUserId?: string | number;
    sendMessage?: (destination: string, payload: unknown) => void;
    className?: string;
}

/**
 * Interactive whiteboard component with drawing capabilities.
 * Supports mouse/touch drawing with throttled WebSocket sync (50ms).
 */
export const Whiteboard: React.FC<WhiteboardProps> = ({
    roomId,
    currentUserId,
    sendMessage,
    className,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        strokes,
        currentStroke,
        redoStack,
        selectedColor,
        selectedWidth,
        selectedTool,
        isDrawing,
        startStroke,
        addPoint,
        endStroke,
        clearBoard,
        undoBoard,
        redoBoard,
        setColor,
        setWidth,
        setTool,
    } = useWhiteboardSync(roomId, currentUserId, sendMessage);

    // Keyboard shortcuts for Undo/Redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!e.ctrlKey && !e.metaKey) return;

            if (e.key.toLowerCase() === 'z') {
                if (e.shiftKey) {
                    redoBoard();
                } else {
                    undoBoard();
                }
            } else if (e.key.toLowerCase() === 'y') {
                redoBoard();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undoBoard, redoBoard]);

    // Render all strokes to canvas
    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        [...strokes, currentStroke].filter(Boolean).forEach(stroke => {
            if (!stroke || stroke.points.length === 0) return;

            ctx.beginPath();
            ctx.strokeStyle = stroke.tool === 'eraser' ? '#FFFFFF' : stroke.color;
            ctx.lineWidth = stroke.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            stroke.points.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.stroke();
        });
    }, [strokes, currentStroke]);

    useEffect(() => {
        renderCanvas();
    }, [renderCanvas]);

    // Handle canvas resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            renderCanvas();
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [renderCanvas]);

    const getCanvasPoint = useCallback((e: React.MouseEvent): StrokePoint => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const getCanvasTouchPoint = useCallback((e: React.TouchEvent): StrokePoint | null => {
        const canvas = canvasRef.current;
        if (!canvas || e.touches.length === 0) return null;

        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    }, []);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            const point = getCanvasPoint(e);
            startStroke(point);
        },
        [getCanvasPoint, startStroke]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDrawing) return;
            const point = getCanvasPoint(e);
            addPoint(point);
        },
        [isDrawing, getCanvasPoint, addPoint]
    );

    const handleMouseUp = useCallback(() => {
        if (isDrawing) endStroke();
    }, [isDrawing, endStroke]);

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            // Prevent scrolling while drawing
            // Note: touch-action: none in CSS is also required for this to work reliably
            const point = getCanvasTouchPoint(e);
            if (point) startStroke(point);
        },
        [getCanvasTouchPoint, startStroke]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (!isDrawing) return;
            const point = getCanvasTouchPoint(e);
            if (point) addPoint(point);
        },
        [isDrawing, getCanvasTouchPoint, addPoint]
    );

    const handleTouchEnd = useCallback(() => {
        if (isDrawing) endStroke();
    }, [isDrawing, endStroke]);

    return (
        <div className={`flex flex-col gap-2 ${className || ''}`}>
            <WhiteboardToolbar
                selectedColor={selectedColor}
                selectedWidth={selectedWidth}
                selectedTool={selectedTool}
                onColorChange={setColor}
                onWidthChange={setWidth}
                onToolChange={setTool}
                onClear={clearBoard}
                onUndo={undoBoard}
                onRedo={redoBoard}
                canUndo={strokes.length > 0}
                canRedo={redoStack.length > 0}
            />
            <div
                ref={containerRef}
                className="relative flex-1 bg-white border rounded-lg overflow-hidden"
            >
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 cursor-crosshair touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                />
            </div>
        </div>
    );
};
