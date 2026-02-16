'use client';

import { Issue, IssueSeverity } from '@/types';
import { deleteIssue, updateIssueStatus } from '@/app/actions';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IssuesPanelProps {
    issues: Issue[];
}

const severityConfig: Record<IssueSeverity, { icon: string; color: string }> = {
    critical: { icon: '🔴', color: 'bg-red-950/40 border-red-900/50 text-red-300' },
    high: { icon: '🟠', color: 'bg-orange-950/40 border-orange-900/50 text-orange-300' },
    medium: { icon: '🟡', color: 'bg-yellow-950/40 border-yellow-900/50 text-yellow-300' },
    low: { icon: '🟢', color: 'bg-green-950/40 border-green-900/50 text-green-300' }
};

export default function IssuesPanel({ issues }: IssuesPanelProps) {
    const handleResolve = async (id: number) => {
        await updateIssueStatus(id, 'resolved');
    };

    const handleDelete = async (id: number) => {
        await deleteIssue(id);
    };

    const openIssues = issues.filter(i => i.status !== 'resolved');
    const resolvedIssues = issues.filter(i => i.status === 'resolved');

    return (
        <div className="bg-town-900/40 backdrop-blur-sm border border-town-800/60 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-rust-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                ⚠️ Current Issues
            </h3>

            {openIssues.length === 0 ? (
                <div className="text-center py-8 text-town-600">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No active issues</p>
                </div>
            ) : (
                <div className="space-y-2 mb-4">
                    {openIssues.map((issue) => {
                        const config = severityConfig[issue.severity];

                        return (
                            <div
                                key={issue.id}
                                className={cn(
                                    "border rounded-lg p-3 transition-all",
                                    config.color
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">{config.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-sm font-medium text-town-200">{issue.title}</h4>
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-town-950/40">
                                                {issue.severity}
                                            </span>
                                        </div>
                                        {issue.description && (
                                            <p className="text-xs text-town-400 mb-2">{issue.description}</p>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleResolve(issue.id)}
                                                className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded hover:bg-emerald-500/30 transition-colors"
                                            >
                                                Mark Resolved
                                            </button>
                                            <button
                                                onClick={() => handleDelete(issue.id)}
                                                className="text-xs px-2 py-1 bg-town-800/40 text-town-400 rounded hover:bg-town-700/40 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {resolvedIssues.length > 0 && (
                <details className="mt-4">
                    <summary className="text-xs text-town-500 cursor-pointer hover:text-town-400 transition-colors">
                        Show {resolvedIssues.length} resolved issue{resolvedIssues.length !== 1 ? 's' : ''}
                    </summary>
                    <div className="space-y-2 mt-2">
                        {resolvedIssues.map((issue) => (
                            <div key={issue.id} className="bg-town-950/30 border border-town-800/30 rounded-lg p-2 opacity-60">
                                <p className="text-xs text-town-400 line-through">{issue.title}</p>
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </div>
    );
}
