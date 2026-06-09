import { getDonors } from '@/app/actions';
import WallOfFameBoard from './WallOfFameBoard';

export default async function WallOfFameView() {
    const donors = await getDonors();
    return <WallOfFameBoard donors={donors} />;
}
