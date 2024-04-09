import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "~/env";

const alwaysAllowedPaths = /((api|_next\/static|_next\/image|favicon\.ico).*)/;
const appLockRedirect = "/lock";

export function middleware(req: NextRequest) {
  if (
    !env.APP_SECRET_KEY_LOCK ||
    alwaysAllowedPaths.test(req.nextUrl.pathname)
  ) {
    return;
  }

  const storedValue = req.cookies.get("app_secret");
  const isAuthorized = storedValue?.value === env.APP_SECRET_KEY_LOCK;

  if (!isAuthorized && req.nextUrl.pathname !== appLockRedirect) {
    return NextResponse.redirect(new URL(appLockRedirect, req.url));
  }

  if (isAuthorized && req.nextUrl.pathname === appLockRedirect) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
