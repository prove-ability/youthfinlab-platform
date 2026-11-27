const http = require("http"),
  fs = require("fs"),
  path = require("path");
const root = path.resolve(
  __dirname,
  "../../node_modules/.cache/loading-preview",
);
http
  .createServer((req, res) => {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const target = path.resolve(
      root,
      "." + (pathname === "/" ? "/clients.html" : pathname),
    );
    if (!target.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(target, (e, data) => {
      if (e) {
        res.writeHead(404).end();
        return;
      }
      res.setHeader(
        "Content-Type",
        { ".js": "text/javascript", ".css": "text/css", ".html": "text/html" }[
          path.extname(target)
        ] || "application/octet-stream",
      );
      res.end(data);
    });
  })
  .listen(14312, "127.0.0.1", () =>
    console.log("Loading preview: http://localhost:14312"),
  );
