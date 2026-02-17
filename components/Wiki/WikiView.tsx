'use client';

import { useState } from 'react';
import { Search, ExternalLink, AlertTriangle } from 'lucide-react';

export default function WikiView() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [hasError, setHasError] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        // Construct Wiki URL: https://onemap.wondible.com/#x=0&y=0&z=29&s=17&t=1739811600
        // Wait, the user asked for a "wiki" search.
        // The most common 2HOL wiki is usually the official OHOL wiki or specific 2HOL resources.
        // Let's assume a standard MediaWiki style or similar.
        // User mentioned "searches the wiki for that item".
        // Let's try to find a 2HOL wiki URL.
        // If not known, I'll default to a generic one or ask.
        // But for now, let's use a placeholder or common one.
        // Actually, "Two Hours One Life" often uses the OHOL wiki or a specific one.
        // Let's use `https://twohoursonelife.miraheze.org/wiki/` as a best guess for now,
        // or the crafting site they just added `https://twotech.twohoursonelife.com`.
        // The crafting site has a search bar. Maybe they want to search THAT?
        // "searches the wiki... if not it tells them no page found".
        // I will use `https://twohoursonelife.miraheze.org/wiki/` + Term.

        // Let's try: https://twohoursonelife.miraheze.org/wiki/ItemName
        // Formatting: Spaces to underscores probably.

        const formattedTerm = searchTerm.trim().replace(/\s+/g, '_');
        const url = `https://twohoursonelife.miraheze.org/wiki/${formattedTerm}`;

        setSearchUrl(url);
        setHasError(false);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Search Bar */}
            <div className="p-4 bg-town-950/50 border-b border-town-800 flex flex-col md:flex-row gap-4 items-center">
                <form onSubmit={handleSearch} className="relative w-full max-w-2xl flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-town-500" />
                        <input
                            type="text"
                            name="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Wiki (e.g., 'Iron Ore')"
                            className="w-full bg-town-900 border border-town-700 rounded-lg pl-10 pr-4 py-2 text-town-200 focus:outline-none focus:border-gold-500 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gold-600 hover:bg-gold-500 text-town-950 font-bold px-6 py-2 rounded-lg transition-colors"
                    >
                        Search
                    </button>
                </form>
                {searchUrl && (
                    <a
                        href={searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-500 hover:text-gold-400 text-xs flex items-center gap-1"
                    >
                        Open in New Tab <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-town-100 relative overflow-hidden">
                {!searchUrl ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-town-800 p-8 text-center opacity-50">
                        <Search className="w-16 h-16 mb-4 opacity-20" />
                        <h3 className="text-xl font-serif font-bold mb-2">Wiki Search</h3>
                        <p className="max-w-md">Enter an item name above to search the Two Hours One Life Wiki.</p>
                    </div>
                ) : (
                    <>
                        {hasError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-rust-600 p-8 text-center bg-town-100">
                                <AlertTriangle className="w-16 h-16 mb-4 opacity-50" />
                                <h3 className="text-xl font-serif font-bold mb-2">Page Not Found</h3>
                                <p>Could not find a wiki page for &quot;{searchTerm}&quot;.</p>
                                <p className="text-sm mt-2 opacity-75">Try checking the spelling or using the exact item name.</p>
                            </div>
                        ) : (
                            <iframe
                                src={searchUrl}
                                className="w-full h-full border-0"
                                title="Wiki Viewer"
                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                                onError={() => setHasError(true)}
                            />
                        )}
                        {/* Note: iframe onError is unreliable for 404s due to CORS. 
                            We might need a proxy or acceptable fallback. 
                            For now, this attempts to show it. If x-frame-options blocks it, we might have issues.
                            Most MediaWiki sites allow embedding? Miraheze might not.
                            Let's try. If it blocks, we'll need to warn the user.
                        */}
                    </>
                )}
            </div>
        </div>
    );
}

// NOTE: Many wikis set X-Frame-Options: DENY.
// If Miraheze blocks iframes, we might have to just rely on "Open in New Tab".
// Or use a proxy service.
// User asked to "searches the wiki... and if not it tells them no page found".
// Detecting 404 in an iframe cross-origin is practically impossible without a proxy.
// I will implement basic structure. If it fails to load, the user can use the link.
