import { NextResponse } from "next/server";

export const revalidate = 60;

interface NotionFile {
  type: string;
  file?: { url: string };
  external?: { url: string };
}

interface NotionProperty {
  type: string;
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
  date?: { start: string } | null;
  files?: NotionFile[];
  select?: { name: string } | null;
  url?: string | null;
  number?: number | null;
}

interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
}

function getPropertyValue(prop: NotionProperty | undefined): string {
  if (!prop) return "";
  switch (prop.type) {
    case "title":
      return prop.title?.map((t) => t.plain_text).join("") ?? "";
    case "rich_text":
      return prop.rich_text?.map((t) => t.plain_text).join("") ?? "";
    case "date":
      return prop.date?.start ?? "";
    case "select":
      return prop.select?.name ?? "";
    case "url":
      return prop.url ?? "";
    case "files": {
      const f = prop.files?.[0];
      if (!f) return "";
      if (f.type === "file") return f.file?.url ?? "";
      if (f.type === "external") return f.external?.url ?? "";
      return "";
    }
    default:
      return "";
  }
}

export async function GET() {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    return NextResponse.json(
      { error: "Missing NOTION_TOKEN or NOTION_DATABASE_ID" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page_size: 100 }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err.message || "Notion API error" },
        { status: res.status }
      );
    }

    const data = await res.json();

    const posts = (data.results as NotionPage[]).map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        name: getPropertyValue(props["Name"]),
        caption: getPropertyValue(props["Caption"]),
        date: getPropertyValue(props["Date"]),
        image: getPropertyValue(props["Image"]),
        type: getPropertyValue(props["Type"]),
        order: props["Order"]?.number ?? null,
      };
    });

    // Sort: Order field (ascending) first, then by date (descending) for unordered posts
    posts.sort((a, b) => {
      if (a.order !== null && b.order !== null) return a.order - b.order;
      if (a.order !== null) return -1;
      if (b.order !== null) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json({
      posts,
      profile: {
        name: process.env.PROFILE_NAME ?? "instagram_user",
        image: process.env.PROFILE_IMAGE_URL ?? "",
        bio: process.env.PROFILE_BIO ?? "",
        postsCount: posts.length,
        followers: process.env.PROFILE_FOLLOWERS ?? "—",
        following: process.env.PROFILE_FOLLOWING ?? "—",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
