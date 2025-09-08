import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ["/about", "/login", "/auth"];
const loginRoute = "/login";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get("access")?.value;

	const isPublicRoute = publicRoutes.some((route) =>
		pathname.startsWith(route)
	);

	if (!isPublicRoute && !accessToken) {
		const loginUrl = new URL(loginRoute, request.url);
		loginUrl.searchParams.set("from", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
