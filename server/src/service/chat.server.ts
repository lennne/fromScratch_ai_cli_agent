import { prisma } from "../lib/db";

export class ChatService {
    /**
     * Create a new conversation
     * @param {string} userId - User ID
     * @param {string} mode - chat, tool, or agent
     * @param {string} title - Optional conversation title
     */

    async createConversation(userId: string, mode="chat", title=null){
        return prisma.conversation.create({
            data: {
                userId,
                mode,
                title: title || `New ${mode} conversation`
            }
        })
    }

    /**
     * Get or create a 
     * @param userId - User ID
     * @param conversationId Optional conversation ID
     * @param mode chat, tool, or agent
     */
    async getOrCreateConversation(userId: string, conversationId=null, mode="chat"){
        if (conversationId){
            const conversation = await prisma.conversation.findFirst({
                where: {
                    id: conversationId,
                    userId
                },
                include: {
                    messages: {
                        orderBy: {
                            createdAt: "asc"
                        }
                    }
                }
            })

            if (conversation) return conversation;
        }

        return await this.createConversation(userId, mode);
    }

    /**
     * Add a message to conversation
     * @param conversationId - Conversation ID
     * @param role - user, assistant, system, tool
     * @param content content - Message content
     */
    async addMessage(conversationId: string, role: string, content: any ){
        const contentStr = typeof content === "string"
        ? content
        : JSON.stringify(content);

        return await prisma.message.create({
            data: {
                conversationId,
                role,
                content: contentStr
            }
        })
    }

    /**
     * Get conversation messages
     * @param conversationId - Conversation ID
     */
    async getMessages(conversationId: string){
        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" }
        });

        return messages.map((message) => ({
            ...message,
            content: this.parseContent(message.content)
        }))
    }

    /**
     * Get all conversations for a user
     * @param userId - User ID (for security)
     * @returns 
     */
    async getUserConversation(userId: string){
        return await prisma.conversation.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: "desc" }
                }
            }
        })
    }

    /**
     * Delete a conversation
     * @param conversationId - Conversation ID
     * @param userId - User ID (for security)
     */
    async deleteConversation(conversationId: string, userId: string){
        return await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userId,
            },
        });
    }

    /**
     * Update conversation title
     * @param conversationId - Conversation ID
     * @param title - New title
     * @returns Promise<prisma.conversation>
     */
    async updateTitle(conversationId: string, title: string){
        return await prisma.conversation.update({
            where: { id: conversationId },
            data: { title },
        })
    }

    /**
     * Helper to parse content (JSON or string) 
     * @param content - Message content
     * @returns 
     */
    parseContent(content: any){
        try {
            return JSON.parse(content);
        } catch (error) {
            return content;
        }
    }

    
    formatMessagesForAI(messages: any){
        return messages.map((message: any) => ({
            role: message.role,
            content: typeof message.content === "string" ? message.content : JSON.stringify(message.content)
        })); 
    }



}