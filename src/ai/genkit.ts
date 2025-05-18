import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize the Google AI plugin, trying to use an API key from environment variables.
// The user must create a .env.local file with GOOGLE_GEMINI_API_KEY=your_api_key
const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn(
    'GOOGLE_GEMINI_API_KEY is not set in environment variables. ' +
    'Genkit features requiring this API key may not work. ' +
    'Please create a .env.local file and add your GOOGLE_GEMINI_API_KEY.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI(geminiApiKey ? {apiKey: geminiApiKey} : undefined),
  ],
  // It's generally better to specify models per-prompt or per-generate call
  // rather than setting a global default model, to allow more flexibility.
  // model: 'googleai/gemini-1.5-flash-latest', // Example if you want a default
});
