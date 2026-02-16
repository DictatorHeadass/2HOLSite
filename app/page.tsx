import MainLayout from "@/components/MainLayout";
import CoordView from "@/components/Coords/CoordView";
import NoticeView from "@/components/Notices/NoticeView";
import TaskView from "@/components/Tasks/TaskView";
import StatusView from "@/components/Status/StatusView";
import { getTownStatus, getInfrastructure, getIssues, getProjects } from "@/app/actions";

export default async function Home() {
  const [townStatus, infrastructure, issues, projects] = await Promise.all([
    getTownStatus(),
    getInfrastructure(),
    getIssues(),
    getProjects()
  ]);

  return (
    <MainLayout
      coordView={<CoordView />}
      noticeView={<NoticeView />}
      taskView={<TaskView />}
      statusView={<StatusView townStatus={townStatus} infrastructure={infrastructure} issues={issues} projects={projects} />}
    />
  );
}
