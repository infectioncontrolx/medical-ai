import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Enable Edge Functions in Vercel
export const runtime = "edge";

// Post a new message and stream OpenAI Assistant response
// export async function POST(request) {
//     // 1. Parse the message from the POST request
//     const newMessage = await request.json();

//     // 2. Create OpenAI client
//     const openai = new OpenAI();

//     // 3. Thread Handling
//     // - If no thread ID, create a new OpenAI thread
//     if (newMessage.threadId == null) {
//         const thread = await openai.beta.threads.create();
//         newMessage.threadId = thread.id;
//     }

//     // 4. Add new message to thread
//     await openai.beta.threads.messages.create(
//         newMessage.threadId,
//         {
//             role: "user",
//             content: newMessage.content,
            
//         }
//     );

//     // 5. Create and Stream Run
//     const stream = await openai.beta.threads.runs.create(
//         newMessage.threadId,
//         { 
//             assistant_id: newMessage.assistantId, 
//             stream: true, 
//             instructions: `
//             Instructions:
// 1. Identify and remove all reference markers matching the pattern: 【number:number†source】
//    - Example:  ,  
// 2. These markers always:
//    - Start with: 【
//    - End with: 】
//    - Contain: two numbers separated by a colon and followed by †source
// 3. Remove the entire marker including the brackets.
// 4. Do not alter any other part of the text.
// 5. Do not leave extra spaces or punctuation behind after removal.
// 6. Apply this removal globally across the entire text.

//             `
//         },
//     );

//     // 6. Return response with the stream
//     return new Response(stream.toReadableStream());
// }

export async function POST(request) {
    // 1. Parse the message from the POST request
    const newMessage = await request.json();

    // ✅ Remove all source reference markers from the user input
    // newMessage.content = newMessage.content.replace(/【\d+:\d+†source】/g, '');

    // 2. Create OpenAI client
    const openai = new OpenAI();

    // 3. Thread Handling
    if (newMessage.threadId == null) {
        const thread = await openai.beta.threads.create();
        newMessage.threadId = thread.id;
    }

//       await openai.beta.threads.messages.create(
//     newMessage.threadId,
//     {
//       role: "system",
//       content: `
// Instructions:
// 1. Identify and remove all reference markers matching the pattern: 【number:number†source】
//    - Example:  ,  
// 2. These markers always:
//    - Start with: 【
//    - End with: 】
//    - Contain: two numbers separated by a colon and followed by †source
// 3. Remove the entire marker including the brackets.
// 4. Do not alter any other part of the text.
// 5. Do not leave extra spaces or punctuation behind after removal.
// 6. Apply this removal globally across the entire text.
//       `.trim()
//     }
//   );


    // 4. Add new message to thread
    await openai.beta.threads.messages.create(
        newMessage.threadId,
        {
            role: "user",
            content: newMessage.content,
        },
        
    );
    
    // 5. Create and Stream Run
    const stream = await openai.beta.threads.runs.create(
        newMessage.threadId,
        { 
            assistant_id: newMessage.assistantId, 
            stream: true , 
            instructions: 'Identify and remove all reference markers matching the pattern: 【number:number†source】'
        },
    );

    // 6. Return response with the stream
    return new Response(stream.toReadableStream());
}
