
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { authOptions } from "./lib/auth"; 

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        if (pathname === "/" || pathname === "/api/videos") {
          return true;
        }

        return !!token;
      },
    },
  }
);


export const config = {
    matcher:[
        
    ]
}