export async function fetchSettings() {
  try {
    const res = await fetch("http://localhost:4000/api/settings", {
      credentials: "include"
    });
    
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const data = await res.json();
      console.error("Failed to fetch settings:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
