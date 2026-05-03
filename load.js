import {FaissStore} from "@langchain/community/vectorstores/faiss";
import {AzureChatOpenAI, AzureOpenAIEmbeddings} from "@langchain/openai";
import { createAgent } from "langchain";


const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
});

const vectorStore = await FaissStore.load("./documents", embeddings);
console.log("✅ vector store loaded!")

// Now you can use the vector store to answer questions about Beyond Good and Evil. For example:
const prompt = "Who is Pey'j?"
const model = new AzureChatOpenAI({ temperature: 0.2 });
const relevantDocs = await vectorStore.similaritySearch(prompt);
const context = relevantDocs.map(doc => doc.pageContent).join("\n\n")
const agent = createAgent({
    model,
    systemPrompt: "You are a beyond good and evil lore expert",
});

const result = await agent.invoke({
    messages: [{ role: "user", content: `With this text ${context} give me an answer to this ${prompt}` }],
});
console.log(result.messages.at(-1).content)
