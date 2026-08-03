export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed'
    });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'MindMentor Vercel API',
    environment: 'vercel',
    timestamp: new Date().toISOString()
  });
}find api -maxdepth 1 -type f -print