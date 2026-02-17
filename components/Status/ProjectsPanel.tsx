'use client';

import { useState } from 'react';
import { Project } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import { Plus } from 'lucide-react';
import ProjectForm from './ProjectForm';

interface ProjectsPanelProps {
    projects: Project[];
}

export default function ProjectsPanel({ projects }: ProjectsPanelProps) {
    const { isEve } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleFormSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    const activeProjects = projects.filter(p => p.status === 'active');
    const completedProjects = projects.filter(p => p.status === 'completed');

    return (
        <div className="bg-town-900/40 backdrop-blur-sm border border-town-800/60 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    📋 Active Projects
                </h3>
                {isEve && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New Project
                    </button>
                )}
            </div>

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

            {showForm && (
                <ProjectForm
                    onClose={() => setShowForm(false)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
}
