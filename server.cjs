const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{let p;try{p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400);return res.end('Bad request');}if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}if(p===root)p=path.join(root,'index.html');fs.stat(p,(err,s)=>{if(err||!s.isFile()){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream','Cache-Control':'no-cache'});fs.createReadStream(p).pipe(res);});});
server.listen(4173,'127.0.0.1',()=>console.log('Brewns preview: http://127.0.0.1:4173'));
