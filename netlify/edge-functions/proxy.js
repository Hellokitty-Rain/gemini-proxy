export default async (request, context) => {
  const url = new URL(request.url);
  
  // 构造目标 Google API 地址
  const targetUrl = "https://generativelanguage.googleapis.com" + url.pathname + url.search;

  // 复制原始请求的 header，并处理 host
  const headers = new Headers(request.headers);
  headers.set("host", "generativelanguage.googleapis.com");

  return fetch(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: "follow",
  });
};