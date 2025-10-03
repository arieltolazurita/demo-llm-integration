/**
 * Factory resolver that chooses the correct platform factory on demand.
 * This plays the "factory method" role and keeps platform discovery in a
 * single, easy-to-test location.
 */

import type { LLMFactory } from '../core/llm-factory.js';
import { AzureFactory } from './azure/azure-factory.js';
import { BedrockFactory } from './bedrock/bedrock-factory.js';
import { GoogleFactory } from './google/google-factory.js';
import { OllamaFactory } from './ollama/ollama-factory.js';

export type SupportedPlatform = 'bedrock' | 'azure' | 'google' | 'ollama';

export function createFactory(platform: SupportedPlatform): LLMFactory {
    switch (platform) {
        case 'bedrock':
            return new BedrockFactory();
        case 'azure':
            return new AzureFactory();
        case 'google':
            return new GoogleFactory();
        case 'ollama':
            return new OllamaFactory();
        default: {
            const exhaustiveCheck: never = platform;
            throw new Error(`Unsupported platform: ${String(exhaustiveCheck)}`);
        }
    }
}
