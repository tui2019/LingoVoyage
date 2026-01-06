import { redirect } from "react-router-dom";

export async function checkAuth() {
  try {
    const res = await fetch("http://localhost:4000/api/check-auth", { credentials: "include" });
    const data = await res.json();

    if (!data.authenticated) {
      return redirect("/login");
    }

    return data.user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return redirect("/login");
  }
}
