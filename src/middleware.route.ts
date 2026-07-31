import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "~/env";

const alwaysAllowedPaths = /((api|_next\/static|_next\/image|favicon\.ico).*)/;

export function middleware(req: NextRequest) {
  if (alwaysAllowedPaths.test(req.nextUrl.pathname)) {
    return;
  }
  return NextResponse.next();
}
