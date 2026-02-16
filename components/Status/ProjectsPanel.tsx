'use client';

import { Project } from '@/types';
import { updateProjectProgress } from '@/app/actions';
import { cn } from '@/lib/utils';

interface ProjectsPanelProps {
    projects: Project[];
}

export default function ProjectsPanel({ projects }: ProjectsPanelProps) {
    const activeProjects = projects.filter(p => p.status === 'active');
    const completedProjects = projects.filter(p => p.status === 'completed');

    return (
        <div className="bg-town-900/40 backdrop-blur-sm border border-town-800/60 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                📋 Active Projects
            </h3>

            {activeProjects.length === 0 ? (
                <div className="text-center py-8 text-town-600">
                    <p className="text-sm">No active projects</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activeProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-town-950/30 border border-town-800/30 rounded-lg p-3"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-medium text-town-200">{project.name}</h4>
                                <span className="text-xs font-bold text-purple-400">{project.progress}%</span>
                            </div>

                            {project.description && (
                                <p className="text-xs text-town-400 mb-2">{project.description}</p>
                            )}

                            {/* Progress Bar */}
                            <div className="relative h-2 bg-town-900/50 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "absolute top-0 left-0 h-full transition-all duration-500 rounded-full",
                                        project.progress < 30 ? "bg-rust-500" :
                                            project.progress < 70 ? "bg-gold-500" :
                                                "bg-emerald-500"
                                    )}
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {completedProjects.length > 0 && (
                <details className="mt-4">
                    <summary className="text-xs text-town-500 cursor-pointer hover:text-town-400 transition-colors">
                        Show {completedProjects.length} completed project{completedProjects.length !== 1 ? 's' : ''}
                    </summary>
                    <div className="space-y-2 mt-2">
                        {completedProjects.map((project) => (
                            <div key={project.id} className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2">
                                <p className="text-xs text-emerald-300">✓ {project.name}</p>
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </div>
    );
}
