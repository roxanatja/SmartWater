import smartwaterApi from "@/lib/SmartWaterApi";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const response = await smartwaterApi.get("/zones?pageSize=3000");
    const data = response.data;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching zones" },
      { status: 500 }
    );
  }
}

export async function HEAD(request: Request) {
  try {
    const response = await smartwaterApi.head("/zones?pageSize=3000");
    const headers = Object.fromEntries(
      Object.entries(response.headers).map(([key, value]) => [
        key,
        value.toString(),
      ])
    );

    return NextResponse.json({}, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching zones" },
      { status: 500 }
    );
  }
}
