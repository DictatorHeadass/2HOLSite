'use client';

import { useState } from 'react';
import { Project } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import { Plus, Trash2, CheckCircle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProjectForm from './ProjectForm';
import { deleteProject, updateProjectProgress, updateProjectStatus } from '@/app/actions';

interface ProjectsPanelProps {
    projects: Project[];
}

export default function ProjectsPanel({ projects }: ProjectsPanelProps) {
    const { isEve } = useAuth();
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editingProgress, setEditingProgress] = useState<number | null>(null);
    const [progressValue, setProgressValue] = useState<number>(0);

    const handleFormSuccess = () => {
        router.refresh();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        await deleteProject(id);
        router.refresh();
    };

    const handleStartEditProgress = (project: Project) => {
        setEditingProgress(project.id);
        setProgressValue(project.progress);
    };

    const handleSaveProgress = async (id: number) => {
        await updateProjectProgress(id, progressValue);
        if (progressValue === 100) {
            const complete = confirm("Progress is 100%. Mark project as Completed?");
            if (complete) {
                await updateProjectStatus(id, 'completed');
            }
        }
        setEditingProgress(null);
        router.refresh();
    };

    const handleMarkComplete = async (id: number) => {
        if (!confirm('Mark this project as fully completed?')) return;
        await updateProjectStatus(id, 'completed');
        router.refresh();
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
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-purple-400">
                                        {editingProgress === project.id ? `${progressValue}%` : `${project.progress}%`}
                                    </span>
                                    {isEve && (
                                        <button
                                            onClick={() => handleMarkComplete(project.id)}
                                            className="text-town-600 hover:text-emerald-400 transition-colors"
                                            title="Mark Complete"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {project.description && (
                                <p className="text-xs text-town-400 mb-2">{project.description}</p>
                            )}

                            {/* Progress Control */}
                            {editingProgress === project.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={progressValue}
                                        onChange={(e) => setProgressValue(Number(e.target.value))}
                                        className="w-full accent-purple-500 h-2 bg-town-900 rounded-lg cursor-pointer"
                                    />
                                    <button
                                        onClick={() => handleSaveProgress(project.id)}
                                        className="p-1 bg-purple-600 hover:bg-purple-500 rounded text-white"
                                    >
                                        <Save className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="relative h-2 bg-town-900/50 rounded-full overflow-hidden cursor-pointer group"
                                    onClick={() => handleStartEditProgress(project)}
                                    title="Click to update progress"
                                >
                                    <div
                                        className={cn(
                                            "absolute top-0 left-0 h-full transition-all duration-500 rounded-full group-hover:brightness-110",
                                            project.progress < 30 ? "bg-rust-500" :
                                                project.progress < 70 ? "bg-gold-500" :
                                                    "bg-emerald-500"
                                        )}
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            )}
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
                            <div key={project.id} className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2 flex items-center justify-between group">
                                <p className="text-xs text-emerald-300">✓ {project.name}</p>
                                {isEve && (
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="text-town-600 hover:text-rust-400 opacity-0 group-hover:opacity-100 transition-all px-2"
                                        title="Delete Project"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
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
