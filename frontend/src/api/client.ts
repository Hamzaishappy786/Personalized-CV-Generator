export async function apiGet(path: string) {
  const response = await fetch(path);
  return response.json();
}

