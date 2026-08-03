import { handleChatMessage } from '../controllers/chatController.js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed'
    });
  }

  try {
    return await handleChatMessage(req, res);
  } catch (error) {
    console.error('[api/chat] Error:', error);

    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
}