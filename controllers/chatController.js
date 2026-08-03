import { GoogleGenAI } from '@google/genai';
import { notificationService } from '../services/notificationService.js';

// Lazy initialize Gemini AI client
let aiClient = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn(
        '[chatController] GEMINI_API_KEY not set. Local fallback engine will be used.'
      );
    } else {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
  }

  return aiClient;
}

export async function handleChatMessage(req, res) {
  try {
    const {
      prompt,
      philosophy = 'Stoicism',
      history = []
    } = req.body || {};

    // ============================================================
    // VALIDATION
    // ============================================================

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        error: 'Prompt string is required.'
      });
    }

    // ============================================================
    // GEMINI MULTI-AGENT ORCHESTRATOR
    // ============================================================

    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemInstruction = `
You are MindMentor, a multi-agent AI system combining Research,
Planner, and Executor capabilities.

Your domain is philosophy (${philosophy}) and psychological
self-reflection for personal growth.

CRITICAL SAFETY RULE:
You are strictly for personal growth and philosophy,
NOT a medical or clinical psychiatric tool.

Never diagnose or prescribe.

Return valid JSON adhering strictly to this schema:

{
  "concept_name": "Core concept name (e.g., Amor Fati, Shadow Work, Wu Wei)",

  "core_insight": "2-3 sentences explaining this principle practically",

  "quote": {
    "text": "Authentic quote text",
    "author": "Author name",
    "source": "Book or work"
  },

  "books": [
    {
      "title": "Book 1",
      "author": "Author 1",
      "reason": "Why it helps"
    },
    {
      "title": "Book 2",
      "author": "Author 2",
      "reason": "Why it helps"
    }
  ],

  "habits": [
    {
      "id": "h1",
      "title": "Habit Name",
      "description": "Clear step",
      "time_estimate": "5 mins",
      "category": "Mindset"
    },
    {
      "id": "h2",
      "title": "Habit Name",
      "description": "Clear step",
      "time_estimate": "3 mins",
      "category": "Action"
    },
    {
      "id": "h3",
      "title": "Habit Name",
      "description": "Clear step",
      "time_estimate": "5 mins",
      "category": "Reflection"
    }
  ],

  "reflection_prompt": "An evening journaling question",

  "mindset_mantra": "A 1-line grounding affirmation",

  "message": "Full synthesized empathetic guidance markdown text"
}
`;

        const genResponse = await ai.models.generateContent({
          model: 'gemini-3.6-flash',

          contents:
            `User Prompt: ${prompt}\n` +
            `Selected Philosophy: ${philosophy}\n` +
            `Conversation History: ${JSON.stringify(history)}`,

          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });

        if (genResponse && genResponse.text) {
          const parsed = JSON.parse(genResponse.text.trim());

          const safetyDisclaimer =
            'MindMentor is designed strictly for personal growth, philosophical self-reflection, and wisdom exploration. It is NOT a medical or clinical tool. MindMentor does NOT provide medical diagnosis, psychiatric assessment, or psychological treatment.';

          const result = {
            status: 'success',

            philosophy,

            agent_used:
              'Node Multi-Agent Pipeline (Research -> Planner -> Executor)',

            message:
              parsed.message ||
              parsed.core_insight ||
              'Take a moment to reflect on what is within your control.',

            concept_name:
              parsed.concept_name ||
              'Wisdom Reflection',

            core_insight:
              parsed.core_insight || '',

            quote:
              parsed.quote || {
                text: 'Know thyself.',
                author: 'Socrates',
                source: 'Delphic Maxim'
              },

            books:
              Array.isArray(parsed.books)
                ? parsed.books
                : [],

            habits:
              Array.isArray(parsed.habits)
                ? parsed.habits
                : [],

            reflection_prompt:
              parsed.reflection_prompt ||
              'What was the most meaningful choice I made today?',

            mindset_mantra:
              parsed.mindset_mantra ||
              'I cultivate calm through clear judgment.',

            safety_disclaimer:
              safetyDisclaimer
          };

          if (result.concept_name && result.quote?.text) {
            notificationService.dispatchInsight(
              `${result.concept_name} Insight`,
              `"${result.quote.text}" — ${result.quote.author || philosophy}`,
              philosophy
            );
          }

          return res.json(result);
        }
      } catch (geminiErr) {
        console.error(
          '[chatController] Gemini API error:',
          geminiErr
        );
      }
    }

    // ============================================================
    // STATIC FALLBACK
    // ============================================================

    const staticResponse = {
      status: 'success',

      philosophy,

      agent_used:
        'MindMentor Standalone Wisdom Engine',

      concept_name:
        `${philosophy} Core Principles`,

      core_insight:
        'Real power begins when we turn inward and separate circumstances beyond our influence from our own intentional choices.',

      quote: {
        text:
          'The soul becomes dyed with the color of its thoughts.',
        author:
          'Marcus Aurelius',
        source:
          'Meditations'
      },

      books: [
        {
          title: 'Meditations',
          author: 'Marcus Aurelius',
          reason:
            'Foundational Stoic journal on self-command and tranquility.'
        },
        {
          title: 'Man’s Search for Meaning',
          author: 'Viktor Frankl',
          reason:
            'Understanding how purpose transforms suffering into resilience.'
        }
      ],

      habits: [
        {
          id: 'h1',
          title: 'Morning Perspective Reset',
          description:
            'Write down 3 things outside your control and explicitly release attachment to them.',
          time_estimate: '3 mins',
          category: 'Mindset'
        },
        {
          id: 'h2',
          title: 'Intentional Breathing Pause',
          description:
            'When feeling overwhelmed, take 4 slow, deliberate box-breaths.',
          time_estimate: '2 mins',
          category: 'Action'
        },
        {
          id: 'h3',
          title: 'Evening Reflection Journal',
          description:
            'Review where you acted with virtue today and where you can refine tomorrow.',
          time_estimate: '5 mins',
          category: 'Reflection'
        }
      ],

      reflection_prompt:
        'Where did I spend my mental energy today, and was it aligned with my highest values?',

      mindset_mantra:
        'I focus only on what is within my power to shape.',

      message:
        `### ${philosophy} Focus: Inner Sovereignty

When navigating challenges, start by anchoring yourself in what is directly within your control—your choices, attention, and virtues.

> **"The soul becomes dyed with the color of its thoughts."**
> — *Marcus Aurelius*, Meditations

Use today's practices below to build clarity and mental resilience step by step.`,

      safety_disclaimer:
        'MindMentor is designed strictly for personal growth, philosophical self-reflection, and wisdom exploration. It is NOT a medical or clinical tool. MindMentor does NOT provide medical diagnosis, psychiatric assessment, or psychological treatment.'
    };

    return res.json(staticResponse);

  } catch (err) {
    console.error(
      '[chatController] Unhandled error:',
      err
    );

    return res.status(500).json({
      error: 'Internal Server Error',
      details: err.message
    });
  }
}