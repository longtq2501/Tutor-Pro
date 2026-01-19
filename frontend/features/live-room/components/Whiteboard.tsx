"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { useWhiteboardSync } from '../hooks/useWhiteboardSync';
import { WhiteboardToolbar } from './WhiteboardToolbar';
import type { StrokePoint } from '../hooks/useWhiteboardSync';

export interface WhiteboardProps {
    roomId: string;
    sendMessage?: (destination: string, payload: unknown) => void;
    className?: string;
}

/**
 * Interactive whiteboard component with drawing capabilities.
 * Supports mouse/touch drawing with throttled WebSocket sync (50ms).
 */
export const Whiteboard: React.FC<WhiteboardProps> = ({
    roomId,
    sendMessage,
    className = '',
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        strokes,
        currentStroke,
        selectedColor,
        selectedWidth,
        selectedTool,
        isDrawing,
        startStroke,
        addPoint,
        endStroke,
        clearBoard,
        setColor,
        setWidth,
        setTool,
    } = useWhiteboardSync(roomId, sendMessage);

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

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <WhiteboardToolbar
                selectedColor={selectedColor}
                selectedWidth={selectedWidth}
                selectedTool={selectedTool}
                onColorChange={setColor}
                onWidthChange={setWidth}
                onToolChange={setTool}
                onClear={clearBoard}
            />
            <div
                ref={containerRef}
                className="relative flex-1 bg-white border rounded-lg overflow-hidden"
            >
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                />
            </div>
        </div>
    );
};
