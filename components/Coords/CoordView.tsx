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
                {/* Form & List — below the map on mobile, left column on desktop */}
                <div className="order-2 lg:order-1 space-y-6 overflow-y-auto pr-2 pb-24">
                    <CoordForm />
                    <CoordList coords={coords} />
                </div>

                {/* Interactive Map — top on mobile, sticky right column on desktop */}
                <div className="order-1 lg:order-2 lg:sticky lg:top-0">
                    <CoordMap coords={coords} />
                </div>
            </div>
        </div>
    );
}
