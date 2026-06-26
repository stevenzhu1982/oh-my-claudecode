export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ghUrl = "https://raw.githubusercontent.com/stevenzhu1982/family-trip-2026/gh-pages/index.html";
    const resp = await fetch(ghUrl);
    const html = await resp.text();
    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  }
};
