import { getNotices } from '@/app/actions';
import NoticeForm from './NoticeForm';
import NoticeList from './NoticeList';

export default async function NoticeView() {
    const notices = await getNotices();

    return (
        <div>
            <NoticeForm />
            <div className="flex items-center justify-between mb-3 text-sm text-zinc-400 px-1">
                <span>Town Feed</span>
                <span>{notices.length} active</span>
            </div>
            <NoticeList notices={notices} />
        </div>
    );
}
