import { getTasks } from '@/app/actions';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

export default async function TaskView() {
    const tasks = await getTasks();

    return (
        <div>
            <TaskForm />
            <div className="flex items-center justify-between mb-3 text-sm text-zinc-400 px-1">
                <span>Active Projects</span>
                <span>{tasks.length} total</span>
            </div>
            <TaskList tasks={tasks} />
        </div>
    );
}
