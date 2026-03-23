export default function swrCacheProvider() {
  const map = new Map(JSON.parse(localStorage.getItem("@pitang/swr") || "[]"));

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));

    localStorage.setItem("@pitang/swr", appCache);
  });

  return map;
}
