// Core Types
export interface Coord {
    id: number;
    type: string;
    x: number;
    y: number;
    notes?: string;
    status: 'Active' | 'Depleted' | 'Dangerous';
    created_at: string;
}

export interface Notice {
    id: number;
    message: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    created_at: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'Open' | 'Claimed' | 'Completed';
    claimed_by?: string;
    created_at: string;
}

// Admin Status Panel Types
export interface TownStatus {
    id: number;
    resource_name: string;
    status: 'crisis' | 'low' | 'good' | 'abundant';
    updated_at: string;
    updated_by?: string;
}

export interface Infrastructure {
    id: number;
    name: string;
    is_operational: boolean;
    updated_at: string;
}

export interface Issue {
    id: number;
    title: string;
    description?: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'in_progress' | 'resolved';
    created_at: string;
}

export interface Project {
    id: number;
    name: string;
    description?: string;
    status: 'active' | 'completed' | 'paused';
    progress: number; // 0-100
    created_at: string;
}
