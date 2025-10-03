/**
 * Abstract factory contract. Platforms (e.g. Bedrock, Azure) implement this
 * interface to create platform-specific strategy instances for concrete models.
 */

import type { LLMStrategy } from './llm-strategy.js';

export interface LLMFactory {
    /**
     * Creates a strategy instance for the requested model identifier.
     */
    createClient(model: string): LLMStrategy;

    /**
     * Returns the models this factory can build. Useful for UI selectors.
     */
    listAvailableModels(): readonly string[];
}
