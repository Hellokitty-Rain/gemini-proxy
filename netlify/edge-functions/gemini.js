export default async (request, context) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const url = new URL(request.url);
  const target =
    "https://generativelanguage.googleapis.com" +
    url.pathname +
    url.search;

  const bodyText = await request.text();

  // 透传 Authorization header（Bearer token）或降级走 ?key=
  const headers = { "Content-Type": "application/json" };
  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;

  const upstream = await fetch(target, {
    method: "POST",
    headers,
    body: bodyText,
  });

  if (!upstream.ok) {
    const errText = await upstream.text();
    return new Response(errText, {
      status: upstream.status,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
