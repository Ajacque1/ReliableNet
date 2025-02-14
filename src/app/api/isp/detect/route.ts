import { NextResponse } from "next/server"

interface IPAPIResponse {
  ip: string;
  isp: string;
  org: string;
  asn: string;
  city: string;
  region: string;
  country: string;
}

export async function GET() {
  try {
    // Use ip-api.com for ISP detection (free tier, rate limited)
    const response = await fetch('http://ip-api.com/json?fields=66842623');
    const data: IPAPIResponse = await response.json();

    return NextResponse.json({
      isp: data.isp,
      org: data.org,
      asn: data.asn,
      location: {
        city: data.city,
        region: data.region,
        country: data.country
      }
    });
  } catch (error) {
    console.error('Failed to detect ISP:', error);
    return NextResponse.json(
      { error: 'Failed to detect ISP' },
      { status: 500 }
    );
  }
} 