import { Client } from "@notionhq/client";
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

  const notion = new Client({ auth: token });

  let updates: ReorderUpdate[];
  try {
    const body = await req.json();
    updates = body.updates;
    if (!Array.isArray(updates)) throw new Error("Invalid payload");
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Auto-create the "Order" Number property in the database if it doesn't exist yet
  try {
    const db = await notion.databases.retrieve({ database_id: databaseId });
    if (!("Order" in db.properties)) {
      await notion.databases.update({
        database_id: databaseId,
        properties: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Order: { type: "number", number: { format: "number" } } as any,
        },
      });
    }
  } catch {
    // Non-fatal — proceed and let the update attempt fail if needed
  }

  // Update each page's Order value in parallel
  try {
    await Promise.all(
      updates.map(({ id, order }) =>
        notion.pages.update({
          page_id: id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          properties: { Order: { number: order } } as any,
        })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
