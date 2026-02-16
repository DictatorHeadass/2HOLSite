import { getCoords } from '@/app/actions';
import CoordForm from './CoordForm';
import CoordList from './CoordList';

export default async function CoordView() {
    const coords = await getCoords();

    return (
        <div>
            <CoordForm />
            <div className="flex items-center justify-between mb-3 text-sm text-zinc-400 px-1">
                <span>Recent Locations</span>
                <span>{coords.length} found</span>
            </div>
            <CoordList coords={coords} />
        </div>
    );
}
