'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Donor } from '@/types';
import { DONATION_TIERS, getDonationTier, DonationTier } from '@/lib/constants';
import { useAuth } from '@/lib/AuthContext';
import { addManualDonation, updateHonoredBuilding, deleteDonor } from '@/app/actions';
import { cn } from '@/lib/utils';
import {
    Trophy, Crown, Gem, Award, Medal, Plus, Trash2, Save, Building2,
    Loader2, X, Coins, Pencil,
} from 'lucide-react';

const TIER_ICONS = { diamond: Gem, gold: Crown, silver: Award, bronze: Medal } as const;

interface WallOfFameBoardProps {
    donors: Donor[];
}

export default function WallOfFameBoard({ donors }: WallOfFameBoardProps) {
    const { isEve } = useAuth();
    const router = useRouter();
    const [showAdd, setShowAdd] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const totalCoins = donors.reduce((sum, d) => sum + d.total_coins, 0);

    async function handleAdd(formData: FormData) {
        setSubmitting(true);
        await addManualDonation(formData);
        setSubmitting(false);
        setShowAdd(false);
        router.refresh();
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-b from-gold-500/10 to-town-900/40 p-6 mb-6 text-center">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
                <Trophy className="w-10 h-10 text-gold-400 mx-auto mb-2 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
                <h2 className="text-2xl font-serif font-bold text-town-100 tracking-wide">Wall of Fame</h2>
                <p className="text-sm text-town-400 mt-1">Honoring those who built this town with their generosity</p>
                <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                    <span className="flex items-center gap-1.5 text-gold-300 font-semibold">
                        <Coins className="w-4 h-4" /> {totalCoins.toLocaleString()} coins
                    </span>
                    <span className="text-town-500">{donors.length} patron{donors.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Admin: manual add / top-up */}
            {isEve && (
                <div className="mb-6">
                    {!showAdd ? (
                        <button
                            onClick={() => setShowAdd(true)}
                            className="w-full bg-town-900/50 hover:bg-town-800/50 border-2 border-dashed border-town-800/60 text-town-400 p-3 rounded-xl flex items-center justify-center gap-2 transition-all font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" /> Add / Top-up Donor
                        </button>
                    ) : (
                        <form action={handleAdd} className="bg-town-900/40 backdrop-blur-sm p-4 rounded-xl border border-town-800 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-town-100 font-serif font-semibold flex items-center gap-2">
                                    <Coins className="w-4 h-4 text-gold-500" /> Record Donation
                                </h3>
                                <button type="button" onClick={() => setShowAdd(false)} className="text-town-500 hover:text-town-300">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-1">
                                    <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-1.5 font-bold">Handle</label>
                                    <input name="handle" required placeholder="@username" className="w-full bg-town-950/50 border border-town-800 rounded-lg px-3 py-2.5 text-sm text-town-200 focus:outline-none focus:ring-1 focus:ring-gold-500/50 placeholder:text-town-700" />
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-1.5 font-bold">Display Name</label>
                                    <input name="username" placeholder="optional" className="w-full bg-town-950/50 border border-town-800 rounded-lg px-3 py-2.5 text-sm text-town-200 focus:outline-none focus:ring-1 focus:ring-gold-500/50 placeholder:text-town-700" />
                                </div>
                                <div className="sm:col-span-1">
                                    <label className="block text-[10px] uppercase tracking-wider text-town-500 mb-1.5 font-bold">Coins to add</label>
                                    <input name="coins" type="number" min="1" required placeholder="100" className="w-full bg-town-950/50 border border-town-800 rounded-lg px-3 py-2.5 text-sm text-town-200 focus:outline-none focus:ring-1 focus:ring-gold-500/50 placeholder:text-town-700" />
                                </div>
                            </div>
                            <button type="submit" disabled={submitting} className="w-full mt-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:brightness-110 text-white font-bold py-2.5 rounded-lg shadow-md transition-all flex justify-center items-center">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to Wall'}
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* Empty state */}
            {donors.length === 0 ? (
                <div className="text-center text-town-600 py-16 flex flex-col items-center">
                    <div className="w-16 h-16 bg-town-900/50 rounded-full flex items-center justify-center mb-3">
                        <Trophy className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">No donors yet</p>
                    <p className="text-xs mt-1 text-town-700">Gifts from your TikTok Live will appear here automatically.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {DONATION_TIERS.map((tier) => {
                        const tierDonors = donors.filter((d) => getDonationTier(d.total_coins).key === tier.key);
                        if (tierDonors.length === 0) return null;
                        return (
                            <TierSection key={tier.key} tier={tier} donors={tierDonors} isEve={isEve} />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function TierSection({ tier, donors, isEve }: { tier: DonationTier; donors: Donor[]; isEve: boolean }) {
    const Icon = TIER_ICONS[tier.key];
    return (
        <section>
            <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5" style={{ color: tier.color }} />
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: tier.color }}>
                        {tier.name}
                    </h3>
                    <p className="text-[11px] text-town-500">{tier.blurb}</p>
                </div>
                <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(to right, ${tier.color}40, transparent)` }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {donors.map((donor) => (
                    <DonorCard key={donor.id} donor={donor} tier={tier} isEve={isEve} />
                ))}
            </div>
        </section>
    );
}

function DonorCard({ donor, tier, isEve }: { donor: Donor; tier: DonationTier; isEve: boolean }) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [building, setBuilding] = useState(donor.honored_building ?? '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await updateHonoredBuilding(donor.id, building);
        setSaving(false);
        setEditing(false);
        router.refresh();
    };

    const handleDelete = async () => {
        if (!confirm(`Remove @${donor.handle} from the Wall of Fame?`)) return;
        await deleteDonor(donor.id);
        router.refresh();
    };

    return (
        <div
            className="relative group rounded-xl border bg-town-900/40 backdrop-blur-sm p-4 transition-all hover:scale-[1.01]"
            style={{ borderColor: `${tier.color}40`, boxShadow: `0 0 18px -8px ${tier.glow}` }}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-town-100 truncate">
                        {donor.username || donor.handle}
                    </p>
                    <p className="text-xs text-town-500 truncate">@{donor.handle}</p>
                </div>
                <div className="text-right shrink-0">
                    <span className="text-base font-bold" style={{ color: tier.color }}>
                        {donor.total_coins.toLocaleString()}
                    </span>
                    <p className="text-[10px] uppercase tracking-wider text-town-600">coins</p>
                </div>
            </div>

            {/* Honored building */}
            {editing ? (
                <div className="mt-3 flex items-center gap-2">
                    <input
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        placeholder="Building in their honor…"
                        className="flex-1 bg-town-950/50 border border-town-800 rounded-lg px-2.5 py-1.5 text-xs text-town-200 focus:outline-none focus:ring-1 focus:ring-gold-500/50 placeholder:text-town-700"
                    />
                    <button onClick={handleSave} disabled={saving} className="p-1.5 bg-gold-600 hover:bg-gold-500 rounded text-white">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => { setEditing(false); setBuilding(donor.honored_building ?? ''); }} className="p-1.5 text-town-500 hover:text-town-300">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ) : donor.honored_building ? (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-town-300 italic">
                    <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: tier.color }} />
                    <span className="truncate">{donor.honored_building}</span>
                    {isEve && (
                        <button onClick={() => setEditing(true)} className="ml-auto text-town-600 hover:text-town-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="w-3 h-3" />
                        </button>
                    )}
                </div>
            ) : isEve ? (
                <button
                    onClick={() => setEditing(true)}
                    className="mt-3 flex items-center gap-1.5 text-[11px] text-town-600 hover:text-town-400 transition-colors"
                >
                    <Building2 className="w-3.5 h-3.5" /> Add honored building
                </button>
            ) : null}

            {/* Admin delete — floating corner badge so it never overlaps the coin count */}
            {isEve && (
                <button
                    onClick={handleDelete}
                    title="Remove donor"
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-town-950 border border-town-800 text-town-500 hover:text-rust-400 hover:border-rust-500/50 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
