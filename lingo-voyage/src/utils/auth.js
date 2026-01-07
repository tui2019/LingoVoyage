import { redirect } from "react-router-dom";

// For parent layout - just returns user data or null, no redirect
export async function getUserData() {
  try {
    const res = await fetch("http://localhost:4000/api/check-auth", { credentials: "include" });
    const data = await res.json();

    if (!data.authenticated) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null;
  }
}

// For protected routes - redirects if not authenticated
export async function checkAuth() {
  const user = await getUserData();

  if (!user) {
    return redirect("/login");
  }

  return user;
}
