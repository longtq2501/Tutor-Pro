import React from 'react';
import { useRoomState } from '../context/RoomStateContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ParticipantPresence = () => {
    const { state } = useRoomState();
    const { participants } = state;

    return (
        <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
                {participants.map((p) => (
                    <TooltipProvider key={p.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={cn(
                                    "relative rounded-full border-2 border-background transition-transform hover:z-10 hover:scale-105",
                                    p.role === 'TUTOR' ? "z-10" : "z-0"
                                )}>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={p.avatarUrl} alt={p.name} />
                                        <AvatarFallback className={cn(
                                            "text-[10px] font-bold",
                                            p.role === 'TUTOR' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                                        )}>
                                            {p.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Status Indicators (optional micro-badges) */}
                                    <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                                        {p.isMicMuted && (
                                            <div className="bg-destructive text-destructive-foreground rounded-full p-[2px]">
                                                <MicOff size={8} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                                <p className="font-bold">{p.name}</p>
                                <p className="text-muted-foreground">{p.role === 'TUTOR' ? 'Giáo viên' : 'Học sinh'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
            {participants.length > 2 && (
                <span className="text-xs text-muted-foreground ml-2">+{participants.length - 2}</span>
            )}
        </div>
    );
};
