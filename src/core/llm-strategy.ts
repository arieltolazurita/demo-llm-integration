/**
 * Strategy pattern contract. Each large language model provider implements
 * this interface so the rest of the application can remain agnostic to
 * vendor-specific details.
 */

import type { ChatOptions, ChatResponse, StreamingChunk } from './chat-types.js';

export interface LLMStrategy {
    /**
     * Executes a single-response chat completion.
     */
    sendMessage(prompt: string, options?: ChatOptions): Promise<ChatResponse>;

    /**
     * Executes a streaming chat completion. The returned async iterable yields
     * chunks until the provider marks the stream as complete.
     */
    streamMessage(prompt: string, options?: ChatOptions): AsyncIterable<StreamingChunk>;
}
