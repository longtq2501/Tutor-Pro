'use client';

import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * A reusable tooltip wrapper for action buttons.
 * Following Clean Code: Self-documenting, single responsibility.
 * 
 * @param children - The trigger element (usually an icon button)
 * @param label - The text to display in the tooltip
 * @param side - Position of the tooltip (default: "top")
 */
interface ActionTooltipProps {
    children: React.ReactNode;
    label: string;
    side?: "top" | "bottom" | "left" | "right";
}

export const ActionTooltip: React.FC<ActionTooltipProps> = ({
    children,
    label,
    side = "top"
}) => {
    return (
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent
                side={side}
                className="font-bold"
            >
                {label}
            </TooltipContent>
        </Tooltip>
    );
};
