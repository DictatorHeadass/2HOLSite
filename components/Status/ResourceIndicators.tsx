'use client';

import { TownStatus, ResourceStatus } from '@/types';
import { updateTownStatus } from '@/app/actions';
import { useAuth } from '@/lib/AuthContext';
import { Droplets, Warehouse, Construction, Bandage } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ElementType, useState } from 'react';

interface ResourceIndicatorsProps {
    statuses: TownStatus[];
}

const resourceConfig: Record<string, { icon: ElementType; color: string }> = {
    Food: { icon: Warehouse, color: 'text-orange-400' },
    Water: { icon: Droplets, color: 'text-blue-400' },
    Tools: { icon: Construction, color: 'text-stone-400' },
    Medicine: { icon: Bandage, color: 'text-red-400' },
};

const statusLevels: ResourceStatus[] = ['crisis', 'low', 'good', 'abundant'];

export default function ResourceIndicators({ statuses }: ResourceIndicatorsProps) {
    const { isEve } = useAuth();
    const [updating, setUpdating] = useState<number | null>(null);

    const handleUpdate = async (id: number, currentStatus: ResourceStatus) => {
        if (!isEve) return;
        setUpdating(id);
        const currentIndex = statusLevels.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statusLevels.length;
        const nextStatus = statusLevels[nextIndex];

        await updateTownStatus(id, nextStatus);
        setUpdating(null);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statuses.map((resource) => {
                const config = resourceConfig[resource.resource_name] || { icon: Warehouse, color: 'text-gray-400' };
                const Icon = config.icon;

                return (
                    <div
                        key={resource.id}
                        className="bg-town-900/40 backdrop-blur-sm border border-town-800/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm transition-transform hover:scale-105"
                    >
                        <div className={cn("p-2 rounded-full", config.color, "bg-town-950/50")}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-town-200">{resource.resource_name}</h3>

                        {isEve ? (
                            <button
                                onClick={() => handleUpdate(resource.id, resource.status)}
                                disabled={updating === resource.id}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                                    resource.status === 'crisis' ? "bg-red-950 text-red-500 border border-red-900 hover:bg-red-900" :
                                        resource.status === 'low' ? "bg-orange-950 text-orange-500 border border-orange-900 hover:bg-orange-900" :
                                            resource.status === 'good' ? "bg-emerald-950 text-emerald-500 border border-emerald-900 hover:bg-emerald-900" :
                                                "bg-blue-950 text-blue-500 border border-blue-900 hover:bg-blue-900", // abundant
                                    updating === resource.id && "opacity-50 cursor-wait"
                                )}
                            >
                                {resource.status}
                            </button>
                        ) : (
                            <div
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider cursor-default",
                                    resource.status === 'crisis' ? "bg-red-950/50 text-red-500 border border-red-900/50" :
                                        resource.status === 'low' ? "bg-orange-950/50 text-orange-500 border border-orange-900/50" :
                                            resource.status === 'good' ? "bg-emerald-950/50 text-emerald-500 border border-emerald-900/50" :
                                                "bg-blue-950/50 text-blue-500 border border-blue-900/50" // abundant
                                )}
                            >
                                {resource.status}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
