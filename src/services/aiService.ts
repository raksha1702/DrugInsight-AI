import { AIChatMessage } from '../types';
import { PREDEFINED_AI_KNOWLEDGE, SAFETY_REFUSAL_RESPONSE } from '../data/mockAIResponses';

export const aiService = {
  async askQuestion(prompt: string): Promise<AIChatMessage> {
    // Artificial latency for realism
    await new Promise(resolve => setTimeout(resolve, 600));

    const lower = prompt.toLowerCase();

    // Check for unsafe prescriptive or diagnostic questions first
    const isUnsafe = SAFETY_REFUSAL_RESPONSE.keywords.some(k => lower.includes(k));
    if (isUnsafe) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: SAFETY_REFUSAL_RESPONSE.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [],
        isDemo: true,
        isRefusal: true
      };
    }

    // Match keywords against predefined answers
    let matched = PREDEFINED_AI_KNOWLEDGE.find(item =>
      item.keywords.some(k => lower.includes(k))
    );

    if (!matched) {
      // Default to general evidence summary if no specific keyword matched
      matched = PREDEFINED_AI_KNOWLEDGE[3]; // general evidence
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: matched.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: matched.citations,
      isDemo: true,
      isRefusal: false
    };
  }
};
