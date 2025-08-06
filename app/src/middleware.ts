import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const accessToken = request.cookies.get("access")?.value;
	const { pathname } = request.nextUrl;

	function hasAddSegment(path: string) {
		const segments = path.split("/").filter(Boolean);
		return segments.includes("add");
	}

	const isProtected =
		pathname.startsWith("/professor") ||
		pathname.startsWith("/student") ||
		hasAddSegment(pathname);

	if (isProtected && !accessToken) {
		const loginUrl = new URL("/login", request.url);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/professor/:path*", "/student/:path*", "/:path*"],
};
