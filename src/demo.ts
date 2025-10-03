/**
 * Minimal executable showcasing runtime switching between platforms. In real
 * usage you would replace console logging with your web socket or HTTP layer.
 * 
 * This demo includes:
 * - AWS Bedrock (Anthropic Claude)
 * - Azure OpenAI (GPT-3.5)
 * - Google Vertex AI (Gemini)
 * - Ollama (Local models - no API key required)
 * 
 * To test with Ollama locally:
 * 1. Install Ollama: https://ollama.ai
 * 2. Pull a model: ollama pull llama3.2
 * 3. Run this demo: npm run demo
 * 
 * Note: This demo uses mock SDK clients. In production, you would use real
 * API clients with proper authentication.
 */

import { registerDefaultFactories } from './platforms/register.js';
import { ChatService } from './service/chat-service.js';

async function runDemo() {
    registerDefaultFactories();
    const chatService = new ChatService();

    console.log('=== LLM Integration Demo: Runtime Platform Switching ===\n');

    // Example 1: AWS Bedrock with Anthropic Claude
    console.log('1. Switching to AWS Bedrock (Anthropic Claude)...');
    chatService.configure({ platform: 'bedrock', model: 'anthropic.claude-v2' });
    const bedrockResponse = await chatService.send('Explain strategy pattern.');
    console.log('[Bedrock]', bedrockResponse.content);
    console.log(`Tokens used: ${bedrockResponse.usage.totalTokens}\n`);

    // Example 2: Azure OpenAI
    console.log('2. Switching to Azure OpenAI (GPT-3.5)...');
    chatService.configure({ platform: 'azure', model: 'gpt-35-turbo' });
    const azureResponse = await chatService.send('Explain abstract factory pattern.');
    console.log('[Azure]', azureResponse.content);
    console.log(`Tokens used: ${azureResponse.usage.totalTokens}\n`);

    // Example 3: Google Vertex AI
    console.log('3. Switching to Google Vertex AI (Gemini)...');
    chatService.configure({ platform: 'google', model: 'gemini-pro' });
    const googleResponse = await chatService.send('Explain adapter pattern.');
    console.log('[Google]', googleResponse.content);
    console.log(`Tokens used: ${googleResponse.usage.totalTokens}\n`);

    // Example 4: Ollama (Local Models - No API Key Required)
    console.log('4. Switching to Ollama (Local Llama 3.2)...');
    chatService.configure({ platform: 'ollama', model: 'llama3.2' });
    const ollamaResponse = await chatService.send('Explain the benefits of local LLM deployment.');
    console.log('[Ollama]', ollamaResponse.content);
    console.log(`Tokens used: ${ollamaResponse.usage.totalTokens}\n`);

    // Demonstrate streaming with Ollama
    console.log('5. Demonstrating streaming with Ollama...');
    process.stdout.write('[Ollama Stream] ');
    for await (const chunk of chatService.stream('Why use design patterns?')) {
        process.stdout.write(chunk.contentFragment);
    }
    console.log('\n');

    // Show current configuration
    const currentConfig = chatService.getCurrentConfiguration();
    console.log(`Current configuration: Platform=${currentConfig?.platform}, Model=${currentConfig?.model}`);
}

runDemo().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
