export type POIType =
    | 'Iron Vein' | 'Tarry Spot' | 'Oil Rig' | 'Natural Spring' | 'Pond' | 'Clay Deposit'
    | 'Wild Gooseberry Bush' | 'Wild Carrot' | 'Burdock' | 'Wild Grape' | 'Banana Tree'
    | 'Wild Mango Tree' | 'Barrel Cactus' | 'Coconut Tree' | 'Wild Potato' | 'Wild Cabbage'
    | 'Rabbit' | 'Mouflon' | 'Bison' | 'Wild Sheep' | 'Wild Turkey' | 'Snake' | 'Wolf' | 'Bear' | 'Polar Bear'
    | 'Bell Tower' | 'Newcomen Pump' | 'Diesel Water Pump' | 'Fractional Distiller' | 'Deep Well' | 'Sheep Pen' | 'Smithy/Forge'
    | 'Other';

export interface Coordinate {
    id: number;
    type: POIType;
    x: number;
    y: number;
    notes?: string;
    status: 'Active' | 'Depleted' | 'Road Built' | 'Needs Engine';
    created_at: string;
}

export type NoticePriority = 'Low' | 'Normal' | 'High' | 'Critical';

export interface Notice {
    id: number;
    message: string;
    priority: NoticePriority;
    created_at: string;
}

export type TaskStatus = 'Open' | 'Claimed' | 'Completed';

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    claimed_by?: string;
    created_at: string;
}

// Admin Status Panel Types
export type ResourceStatus = 'crisis' | 'low' | 'good' | 'abundant';

export interface TownStatus {
    id: number;
    resource_name: string;
    status: ResourceStatus;
    updated_at: string;
    updated_by?: string;
}

export interface Infrastructure {
    id: number;
    name: string;
    is_operational: boolean;
    updated_at: string;
}

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface Issue {
    id: number;
    title: string;
    description?: string;
    severity: IssueSeverity;
    status: IssueStatus;
    created_at: string;
}

export type ProjectStatus = 'active' | 'completed' | 'paused';

export interface Project {
    id: number;
    name: string;
    description?: string;
    status: ProjectStatus;
    progress: number; // 0-100
    created_at: string;
}
