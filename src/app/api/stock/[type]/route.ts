import {
  ExtractJSONObject,
  FetchExternalServerComponentData,
  GetRestockTimes,
} from "@/lib/data";

import { unstable_cache } from "next/cache";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { StockTypes } from "config.gag";

export async function GET(
  _request: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = await params;

  const StockData = StockTypes.find((stock) => stock.stock === type);
  if (!StockData) {
    return NextResponse.json({ error: "Invalid stock type" }, { status: 400 });
  }

  const { nextRestock } = GetRestockTimes(StockData.restockInterval);

  const GetStockData = unstable_cache(
    async (key) => {
      const data = (await FetchExternalServerComponentData(
        "https://growagarden.gg/stocks",
        "14g5d",
        (data: string) => {
          const stockData = ExtractJSONObject(data, "stockDataSSR");
          return stockData;
        }
      )) as Record<string, unknown>;

      return data[key];
    },
    [`StockData${type}`],
    {
      revalidate: (nextRestock.getTime() - Date.now()) / 1000,
    }
  );

  const CachedStockData = await GetStockData(`${type}Stock`);
  return NextResponse.json(CachedStockData);
}
