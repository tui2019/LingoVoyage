export async function fetchTopics() {
  try {
    const res = await fetch("http://localhost:4000/api/topics", {
          credentials: "include"
        });
    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      console.error("Failed to fetch topics:", data.error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}
