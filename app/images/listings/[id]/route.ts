import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuidPattern.test(id)) return new NextResponse(null, { status: 404 });

  const supabase = await createClient();
  const { data: image } = await supabase
    .from("listing_images")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (!image) return new NextResponse(null, { status: 404 });

  const { data: file, error } = await supabase.storage
    .from("listing-images")
    .download(image.storage_path);
  if (error || !file) return new NextResponse(null, { status: 404 });

  return new NextResponse(file, {
    headers: {
      "Content-Type": file.type || "image/webp",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
