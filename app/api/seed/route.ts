import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS coords (
        id SERIAL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        x INTEGER NOT NULL,
        y INTEGER NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS notices (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'Normal',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'Open',
        claimed_by VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // === Status Panel tables ===

        await sql`
      CREATE TABLE IF NOT EXISTS town_status (
        id SERIAL PRIMARY KEY,
        resource_name VARCHAR(100) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'good',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(100)
      );
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS infrastructure (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        is_operational BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        severity VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'active',
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // === Seed default data (idempotent) ===
        // Resource levels — these rows MUST exist for the Status tab to update them.
        await sql`
      INSERT INTO town_status (resource_name, status, updated_by) VALUES
        ('Food', 'good', 'System'),
        ('Water', 'good', 'System'),
        ('Tools', 'good', 'System'),
        ('Medicine', 'good', 'System')
      ON CONFLICT (resource_name) DO NOTHING;
    `;

        // Key buildings — pre-seeded so they can be toggled by id.
        await sql`
      INSERT INTO infrastructure (name, is_operational) VALUES
        ('Bakery', TRUE),
        ('Smithy', TRUE),
        ('Well', TRUE),
        ('Farm', TRUE),
        ('Nursery', TRUE)
      ON CONFLICT (name) DO NOTHING;
    `;

        // Sample issues — only seeded once, when the table is empty.
        await sql`
      INSERT INTO issues (title, description, severity, status)
      SELECT * FROM (VALUES
        ('Bear attack near farm', 'Multiple bears spotted', 'critical', 'open'),
        ('Low food supplies', 'Need more farmers', 'high', 'in_progress')
      ) AS v(title, description, severity, status)
      WHERE NOT EXISTS (SELECT 1 FROM issues);
    `;

        // Sample projects — only seeded once, when the table is empty.
        await sql`
      INSERT INTO projects (name, description, status, progress)
      SELECT * FROM (VALUES
        ('Build new bakery', 'Expand food production', 'active', 60),
        ('Repair well', 'Fix broken pump', 'active', 90)
      ) AS v(name, description, status, progress)
      WHERE NOT EXISTS (SELECT 1 FROM projects);
    `;

        return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
