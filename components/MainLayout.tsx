'use client';

import { useState, ReactNode } from 'react';
import { Map, StickyNote, ClipboardList, Activity, Hammer, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoginForm from './Auth/LoginForm';
import UserInfo from './Auth/UserInfo';

interface MainLayoutProps {
    coordView: ReactNode;
    noticeView: ReactNode;
    taskView: ReactNode;
    statusView: ReactNode;
    craftingView: ReactNode;
    wikiView: ReactNode;
}

export default function MainLayout({ coordView, noticeView, taskView, statusView, craftingView, wikiView }: MainLayoutProps) {
    const [activeTab, setActiveTab] = useState<'coords' | 'notices' | 'tasks' | 'status' | 'crafting' | 'wiki'>('coords');

    return (
        <div className="flex flex-col h-screen max-w-md md:max-w-[1920px] mx-auto bg-town-900/60 backdrop-blur-xl border-x border-town-800 shadow-2xl overflow-hidden relative">
            {/* Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="px-5 py-4 border-b border-town-800 bg-town-950/40 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-serif font-bold text-town-100 flex items-center gap-2 tracking-wide">
                        <span className="text-gold-500 drop-shadow-sm">Dictator&apos;s Town Hall</span>
                    </h1>
                    <div className="text-[10px] text-town-500 font-mono tracking-wider uppercase mt-0.5">Cyan&apos;s Community Town</div>
                </div>
                <div className="flex items-center gap-3">
                    <UserInfo />
                    <LoginForm />
                </div>
            </header>

            {/* Desktop: Side Nav + Content Grid | Mobile: Tabbed Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Side Navigation - Desktop Only */}
                <nav className="hidden md:flex md:flex-col md:w-48 lg:w-56 border-r border-town-800 bg-town-950/40 backdrop-blur-md p-4 gap-2">
                    <button
                        onClick={() => setActiveTab('coords')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                            activeTab === 'coords'
                                ? "bg-gold-500/20 text-gold-300 border border-gold-500/30 shadow-lg shadow-gold-500/10"
                                : "text-town-500 hover:text-town-300 hover:bg-town-800/30"
                        )}
                    >
                        {activeTab === 'coords' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 to-gold-600" />
                        )}
                        <Map className={cn("w-5 h-5 transition-transform duration-300", activeTab === 'coords' && "scale-110")} />
                        <span className="font-medium text-sm">Coordinates</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('notices')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                            activeTab === 'notices'
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                                : "text-town-500 hover:text-town-300 hover:bg-town-800/30"
                        )}
                    >
                        {activeTab === 'notices' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600" />
                        )}
                        <StickyNote className={cn("w-5 h-5 transition-transform duration-300", activeTab === 'notices' && "scale-110")} />
                        <span className="font-medium text-sm">Notices</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                            activeTab === 'tasks'
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10"
                                : "text-town-500 hover:text-town-300 hover:bg-town-800/30"
                        )}
                    >
                        {activeTab === 'tasks' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-purple-600" />
                        )}
                        <ClipboardList className={cn("w-5 h-5 transition-transform duration-300", activeTab === 'tasks' && "scale-110")} />
                        <span className="font-medium text-sm">Tasks</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('status')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                            activeTab === 'status'
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                                : "text-town-500 hover:text-town-300 hover:bg-town-800/30"
                        )}
                    >
                        {activeTab === 'status' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600" />
                        )}
                        <Activity className={cn("w-5 h-5 transition-transform duration-300", activeTab === 'status' && "scale-110")} />
                        <span className="font-medium text-sm">Status</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('crafting')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                            activeTab === 'crafting'
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/10"
                                : "text-town-500 hover:text-town-300 hover:bg-town-800/30"
                        )}
                    >
                        {activeTab === 'crafting' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
                        )}
                        <Hammer className={cn("w-5 h-5 transition-transform duration-300", activeTab === 'crafting' && "scale-110")} />
                        <span className="font-medium text-sm">Crafting</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('wiki')}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                            activeTab === 'wiki'
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                                : "text-town-500 hover:text-town-300 hover:bg-town-800/30"
                        )}
                    >
                        {activeTab === 'wiki' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-indigo-600" />
                        )}
                        <Search className={cn("w-5 h-5 transition-transform duration-300", activeTab === 'wiki' && "scale-110")} />
                        <span className="font-medium text-sm">Wiki</span>
                    </button>
                </nav>

                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden">
                    {/* Mobile: Single Column with Tab Switching */}
                    <div className="md:hidden h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-town-700 scrollbar-track-transparent pb-24">
                        <div className={cn("transition-all duration-500 ease-in-out", activeTab === 'coords' ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-4")}>
                            {coordView}
                        </div>
                        <div className={cn("transition-all duration-500 ease-in-out", activeTab === 'notices' ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-4")}>
                            {noticeView}
                        </div>
                        <div className={cn("transition-all duration-500 ease-in-out", activeTab === 'tasks' ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-4")}>
                            {taskView}
                        </div>
                        <div className={cn("transition-all duration-500 ease-in-out", activeTab === 'status' ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-4")}>
                            {statusView}
                        </div>
                        <div className={cn("transition-all duration-500 ease-in-out", activeTab === 'crafting' ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-4")}>
                            {craftingView}
                        </div>
                        <div className={cn("transition-all duration-500 ease-in-out", activeTab === 'wiki' ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-4")}>
                            {wikiView}
                        </div>
                    </div>

                    {/* Desktop: Single Content Area - Show Active Tab Only */}
                    <div className={cn(
                        "hidden md:block h-full overflow-y-auto scrollbar-thin scrollbar-thumb-town-700 scrollbar-track-transparent",
                        (activeTab !== 'crafting' && activeTab !== 'wiki') && "p-6" // Remove padding for full-screen tabs
                    )}>
                        <div className={cn("transition-all duration-300 ease-in-out", activeTab === 'coords' ? "block" : "hidden")}>
                            {coordView}
                        </div>
                        <div className={cn("transition-all duration-300 ease-in-out", activeTab === 'notices' ? "block" : "hidden")}>
                            {noticeView}
                        </div>
                        <div className={cn("transition-all duration-300 ease-in-out", activeTab === 'tasks' ? "block" : "hidden")}>
                            {taskView}
                        </div>
                        <div className={cn("transition-all duration-300 ease-in-out", activeTab === 'status' ? "block" : "hidden")}>
                            {statusView}
                        </div>
                        <div className={cn("h-full transition-all duration-300 ease-in-out", activeTab === 'crafting' ? "block" : "hidden")}>
                            {craftingView}
                        </div>
                        <div className={cn("h-full transition-all duration-300 ease-in-out", activeTab === 'wiki' ? "block" : "hidden")}>
                            {wikiView}
                        </div>
                    </div>
                </main>
            </div>

            {/* Bottom Navigation Tabs - Mobile Only */}
            <nav className="md:hidden border-t border-town-800 bg-town-950/80 backdrop-blur-lg absolute bottom-0 w-full z-20 pb-safe">
                <div className="flex justify-around items-center h-20">
                    <button
                        onClick={() => setActiveTab('coords')}
                        className="group flex flex-col items-center justify-center w-full h-full relative"
                    >
                        <div className={cn(
                            "absolute top-0 w-12 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent transition-all duration-300",
                            activeTab === 'coords' ? "opacity-100" : "opacity-0"
                        )} />
                        <Map className={cn("w-6 h-6 mb-1 transition-colors duration-300", activeTab === 'coords' ? "text-gold-400 drop-shadow-md" : "text-town-600 group-hover:text-town-400")} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors duration-300", activeTab === 'coords' ? "text-town-200" : "text-town-600")}>Coords</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('notices')}
                        className="group flex flex-col items-center justify-center w-full h-full relative"
                    >
                        <div className={cn(
                            "absolute top-0 w-12 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent transition-all duration-300",
                            activeTab === 'notices' ? "opacity-100" : "opacity-0"
                        )} />
                        <StickyNote className={cn("w-6 h-6 mb-1 transition-colors duration-300", activeTab === 'notices' ? "text-emerald-400 drop-shadow-md" : "text-town-600 group-hover:text-town-400")} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors duration-300", activeTab === 'notices' ? "text-town-200" : "text-town-600")}>Notices</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('tasks')}
                        className="group flex flex-col items-center justify-center w-full h-full relative"
                    >
                        <div className={cn(
                            "absolute top-0 w-12 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-all duration-300",
                            activeTab === 'tasks' ? "opacity-100" : "opacity-0"
                        )} />
                        <ClipboardList className={cn("w-6 h-6 mb-1 transition-colors duration-300", activeTab === 'tasks' ? "text-purple-400 drop-shadow-md" : "text-town-600 group-hover:text-town-400")} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors duration-300", activeTab === 'tasks' ? "text-town-200" : "text-town-600")}>Tasks</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('status')}
                        className="group flex flex-col items-center justify-center w-full h-full relative"
                    >
                        <div className={cn(
                            "absolute top-0 w-12 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-all duration-300",
                            activeTab === 'status' ? "opacity-100" : "opacity-0"
                        )} />
                        <Activity className={cn("w-6 h-6 mb-1 transition-colors duration-300", activeTab === 'status' ? "text-cyan-400 drop-shadow-md" : "text-town-600 group-hover:text-town-400")} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors duration-300", activeTab === 'status' ? "text-town-200" : "text-town-600")}>Status</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('crafting')}
                        className="group flex flex-col items-center justify-center w-full h-full relative"
                    >
                        <div className={cn(
                            "absolute top-0 w-12 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-300",
                            activeTab === 'crafting' ? "opacity-100" : "opacity-0"
                        )} />
                        <Hammer className={cn("w-6 h-6 mb-1 transition-colors duration-300", activeTab === 'crafting' ? "text-amber-400 drop-shadow-md" : "text-town-600 group-hover:text-town-400")} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors duration-300", activeTab === 'crafting' ? "text-town-200" : "text-town-600")}>Crafting</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('wiki')}
                        className="group flex flex-col items-center justify-center w-full h-full relative"
                    >
                        <div className={cn(
                            "absolute top-0 w-12 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent transition-all duration-300",
                            activeTab === 'wiki' ? "opacity-100" : "opacity-0"
                        )} />
                        <Search className={cn("w-6 h-6 mb-1 transition-colors duration-300", activeTab === 'wiki' ? "text-indigo-400 drop-shadow-md" : "text-town-600 group-hover:text-town-400")} />
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors duration-300", activeTab === 'wiki' ? "text-town-200" : "text-town-600")}>Wiki</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}
