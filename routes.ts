import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import https from "https";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy middleware configuration
  app.use('/proxy', createProxyMiddleware({
    router: (req: Request) => {
      const targetUrl = req.query.url as string;
      if (!targetUrl) {
        throw new Error('No target URL provided');
      }
      return targetUrl;
    },
    changeOrigin: true,
    secure: false, // Disable SSL verification to allow self-signed certs
    followRedirects: true, // Follow HTTP 3xx responses as redirects
    ws: true, // Enable WebSocket proxying
    xfwd: true, // Add x-forward headers
    onProxyReq: (proxyReq, req) => {
      // Forward original headers
      proxyReq.setHeader('User-Agent', req.headers['user-agent'] || '');
      proxyReq.setHeader('Accept', req.headers['accept'] || '');
      proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
      proxyReq.setHeader('Connection', 'keep-alive');

      // Remove headers that might cause issues
      proxyReq.removeHeader('sec-fetch-dest');
      proxyReq.removeHeader('sec-fetch-mode');
      proxyReq.removeHeader('sec-fetch-site');
    },
    onProxyRes: (proxyRes, req, res) => {
      // Handle CORS
      proxyRes.headers['access-control-allow-origin'] = '*';

      // Remove headers that might cause issues
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['x-frame-options'];
    },
    onError: (err, req, res) => {
      console.error('Proxy Error:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({
        error: 'Proxy Error',
        message: err.message
      }));
    },
    pathRewrite: {
      '^/proxy': '', // Remove the /proxy prefix when forwarding
    },
    agent: new https.Agent({
      rejectUnauthorized: false, // Allow self-signed certificates
      keepAlive: true,
      timeout: 60000
    })
  }));

  const httpServer = createServer(app);
  return httpServer;
}