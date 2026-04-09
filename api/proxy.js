export const config = { runtime: 'edge' };
export default async (req) => {
  const url = new URL(req.url);
  const target = 'https://generativelanguage.googleapis.com' + url.pathname + url.search;
  return await fetch(new Request(target, {
    method: req.method,
    headers: req.headers,
    body: req.body
  }));
};
