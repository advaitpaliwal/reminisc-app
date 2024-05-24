import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse, createStreamDataTransformer } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a super friendly AI assistant named Rem who is excited to meet a new person.
Engage in warm, open conversation and ask questions to get to know them better.
Use the chat history and retrieved memories to provide relevant context and follow up on previous topics.
Keep the conversation flowing naturally and focus on building a positive, supportive relationship.

Retrieved Memory:
{relevant_memory}

Current conversation:
{chat_history}

User: {input}
AI:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    console.log("Received messages:", messages);
    console.log("Formatted previous messages:", formattedPreviousMessages);
    console.log("Current message content:", currentMessageContent);

    // const supabase = createClient()
    // const userResponse = await supabase.auth.getUser()
    // const userId = userResponse.data.user?.id
    const userId = 'advait'

    const headers = {
      'Content-Type': 'application/json',
      'X-OPENAI-API-KEY': `${process.env.OPENAI_API_KEY}`,
      'X-REMINISC-API-KEY': `${process.env.REMINISC_API_KEY}`,
    }
    const searchMemoriesUrl = `${process.env.REMINISC_BASE_API_URL}/v0/memory/search`
    const searchResponse = await fetch(searchMemoriesUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ content: currentMessageContent, user_id: userId })
    })

    const searchJson = await searchResponse.json()
    console.log('Search results:', searchJson)
    const relevantMemory = searchJson.map((memory: any) => memory.content).join(' ')
    console.log('Relevant memory:', relevantMemory)
    
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const model = new ChatOpenAI({
      temperature: 0.3,
      modelName: "gpt-3.5-turbo",
    });
    const outputParser = new HttpResponseOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);
    
    console.log("Initialized chain with prompt, model, and output parser");

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
      relevant_memory: relevantMemory,
    });

    console.log("Streaming response");

    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer()),
    );
  } catch (e: any) {
    console.error("Error occurred:", e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}