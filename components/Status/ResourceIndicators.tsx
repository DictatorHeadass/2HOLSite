'use client';

import { TownStatus, ResourceStatus } from '@/types';
import { updateResourceStatus } from '@/app/actions';
import { cn } from '@/lib/utils';

interface ResourceIndicatorsProps {
    townStatus: TownStatus[];
}

const statusConfig: Record<ResourceStatus, { emoji: string; label: string; color: string }> = {
    crisis: { emoji: '🔴', label: 'Crisis', color: 'text-red-400 bg-red-950/40 border-red-900/50' },
    low: { emoji: '🟡', label: 'Low', color: 'text-yellow-400 bg-yellow-950/40 border-yellow-900/50' },
    good: { emoji: '🟢', label: 'Good', color: 'text-green-400 bg-green-950/40 border-green-900/50' },
    abundant: { emoji: '🔵', label: 'Abundant', color: 'text-blue-400 bg-blue-950/40 border-blue-900/50' }
};

const statusOrder: ResourceStatus[] = ['crisis', 'low', 'good', 'abundant'];

export default function ResourceIndicators({ townStatus }: ResourceIndicatorsProps) {
    const handleStatusChange = async (resourceName: string, newStatus: ResourceStatus) => {
        await updateResourceStatus(resourceName, newStatus);
    };

    return (
        <div className="bg-town-900/40 backdrop-blur-sm border border-town-800/60 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                📊 Resource Status
            </h3>

            <div className="space-y-3">
                {townStatus.map((resource) => (
                    <div key={resource.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-town-200">{resource.resource_name}</span>
                            <span className="text-xs text-town-500">
                                {new Date(resource.updated_at).toLocaleTimeString()}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            {statusOrder.map((status) => {
                                const config = statusConfig[status];
                                const isActive = resource.status === status;

                                return (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(resource.resource_name, status)}
                                        className={cn(
                                            "flex-1 px-3 py-2 rounded-lg border transition-all duration-200 text-xs font-medium",
                                            isActive
                                                ? `${config.color} scale-105 shadow-lg`
                                                : "bg-town-950/30 border-town-800/30 text-town-600 hover:bg-town-800/30 hover:text-town-400"
                                        )}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-lg">{config.emoji}</span>
                                            <span>{config.label}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
