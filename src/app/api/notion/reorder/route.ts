import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ReorderUpdate {
  id: string;
  order: number;
}

export async function POST(req: Request) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  let updates: ReorderUpdate[];
  try {
    const body = await req.json();
    updates = body.updates;
    if (!Array.isArray(updates)) throw new Error("Invalid payload");
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };

  // Auto-create the "Order" Number property in the database if it doesn't exist yet
  try {
    const dbRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, { headers });
    if (dbRes.ok) {
      const db = await dbRes.json();
      if (!db.properties?.["Order"]) {
        await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            properties: { Order: { number: { format: "number" } } },
          }),
        });
      }
    }
  } catch {
    // Non-fatal — proceed and let the page updates fail if needed
  }

  // Update each page's Order value in parallel
  try {
    await Promise.all(
      updates.map(({ id, order }) =>
        fetch(`https://api.notion.com/v1/pages/${id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ properties: { Order: { number: order } } }),
        })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
