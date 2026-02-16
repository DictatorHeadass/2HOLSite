'use server';

import { sql } from '@vercel/postgres';
import { Coordinate, Notice, Task, TownStatus, Infrastructure, Issue, Project, ResourceStatus } from '@/types';
import { revalidatePath } from 'next/cache';

// --- MOCK DATA ---
const MOCK_COORDS: Coordinate[] = [
    { id: 1, type: 'Iron Vein', x: 120, y: -45, notes: 'Rich vein, protected by bears', status: 'Active', created_at: new Date().toISOString() },
    { id: 2, type: 'Natural Spring', x: 15, y: 30, status: 'Active', created_at: new Date().toISOString() },
];

const MOCK_NOTICES: Notice[] = [
    { id: 1, message: 'Welcome to the 2HOL Town Hall! (Mock Mode)', priority: 'High', created_at: new Date().toISOString() },
];

const MOCK_TASKS: Task[] = [
    { id: 1, title: 'Setup Database', description: 'Connect Vercel Postgres to see real data.', status: 'Open', created_at: new Date().toISOString() },
];

const MOCK_STATUS: TownStatus[] = [
    { id: 1, resource_name: 'Food', status: 'low', updated_at: new Date().toISOString(), updated_by: 'Eve' },
    { id: 2, resource_name: 'Water', status: 'good', updated_at: new Date().toISOString(), updated_by: 'Eve' },
    { id: 3, resource_name: 'Tools', status: 'crisis', updated_at: new Date().toISOString(), updated_by: 'Eve' },
    { id: 4, resource_name: 'Medicine', status: 'abundant', updated_at: new Date().toISOString(), updated_by: 'Eve' },
];

const MOCK_INFRASTRUCTURE: Infrastructure[] = [
    { id: 1, name: 'Bakery', is_operational: true, updated_at: new Date().toISOString() },
    { id: 2, name: 'Smithy', is_operational: true, updated_at: new Date().toISOString() },
    { id: 3, name: 'Well', is_operational: false, updated_at: new Date().toISOString() },
    { id: 4, name: 'Farm', is_operational: true, updated_at: new Date().toISOString() },
    { id: 5, name: 'Nursery', is_operational: false, updated_at: new Date().toISOString() },
];

const MOCK_ISSUES: Issue[] = [
    { id: 1, title: 'Bear attack near farm', description: 'Multiple bears spotted', severity: 'critical', status: 'open', created_at: new Date().toISOString() },
    { id: 2, title: 'Low food supplies', description: 'Need more farmers', severity: 'high', status: 'in_progress', created_at: new Date().toISOString() },
    { id: 3, title: 'Need more baskets', severity: 'medium', status: 'open', created_at: new Date().toISOString() },
];

const MOCK_PROJECTS: Project[] = [
    { id: 1, name: 'Build new bakery', description: 'Expand food production', status: 'active', progress: 60, created_at: new Date().toISOString() },
    { id: 2, name: 'Expand farm', description: 'Add more soil rows', status: 'active', progress: 30, created_at: new Date().toISOString() },
    { id: 3, name: 'Repair well', description: 'Fix broken pump', status: 'active', progress: 90, created_at: new Date().toISOString() },
];


// --- COORDS ---

export async function getCoords(): Promise<Coordinate[]> {
    if (!process.env.POSTGRES_URL) return MOCK_COORDS;

    try {
        const { rows } = await sql<Coordinate>`SELECT * FROM coords ORDER BY created_at DESC LIMIT 100`;
        return rows;
    } catch (error) {
        console.error('Failed to fetch coords:', error);
        return [];
    }
}

export async function addCoord(formData: FormData) {
    if (!process.env.POSTGRES_URL) {
        console.log('Mock addCoord called');
        return { success: true };
    }

    const type = formData.get('type') as string;
    const x = Number(formData.get('x'));
    const y = Number(formData.get('y'));
    const notes = formData.get('notes') as string;
    const status = formData.get('status') as string || 'Active';

    try {
        await sql`
      INSERT INTO coords (type, x, y, notes, status)
      VALUES (${type}, ${x}, ${y}, ${notes}, ${status})
    `;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to add coord:', error);
        return { success: false, error };
    }
}

export async function deleteCoord(id: number) {
    if (!process.env.POSTGRES_URL) return { success: true };

    try {
        await sql`DELETE FROM coords WHERE id = ${id}`;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

// --- NOTICES ---

export async function getNotices(): Promise<Notice[]> {
    if (!process.env.POSTGRES_URL) return MOCK_NOTICES;

    try {
        const { rows } = await sql<Notice>`SELECT * FROM notices ORDER BY created_at DESC LIMIT 50`;
        return rows;
    } catch (error) {
        return [];
    }
}

export async function addNotice(formData: FormData) {
    if (!process.env.POSTGRES_URL) return { success: true };

    const message = formData.get('message') as string;
    const priority = formData.get('priority') as string;

    try {
        await sql`INSERT INTO notices (message, priority) VALUES (${message}, ${priority})`;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function deleteNotice(id: number) {
    if (!process.env.POSTGRES_URL) return { success: true };

    try {
        await sql`DELETE FROM notices WHERE id = ${id}`;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

// --- TASKS ---

export async function getTasks(): Promise<Task[]> {
    if (!process.env.POSTGRES_URL) return MOCK_TASKS;

    try {
        const { rows } = await sql<Task>`SELECT * FROM tasks ORDER BY status = 'Open' DESC, created_at DESC LIMIT 50`;
        return rows;
    } catch (error) {
        return [];
    }
}

export async function addTask(formData: FormData) {
    if (!process.env.POSTGRES_URL) return { success: true };

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    try {
        await sql`INSERT INTO tasks (title, description) VALUES (${title}, ${description})`;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function updateTaskStatus(id: number, status: string, claimedBy?: string) {
    if (!process.env.POSTGRES_URL) return { success: true };

    try {
        if (claimedBy) {
            await sql`UPDATE tasks SET status = ${status}, claimed_by = ${claimedBy} WHERE id = ${id}`;
        } else {
            await sql`UPDATE tasks SET status = ${status} WHERE id = ${id}`;
        }
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

// --- STATUS PANEL ---

export async function getTownStatus(): Promise<TownStatus[]> {
    if (!process.env.POSTGRES_URL) return MOCK_STATUS;

    try {
        const { rows } = await sql<TownStatus>`SELECT * FROM town_status ORDER BY resource_name`;
        return rows;
    } catch (error) {
        console.error('Failed to fetch town status:', error);
        return [];
    }
}

export async function updateResourceStatus(resourceName: string, newStatus: ResourceStatus) {
    if (!process.env.POSTGRES_URL) {
        console.log('Mock updateResourceStatus called');
        return { success: true };
    }

    try {
        await sql`
            UPDATE town_status 
            SET status = ${newStatus}, updated_at = NOW() 
            WHERE resource_name = ${resourceName}
        `;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function getInfrastructure(): Promise<Infrastructure[]> {
    if (!process.env.POSTGRES_URL) return MOCK_INFRASTRUCTURE;

    try {
        const { rows } = await sql<Infrastructure>`SELECT * FROM infrastructure ORDER BY name`;
        return rows;
    } catch (error) {
        console.error('Failed to fetch infrastructure:', error);
        return [];
    }
}

export async function toggleInfrastructure(id: number, isOperational: boolean) {
    if (!process.env.POSTGRES_URL) {
        console.log('Mock toggleInfrastructure called');
        return { success: true };
    }

    try {
        await sql`
            UPDATE infrastructure 
            SET is_operational = ${isOperational}, updated_at = NOW() 
            WHERE id = ${id}
        `;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function getIssues(): Promise<Issue[]> {
    if (!process.env.POSTGRES_URL) return MOCK_ISSUES;

    try {
        const { rows } = await sql<Issue>`SELECT * FROM issues ORDER BY 
            CASE severity 
                WHEN 'critical' THEN 1 
                WHEN 'high' THEN 2 
                WHEN 'medium' THEN 3 
                WHEN 'low' THEN 4 
            END, created_at DESC`;
        return rows;
    } catch (error) {
        console.error('Failed to fetch issues:', error);
        return [];
    }
}

export async function updateIssueStatus(id: number, status: string) {
    if (!process.env.POSTGRES_URL) {
        console.log('Mock updateIssueStatus called');
        return { success: true };
    }

    try {
        await sql`UPDATE issues SET status = ${status} WHERE id = ${id}`;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function deleteIssue(id: number) {
    if (!process.env.POSTGRES_URL) {
        console.log('Mock deleteIssue called');
        return { success: true };
    }

    try {
        await sql`DELETE FROM issues WHERE id = ${id}`;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function getProjects(): Promise<Project[]> {
    if (!process.env.POSTGRES_URL) return MOCK_PROJECTS;

    try {
        const { rows } = await sql<Project>`SELECT * FROM projects ORDER BY created_at DESC`;
        return rows;
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
    }
}

export async function updateProjectProgress(id: number, progress: number) {
    if (!process.env.POSTGRES_URL) {
        console.log('Mock updateProjectProgress called');
        return { success: true };
    }

    try {
        await sql`UPDATE projects SET progress = ${progress} WHERE id = ${id}`;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}
