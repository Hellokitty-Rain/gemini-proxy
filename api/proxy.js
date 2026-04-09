export const config = {
  runtime: 'edge',
};

export default async (request) => {
  const url = new URL(request.url);
  
  // 关键：我们要手动拼接路径
  const targetUrl = 'https://generativelanguage.googleapis.com' + url.pathname + url.search;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    return response;
  } catch (e) {
    return new Response('Vercel Proxy Error: ' + e.message, { status: 500 });
  }
};
