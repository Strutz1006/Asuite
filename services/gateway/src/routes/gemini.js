import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = Router();

const geminiServiceProxy = createProxyMiddleware({
  target: 'http://localhost:3002', // The address of the gemini-service
  changeOrigin: true,
  pathRewrite: {
    '^/api/gemini': '/api/gemini', // rewrite path
  },
});

router.use('/', geminiServiceProxy);

export default router;
