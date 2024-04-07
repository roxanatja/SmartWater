import { NextResponse } from 'next/server';
import { GetZone } from '@/lib/services/ZonesService';

export async function GET() {
  try {
    const zones = await GetZone();
    return NextResponse.json(zones.data);
  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}