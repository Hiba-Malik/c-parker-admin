import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Announcement, UpdateAnnouncementDTO } from '@/types/announcement';

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

// PATCH - Update announcement
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body: UpdateAnnouncementDTO = await request.json();
    
    const announcements = readAnnouncements();
    const index = announcements.findIndex((a) => a.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    announcements[index] = {
      ...announcements[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    writeAnnouncements(announcements);
    return NextResponse.json(announcements[index]);
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to update announcement' },
      { status: 500 }
    );
  }
}

// DELETE - Delete announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const announcements = readAnnouncements();
    const filteredAnnouncements = announcements.filter((a) => a.id !== id);
    
    if (announcements.length === filteredAnnouncements.length) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      );
    }

    writeAnnouncements(filteredAnnouncements);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}



