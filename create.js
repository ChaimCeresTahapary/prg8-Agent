import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { AzureOpenAIEmbeddings, AzureChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const files = [
    './public/originals/gameinfo.txt',
    './public/originals/settinginfo.txt',
    './public/originals/synopsis.txt'
]
const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 1000, chunkOverlap: 200 });

const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
});

// const vectorStore = new MemoryVectorStore(embeddings);
const vectorStore = new FaissStore(embeddings, {});
for (const file of files) {
    const loader = new TextLoader(file);
    const docs = await loader.load();
    const chunks = await textSplitter.splitDocuments(docs);
    await vectorStore.addDocuments(chunks);
}

const model = new AzureChatOpenAI({temperature: 0.2})
const agent = createAgent({
    model,
    systemPrompt: "You are a beyond good and evil lore expert that talks in secret and is very careful with the information you give. You can only answer questions about the game based on the retrieved information, if you don't know the answer, say you don't know.",
});

const prompt = "Who is jade and what is this game about?"
const relevantDocs = await vectorStore.similaritySearch(prompt);
const context = relevantDocs.map(doc => doc.pageContent).join("\n\n")

const result = await agent.invoke({
    messages: [{ role: "user", content: `With this text ${context} give me an answer to this ${prompt}` }],
});
await vectorStore.save("./documents");
console.log(result.messages.at(-1).content)
console.log("✅ vector store saved!")