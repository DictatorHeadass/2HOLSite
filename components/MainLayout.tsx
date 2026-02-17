'use client';

import { Map, StickyNote, ClipboardList, Activity, Hammer, Search } from 'lucide-react';
// ... (imports)
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
        // ... (wrapper)
        {/* Side Navigation */ }
        < nav className = "..." >
            {/* ... existing buttons ... */ }

            < button
    onClick = {() => setActiveTab('wiki')
}
className = {
    cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
        activeTab === 'wiki'
    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10"
    : "text-town-500 hover:text-town-300 hover:bg-town-800/30"
                        )}
                    >
    { activeTab === 'wiki' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-indigo-600" />
    )}
                        <Search className={cn("w-5 h-5 transition-transform duration-300", activeTab === 'wiki' && "scale-110")} />
                        <span className="font-medium text-sm">Wiki</span>
                    </button >
                    
                </nav >

    {/* Main Content */ }
    < main className = "flex-1 overflow-hidden" >
        {/* Desktop Content */ }
        < div className = {
            cn(
                        "hidden md:block h-full overflow-y-auto scrollbar-thin scrollbar-thumb-town-700 scrollbar-track-transparent",
                        (activeTab !== 'crafting' && activeTab !== 'wiki') && "p-6" // Remove padding for full-screen tabs
                    )}>
    {/* ... existing views ... */ }
    < div className = { cn("h-full transition-all duration-300 ease-in-out", activeTab === 'wiki' ? "block" : "hidden")}>
        { wikiView }
                        </div >
                    </div >
                </main >
            </div >

    {/* Mobile Nav */ }
    < nav className = "..." >
        <div className="flex justify-around items-center h-20">
            {/* ... existing buttons ... */}

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
            </nav >
        </div >
    );
}
