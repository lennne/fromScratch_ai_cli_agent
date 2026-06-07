export class AIService {
    constructor(){
        if(!config.googleApiKey){
            throw new Error("GOOGLE_API_KEY is not set in env")
        }

        this.model = google(config.model, {
            apiKey: config.googleApiKey,  
        })
    }

    /**
     * Send a message and get streaming response
     * @param {Array} messages
     * @param {Function} onChunk
     * @param {Object} tools
     * @param {Function} onToolCall
     * @returns {Promise<Object>}
     */

    async sendMessage(
        messages,
        onChunk,
        tools = undefined,
        onToolCall = null
    ){
        try {
            const streamConfig = {
                mode:this.model,
                messages: messages,
            }

            // we don't need to await the streamText cause streaming doesn't require it
            const result = streamText(streamConfig);
            
            let fullResponse = ""

            for await (const chunk of result.textStream){
                fullResponse += chunk;
                if(onChunk){
                    onChunk(chunk)
                }
            }

            const fullResult = result; 

            return {
                content: fullResponse,
                finishResponse: fullResult.finishReason,
                usage: fullResult.usage
            }
        } catch (error) {
            console.error(chalk.red("AI Service Error"), error.message)
            throw error;
        }
    }

    /**
     * Get a non-streaming response
     * @param {Array} messages - Array of message objects
     * @param {Object} tools - Optional tools
     * @returns {Promise<string>} Response text
     */
    async getMessage(
        messages,
        tools = undefined
    ){
        let fullResponse = "";
        await this.sendMessage( 
            messages,
            (chunk) => {
                fullResponse += chunk
            }
        )

        return fullResponse;
    }
}