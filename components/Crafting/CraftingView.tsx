'use client';

export default function CraftingView() {
    return (
        <div className="w-full h-full bg-town-950/50 rounded-xl overflow-hidden border border-town-800/60 shadow-inner">
            <iframe
                src="https://twotech.twohoursonelife.com"
                className="w-full h-full border-0"
                title="Two Hours One Life Tech Tree"
                sandbox="allow-scripts allow-same-origin allow-popups"
            />
        </div>
    );
}
