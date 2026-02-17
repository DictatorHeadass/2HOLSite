'use client';

import { Infrastructure } from '@/types';
import { toggleInfrastructure } from '@/app/actions';
import { CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

interface InfrastructurePanelProps {
    infrastructure: Infrastructure[];
}

export default function InfrastructurePanel({ infrastructure }: InfrastructurePanelProps) {
    const { isEve } = useAuth();

    const handleToggle = async (id: number, currentStatus: boolean) => {
        if (!isEve) return;
        await toggleInfrastructure(id, !currentStatus);
    };

    return (
        <div className="bg-town-900/40 backdrop-blur-sm border border-town-800/60 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                🏗️ Infrastructure
            </h3>

            <div className="space-y-2">
                {infrastructure.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleToggle(item.id, item.is_operational)}
                        disabled={!isEve}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 group",
                            !isEve ? "cursor-default opacity-80" : "hover:bg-town-800/30",
                            item.is_operational
                                ? "bg-emerald-950/20 border-emerald-900/30"
                                : "bg-town-950/30 border-town-800/30",
                            isEve && item.is_operational && "hover:bg-emerald-950/30"
                        )}
                    >
                        {item.is_operational ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                            <Square className={cn("w-5 h-5", isEve ? "text-town-600 group-hover:text-town-400" : "text-town-600")} />
                        )}
                        <span className={cn(
                            "text-sm font-medium flex-1 text-left",
                            item.is_operational ? "text-town-200" : "text-town-500"
                        )}>
                            {item.name}
                        </span>
                        <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            item.is_operational
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-rust-500/20 text-rust-300"
                        )}>
                            {item.is_operational ? 'Operational' : 'Offline'}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
