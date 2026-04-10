export default async (request, context) => {
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
  const target =
    "https://generativelanguage.googleapis.com" +
    url.pathname +
    url.search;

  // 先把 body 读成文本再转发，避免流被提前消费
  const bodyText = await request.text();

  const upstream = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: bodyText,
  });

  // 非 200 直接返回错误文本，方便调试
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

  // 透传流
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",        // 关键：禁止中间层缓冲
      "Access-Control-Allow-Origin": "*",
    },
  });
};
