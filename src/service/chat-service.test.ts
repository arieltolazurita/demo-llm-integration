/**
 * Vitest suite validating runtime switching and unified response shapes.
 */

import { describe, expect, it, beforeEach } from 'vitest';
import { registerDefaultFactories } from '../platforms/register.js';
import { llmRegistry } from '../registry/llm-registry.js';
import { ChatService } from './chat-service.js';
import { LLMClientBuilder } from './llm-client-builder.js';

describe('ChatService integration', () => {
    beforeEach(() => {
        // Clear and re-register factories between tests to avoid cross-test leakage.
        llmRegistry.clear();
        registerDefaultFactories();
    });

    it('switches strategies at runtime without recreating the service', async () => {
        const service = new ChatService();

        service.configure({ platform: 'bedrock', model: 'anthropic.claude-v2' });
        const bedrock = await service.send('Hello Bedrock');
        expect(bedrock.model).toBe('anthropic.claude-v2');
        expect(bedrock.content).toContain('Bedrock response');

        service.configure({ platform: 'azure', model: 'gpt-35-turbo' });
        const azure = await service.send('Hello Azure');
        expect(azure.model).toBe('gpt-35-turbo');
        expect(azure.content).toContain('Azure OpenAI response');
    });

    it('streams content fragments in a unified format', async () => {
        const service = new ChatService();
        service.configure({ platform: 'google', model: 'gemini-pro' });

        const collected: string[] = [];
        for await (const chunk of service.stream('Break response into sentences.')) {
            collected.push(chunk.contentFragment);
        }

        expect(collected.join(' ')).toContain('Vertex AI response');
    });

    it('builds a configured client with defaults using the builder', async () => {
        const builder = new LLMClientBuilder();
        const client = builder
            .withPlatform('ollama')
            .withModel('llama3')
            .withDefaultOptions({ temperature: 0.5 })
            .build();

        const response = await client.send('Explain the benefits of adapters.');
        expect(response.model).toBe('llama3');
        expect(response.content).toContain('Ollama response');
    });
});
