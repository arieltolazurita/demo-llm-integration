/**
 * Optional builder offering a fluent API to configure providers. This reduces
 * the number of imperative method calls when wiring the chat service.
 */

import type { ChatOptions } from '../core/chat-types.js';
import { ChatService, type ProviderConfig } from './chat-service.js';

export class LLMClientBuilder {
    private config: ProviderConfig | undefined;
    private defaultOptions: ChatOptions | undefined;

    constructor(private readonly service = new ChatService()) { }

    withPlatform(platform: string): this {
        this.config = { ...(this.config ?? { model: '' }), platform };
        return this;
    }

    withModel(model: string): this {
        this.config = { ...(this.config ?? { platform: '' }), model };
        return this;
    }

    withDefaultOptions(options: ChatOptions): this {
        this.defaultOptions = { ...(this.defaultOptions ?? {}), ...options };
        return this;
    }

    build(): ConfiguredClient {
        if (this.config?.platform === undefined || this.config?.platform === '') {
            throw new Error('Platform must be specified before building the client.');
        }
        if (this.config?.model === undefined || this.config?.model === '') {
            throw new Error('Model must be specified before building the client.');
        }

        this.service.configure(this.config);
        return new ConfiguredClient(this.service, this.defaultOptions);
    }
}

export class ConfiguredClient {
    constructor(
        private readonly service: ChatService,
        private readonly defaultOptions: ChatOptions | undefined
    ) { }

    async send(prompt: string, options?: ChatOptions) {
        return this.service.send(prompt, { ...this.defaultOptions, ...options });
    }

    stream(prompt: string, options?: ChatOptions) {
        return this.service.stream(prompt, { ...this.defaultOptions, ...options });
    }
}
