import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "~/env";

const alwaysAllowedPaths = /((api|_next\/static|_next\/image|favicon\.ico).*)/;
const appLockRedirect = "/lock";

function getIsAuthorized(req: NextRequest) {
  if (!env.APP_SECRET_KEY_LOCK) {
    return true;
  }

  const storedValue = req.cookies.get("app_secret");
  if (storedValue === undefined) {
    return false;
  }
  return storedValue.value === env.APP_SECRET_KEY_LOCK;
}

export function middleware(req: NextRequest) {
  if (alwaysAllowedPaths.test(req.nextUrl.pathname)) {
    return;
  }

  const isAuthorized = getIsAuthorized(req);
  if (!isAuthorized && req.nextUrl.pathname !== appLockRedirect) {
    return NextResponse.redirect(new URL(appLockRedirect, req.url));
  }

  if (isAuthorized && req.nextUrl.pathname === appLockRedirect) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
