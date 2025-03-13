import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  // Define routes to exclude from logging
  const excludedRoutes = [
    '/favicon.ico',
    '/_nuxt/',
    '/assets/',
    '/api/health',
    // Add more routes to exclude as needed
  ];
  
  // Check if the current URL should be excluded
  const currentUrl = event.node.req.url || '';
  const shouldExclude = excludedRoutes.some(route => currentUrl.includes(route));
  
  // Skip logging for excluded routes
  if (shouldExclude) {
    return;
  }

  const start = Date.now();
  const { method, url } = event.node.req;
  
  // Get client IP address
  const ip = event.node.req.headers['x-forwarded-for'] || 
             event.node.req.socket.remoteAddress || 
             'unknown';
  
  // Get user agent
  const userAgent = event.node.req.headers['user-agent'] || 'unknown';
  
  // Log request start
  console.log(`[${new Date().toISOString()}] 🔍 Request started: ${method} ${url} from ${ip}`);
  
  // Add response hook to log after request is processed
  event.node.res.on('finish', () => {
    const duration = Date.now() - start;
    const status = event.node.res.statusCode;
    
    // Performance classification
    let performanceLabel = '🟢 Good';
    if (duration > 500) performanceLabel = '🟠 Slow';
    if (duration > 1000) performanceLabel = '🔴 Very Slow';
    
    // Log detailed information
    console.log(`  Status: ${status}`);
    console.log(`  Duration: ${duration}ms ${performanceLabel}`);
    console.log(`  User-Agent: ${userAgent}`);
    console.log(`  IP: ${ip}`);
    console.log(`[${new Date().toISOString()}] ✅ Request completed: ${method} ${url}`);
    console.log('  -------------------');
  });
}); 