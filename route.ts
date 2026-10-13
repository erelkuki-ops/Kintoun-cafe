import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", svg: "image/svg+xml" };

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const safe = path.basename(filename);
  if (safe !== filename || !/\.(jpe?g|png|webp|svg)$/i.test(safe)) {
    return NextResponse.json({ error: "File tidak valid" }, { status: 400 });
  }
  const filePath = path.join(process.cwd(), "public", "uploads", safe);
  try {
    const buffer = await fs.readFile(filePath);
    const ext = safe.split(".").pop()?.toLowerCase() || "jpg";
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Foto tidak ditemukan" }, { status: 404 });
  }
}
