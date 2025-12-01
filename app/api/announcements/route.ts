import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Announcement, CreateAnnouncementDTO } from '@/types/announcement';

const DATA_DIR = join(process.cwd(), 'data');
const DATA_FILE = join(DATA_DIR, 'announcements.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    const fs = require('fs');
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read announcements from file
function readAnnouncements(): Announcement[] {
  ensureDataDir();
  if (!existsSync(DATA_FILE)) {
    return [];
  }
  const data = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write announcements to file
function writeAnnouncements(announcements: Announcement[]) {
  ensureDataDir();
  writeFileSync(DATA_FILE, JSON.stringify(announcements, null, 2));
}

// GET - Fetch all announcements
export async function GET() {
  try {
    const announcements = readAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

// POST - Create new announcement
export async function POST(request: NextRequest) {
  try {
    const body: CreateAnnouncementDTO = await request.json();
    
    if (!body.title || !body.body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    const announcements = readAnnouncements();
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: body.title,
      body: body.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isHidden: false,
    };

    announcements.push(newAnnouncement);
    writeAnnouncements(announcements);

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}



