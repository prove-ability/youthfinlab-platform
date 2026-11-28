import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/blog-posts";

export function GET() {
  return NextResponse.json(getBlogPosts());
}
