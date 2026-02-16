'use client';

import { Notice } from '@/types';
import { deleteNotice } from '@/app/actions';
import { Trash2, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoticeListProps {
    notices: Notice[];
}

export default function NoticeList({ notices }: NoticeListProps) {

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'border-red-900/50 bg-red-950/20 shadow-[0_0_15px_-5px_rgba(220,38,38,0.3)]';
            case 'High': return 'border-rust-600/50 bg-rust-900/20';
            case 'Low': return 'border-town-800 bg-town-900/20 opacity-80';
            default: return 'border-town-700/50 bg-town-900/30'; // Normal
        }
    };

    const formattedDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
    };

    return (
        <div className="space-y-3">
            {notices.length === 0 && (
                <div className="text-center text-town-600 py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-town-900/50 rounded-full flex items-center justify-center mb-3">
                        <StickyNote className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">No active notices</p>
                </div>
            )}

            {notices.map((notice) => (
                <div
                    key={notice.id}
                    className={cn(
                        "border rounded-xl p-4 shadow-sm relative group backdrop-blur-sm transition-all hover:scale-[1.01]",
                        getPriorityStyles(notice.priority)
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                            "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full",
                            notice.priority === 'Critical' ? "bg-red-500/20 text-red-200" :
                                notice.priority === 'High' ? "bg-rust-500/20 text-rust-200" :
                                    "bg-town-500/20 text-town-400"
                        )}>
                            {notice.priority}
                        </span>
                        <span className="text-[10px] text-town-500 font-mono">
                            {formattedDate(notice.created_at)}
                        </span>
                    </div>

                    <p className="text-sm font-medium text-town-200 whitespace-pre-wrap leading-relaxed">
                        {notice.message}
                    </p>

                    <div className="flex justify-end pt-2 mt-2 border-t border-town-800/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => deleteNotice(notice.id)}
                            className="text-town-500 hover:text-rust-400 text-xs flex items-center gap-1 transition-all px-2 py-1"
                        >
                            <Trash2 className="w-3 h-3" /> Dismiss
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
