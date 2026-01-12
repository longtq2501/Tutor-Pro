"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KeywordListProps {
    keywords: string[];
    selectedKeywords: string[];
    onToggle: (keyword: string) => void;
}

export function KeywordList({ keywords, selectedKeywords, onToggle }: KeywordListProps) {
    if (keywords.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 my-1 transition-all">
            {keywords.map((k) => {
                const isSelected = selectedKeywords.includes(k);
                return (
                    <Badge
                        key={k}
                        variant="outline"
                        className={cn(
                            "cursor-pointer select-none text-[11px] px-3 py-1 rounded-xl font-bold transition-all duration-300 border-border/40",
                            isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105"
                                : "bg-background/40 hover:bg-primary/5 hover:border-primary/30 hover:shadow-sm"
                        )}
                        onClick={() => onToggle(k)}
                    >
                        {k}
                    </Badge>
                );
            })}
        </div>
    );
}
