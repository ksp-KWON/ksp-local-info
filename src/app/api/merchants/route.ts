import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '300';

  const API_KEY = process.env.GG_DATA_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://openapi.gg.go.kr/RegionMnyFacltStus?KEY=${API_KEY}&Type=json&pIndex=${page}&pSize=${size}&SIGUN_NM=의정부시`,
      { next: { revalidate: 3600 } }
    );

    const data = await response.json();

    if (data.RegionMnyFacltStus && data.RegionMnyFacltStus[1] && data.RegionMnyFacltStus[1].row) {
      const rows = data.RegionMnyFacltStus[1].row;
      // Map rows to a cleaner format
      const merchants = rows
        .filter((row: any) => row.REFINE_WGS84_LAT && row.REFINE_WGS84_LOGT)
        .map((row: any, index: number) => ({
          id: `${page}-${index}`,
          name: row.CMPNM_NM,
          category: row.INDUTYPE_NM,
          lat: Number(row.REFINE_WGS84_LAT),
          lng: Number(row.REFINE_WGS84_LOGT),
          address: row.REFINE_ROADNM_ADDR || row.REFINE_LOTNO_ADDR,
        }));
      return NextResponse.json(merchants);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Failed to fetch merchants:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
