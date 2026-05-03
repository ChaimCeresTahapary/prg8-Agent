import { retrieve } from "./tools.js";
import { createAgent } from "langchain";
import { AzureChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();
const model = new AzureChatOpenAI({ temperature: 0.2 });

const agent = createAgent({
    model,
    tools: [retrieve],
    checkpointer,
    systemPrompt:
        "You are an assistant who can use the retrieve tool to find info about Beyond Good and Evil.",
});
export async function callAssistant (message) {

    const result = await agent.invoke(
        {messages: [{role: "user", content: message}]},
        {configurable: {thread_id: "1"}}
    );

    const finalMessage = result.messages.at(-1).content;
    console.log(finalMessage);
    return finalMessage;
}