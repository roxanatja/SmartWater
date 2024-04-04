import { NextResponse } from "next/server";
import smartwaterApi from "@/lib/SmartWaterApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const response = await smartwaterApi.get(`/clients/${id}`);
      const data = response.data;
      return NextResponse.json(data);
    } else {
      const response = await smartwaterApi.get("/clients?pageSize=3000");
      const data = response.data;
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await request.json();
    const response = await smartwaterApi.post("/clients/register", client);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Client ID is required" },
      { status: 400 }
    );
  }

  try {
    const client = await request.json();
    const response = await smartwaterApi.put(`/clients/${id}`, client);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Client ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await smartwaterApi.delete(`/clients/${id}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
