import { getCoords } from '@/app/actions';
import CoordForm from './CoordForm';
import CoordList from './CoordList';
import CoordMap from './CoordMap';

export default async function CoordView() {
    const coords = await getCoords();

    return (
        <div className="space-y-6 h-full">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-town-100 flex items-center gap-2">
                    <span className="text-gold-500">❖</span> Coordinates
                </h2>
                <div className="text-xs font-mono text-town-500">
                    {coords.length} locations logged
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left Column: Form & List */}
                <div className="space-y-6 overflow-y-auto pr-2 pb-24">
                    <CoordForm />
                    <CoordList coords={coords} />
                </div>

                {/* Right Column: Map (Desktop Only) */}
                <div className="hidden lg:block sticky top-0">
                    <CoordMap coords={coords} />
                </div>
            </div>
        </div>
    );
}
