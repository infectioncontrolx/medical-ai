import { experimental_AssistantResponse } from "ai";
import OpenAI from "openai";
// import languageDetection from 'langdetect'
// import { MessageContentText } from "openai/resources/beta/threads/messages/messages";
import {OpenAIStream,StreamingTextResponse} from "ai"

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});





export const runtime = "edge";

export async function POST(req) {
  // Parse the request body
  const input= await req.json();
  // const language = languageDetection.detect(input.message);

  // // Include language information in message content
  // const messageWithLanguage = {
  //   ...input,
  //   language: language
  // };

  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message
    
  });

  return experimental_AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ threadId, sendMessage }) => {
      // Run the assistant on the thread
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),
        //   instructions: "Please do not give any reference. example (links, source, etc..)"
        // instructions: "Answer without any citations, references, or source attributions. Do not include bracketed text referencing documents, PDFs, or files. Do not use footnotes, superscript numbers, or any form of source indication. Provide only clean, direct answers without mentioning document names or page numbers."
        instructions: "Remove all citation markers from your response. Do not use 【】 brackets or any reference numbers. Answer in plain text only without mentioning sources, documents, or pages. Treat this as a conversation where you provide information directly without academic citations."
          
      });

      console.log({run})
           
      async function waitForRun(run) {
        // Poll for status change
        while (run.status === "queued" || run.status === "in_progress") {
          // delay for 500ms:
          await new Promise((resolve) => setTimeout(resolve, 500));

          run = await openai.beta.threads.runs.retrieve(threadId, run.id,);
        }

        // Check the run status
        if (
          run.status === "cancelled" ||
          run.status === "cancelling" ||
          run.status === "failed" ||
          run.status === "expired"
        ) {
          throw new Error(run.status);
        }
      }

      await waitForRun(run);

      // Get new thread messages (after our message)
      const responseMessages = (
        await openai.beta.threads.messages.list(threadId, {
          after: createdMessage.id,
          order: "asc",
          
         
         
        })
      ).data;
        
   
      // Send the messages
      for (const message of responseMessages) {
    
        sendMessage({
          id: message.id,
          
          role: "assistant",
          
          content: message.content.filter(
            (content) => content.type === "text") 
          
        });
        console.log(message)
      }
    }
  );
}