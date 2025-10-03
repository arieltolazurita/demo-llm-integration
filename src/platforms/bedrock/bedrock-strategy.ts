/**
 * Bedrock adapter implementing the Strategy contract. It translates the
 * application-level request into the AWS Bedrock SDK format and adapts the
 * response back to the unified domain types.
 */

import type { ChatOptions, ChatResponse, StreamingChunk } from '../../core/chat-types.js';
import type { LLMStrategy } from '../../core/llm-strategy.js';
import { BedrockSDKClient } from '../sdk-clients.js';

export class BedrockStrategy implements LLMStrategy {
    constructor(
        private readonly client: BedrockSDKClient,
        private readonly modelId: string
    ) { }

    async sendMessage(prompt: string, options: ChatOptions = {}): Promise<ChatResponse> {
        const response = await this.client.invokeModel({
            modelId: this.modelId,
            prompt,
            temperature: options.temperature,
            maxTokens: options.maxTokens
        });

        return {
            model: response.modelId,
            content: response.outputText,
            usage: {
                promptTokens: response.promptTokens,
                completionTokens: response.completionTokens,
                totalTokens: response.promptTokens + response.completionTokens
            },
            additionalData: response.additionalMetadata
        };
    }

    async * streamMessage(prompt: string, options: ChatOptions = {}): AsyncIterable<StreamingChunk> {
        // The mock client does not support streaming. We simulate it to keep the
        // rest of the application agnostic to platform capabilities.
        const fullResponse = await this.sendMessage(prompt, options);
        const words = fullResponse.content.split(' ');
        for (const [index, word] of words.entries()) {
            yield {
                model: fullResponse.model,
                contentFragment: word + (index < words.length - 1 ? ' ' : ''),
                isLast: index === words.length - 1
            };
        }
    }
}
