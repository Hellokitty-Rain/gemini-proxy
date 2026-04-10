export default async (request, context) => {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const url = new URL(request.url);
  // 把 /v1beta/... 透传给 Google
  const target =
    "https://generativelanguage.googleapis.com" +
    url.pathname +
    url.search;

  const upstream = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: request.body,
  });

  // 直接透传流，不缓冲
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
