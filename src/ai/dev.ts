import { config } from 'dotenv';
config();

import '@/ai/flows/generate-reading-recommendations.ts';
import '@/ai/flows/generate-cover-image.ts';
import '@/ai/flows/continue-story.ts';
