import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_EXACT_ROUTES = ["/", "/login", "/admin-login"];
const CHANGE_PASSWORD_ROUTE = "/trocar-senha";
const ADMIN_PREFIX = "/admin";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_EXACT_ROUTES.includes(path);

  if (!user) {
    if (isPublicRoute) return supabaseResponse;
    const url = request.nextUrl.clone();
    url.pathname = path.startsWith(ADMIN_PREFIX) ? "/admin-login" : "/login";
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, must_change_password")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "user";
  const mustChangePassword = profile?.must_change_password ?? false;
  const homePath = role === "master" ? "/admin" : "/dashboard";

  if (isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = homePath;
    return NextResponse.redirect(url);
  }

  if (mustChangePassword && path !== CHANGE_PASSWORD_ROUTE) {
    const url = request.nextUrl.clone();
    url.pathname = CHANGE_PASSWORD_ROUTE;
    return NextResponse.redirect(url);
  }

  if (!mustChangePassword && path === CHANGE_PASSWORD_ROUTE) {
    const url = request.nextUrl.clone();
    url.pathname = homePath;
    return NextResponse.redirect(url);
  }

  if (role === "master" && !path.startsWith(ADMIN_PREFIX) && path !== CHANGE_PASSWORD_ROUTE) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (role !== "master" && path.startsWith(ADMIN_PREFIX)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
