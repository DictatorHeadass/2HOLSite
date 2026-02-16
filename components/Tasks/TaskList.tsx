'use client';

import { Task } from '@/types';
import { updateTaskStatus } from '@/app/actions';
import { CheckCircle2, User, XCircle, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function TaskList({ tasks }: { tasks: Task[] }) {
    const [claimName, setClaimName] = useState<{ [key: number]: string }>({});

    const handleClaim = async (id: number) => {
        const name = claimName[id];
        if (!name) return;
        await updateTaskStatus(id, 'Claimed', name);
        setClaimName(prev => ({ ...prev, [id]: '' }));
    };

    return (
        <div className="space-y-3">
            {tasks.length === 0 && (
                <div className="text-center text-town-600 py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-town-900/50 rounded-full flex items-center justify-center mb-3">
                        <ClipboardCheck className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">All systems normal</p>
                    <p className="text-xs opacity-50 mt-1">No pending tasks.</p>
                </div>
            )}

            {tasks.map((task) => (
                <div key={task.id} className={cn(
                    "bg-town-900/40 backdrop-blur-sm border rounded-xl p-4 shadow-sm transition-all",
                    task.status === 'Completed' ? "border-town-800/30 opacity-60 bg-town-950/20" : "border-town-800/60"
                )}>
                    <div className="flex justify-between items-start">
                        <h4 className={cn("font-medium text-sm text-town-200", task.status === 'Completed' && "line-through text-town-600 decoration-town-600/50")}>
                            {task.title}
                        </h4>
                        <span className={cn(
                            "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border",
                            task.status === 'Open' ? "bg-town-800/40 text-town-400 border-town-700/50" :
                                task.status === 'Claimed' ? "bg-purple-950/40 text-purple-400 border-purple-900/50" :
                                    "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                        )}>
                            {task.status}
                        </span>
                    </div>

                    {task.description && (
                        <div className="bg-town-950/30 rounded-lg p-2.5 mt-2 mb-1 border border-town-800/30">
                            <p className="text-xs text-town-400 leading-relaxed">{task.description}</p>
                        </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-town-800/30 flex items-center justify-between">
                        {task.status === 'Open' && (
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="bg-town-950/50 border border-town-800 rounded-lg px-2.5 py-1.5 text-xs text-town-200 focus:outline-none focus:ring-1 focus:ring-purple-500/50 w-full"
                                    value={claimName[task.id] || ''}
                                    onChange={(e) => setClaimName(prev => ({ ...prev, [task.id]: e.target.value }))}
                                />
                                <button
                                    onClick={() => handleClaim(task.id)}
                                    disabled={!claimName[task.id]}
                                    className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium"
                                >
                                    Claim
                                </button>
                            </div>
                        )}

                        {task.status === 'Claimed' && (
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-950/20 px-2 py-1 rounded-md border border-purple-900/30">
                                    <User className="w-3 h-3" />
                                    <span className="font-mono">{task.claimed_by}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateTaskStatus(task.id, 'Open')}
                                        className="text-town-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
                                    >
                                        <XCircle className="w-3 h-3" /> Unclaim
                                    </button>
                                    <button
                                        onClick={() => updateTaskStatus(task.id, 'Completed')}
                                        className="text-emerald-500 hover:text-emerald-400 text-xs flex items-center gap-1 transition-colors bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/30 hover:border-emerald-500/30"
                                    >
                                        <CheckCircle2 className="w-3 h-3" /> Done
                                    </button>
                                </div>
                            </div>
                        )}

                        {task.status === 'Completed' && (
                            <div className="w-full flex justify-end">
                                <button
                                    onClick={() => updateTaskStatus(task.id, 'Open')}
                                    className="text-town-600 hover:text-town-400 text-xs transition-colors"
                                >
                                    Reopen
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
