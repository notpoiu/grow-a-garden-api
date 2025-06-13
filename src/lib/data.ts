// Data Fetching
function GenerateRouterRefetchTree(
  pathname: string,
  query?: Record<string, string | string[]>
) {
  return JSON.stringify([
    "",
    {
      children: [
        pathname.replace(/^\//, ""),
        { children: ["__PAGE__", query ?? {}, pathname, "refresh"] },
      ],
    },
    null,
    "refetch",
  ]);
}

export async function FetchExternalServerComponentData(
  base_url: string,
  component_id: string,
  matcher: (data: string) => unknown
) {
  const NextRouterStateTree = GenerateRouterRefetchTree(
    new URL(base_url).pathname
  );

  const response = await fetch(`${base_url}?rsc=${component_id}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      RSC: "1",
      "Next-Router-State-Tree": encodeURIComponent(NextRouterStateTree),
    },
    cache: "no-store",
  });

  console.log(
    "[FetchExternalServerComponentData] Fetching data from:",
    base_url,
    "with component ID:",
    component_id
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${base_url}`);
  }

  const data = await response.text();

  const parsedData = matcher(data);

  if (!parsedData) {
    throw new Error(`Failed to parse data from ${base_url}`);
  }

  return parsedData;
}

// Parsing Utilities
export function ExtractJSONObject(str: string, key: string): unknown {
  const keyIndex = str.indexOf(`"${key}":`);
  if (keyIndex === -1) throw new Error(`Key "${key}" not found in data`);

  const start = str.indexOf("{", keyIndex);
  if (start === -1) throw new Error(`No opening { found for key "${key}"`);

  let bracketCount = 0;
  let end = start;

  for (; end < str.length; end++) {
    if (str[end] === "{") bracketCount++;
    if (str[end] === "}") bracketCount--;
    if (bracketCount === 0) break;
  }

  if (bracketCount !== 0)
    throw new Error(`Brackets do not match for key "${key}"`);

  const jsonStr = str.slice(start, end + 1);

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON for key "${key}": ${(error as Error).message}`
    );
  }
}

// Date Utilities
export function GetRestockTimes(interval: number) {
  const now = Date.now();

  const nextRestock = new Date(Math.ceil(now / interval) * interval);

  const lastRestock = new Date(Math.floor(now / interval) * interval);

  return {
    lastRestock,
    nextRestock,
  };
}
