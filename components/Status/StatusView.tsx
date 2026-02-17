'use client';

import { TownStatus, Infrastructure, Issue, Project } from '@/types';
import ResourceIndicators from './ResourceIndicators';
import InfrastructurePanel from './InfrastructurePanel';
import IssuesPanel from './IssuesPanel';
import ProjectsPanel from './ProjectsPanel';

interface StatusViewProps {
    townStatus: TownStatus[];
    infrastructure: Infrastructure[];
    issues: Issue[];
    projects: Project[];
}

export default function StatusView({ townStatus, infrastructure, issues, projects }: StatusViewProps) {
    return (
        <div className="space-y-6">
            <ResourceIndicators statuses={townStatus} />
            <InfrastructurePanel infrastructure={infrastructure} />
            <IssuesPanel issues={issues} />
            <ProjectsPanel projects={projects} />
        </div>
    );
}
