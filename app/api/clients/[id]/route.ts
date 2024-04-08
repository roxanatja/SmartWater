import { NextResponse } from 'next/server';
import { GetClientById, updateClient, DeleteClient } from '@/lib/services/ClientsService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await GetClientById(params.id);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error getting client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await request.json();
    const response = await updateClient(params.id, client);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const response = await DeleteClient(params.id);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}