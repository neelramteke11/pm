import { NextResponse } from "next/server"

export async function POST() {
  // In a real app, you'd clear server-side sessions/cookies here
  return NextResponse.json({ success: true })
}
