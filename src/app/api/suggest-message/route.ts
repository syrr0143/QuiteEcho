// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { NextResponse } from 'next/server';

// // Create an OpenAI API client
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//     try {
//         const messages = "Create a list of three open-ended and engaging question formatted as a single string. Each question should be separated by the '||'. These questions are for an anonymous social message platform, like Qooh.me, and should be suitable for diverse audience. Avoid personal or sensitive topics, focusing innstead on universal themes that encourages friendly interactions. For exmaple your output should be structured like this: 'What's a hobby you've recently started ? || If you could have dinner with any historical figure, whon would it be ? || What's simple thing that makes you happy ?. Ensure the questions are intriguging, foster curiosity, and contribute to a positive and welcoming conversational environment."

//         // Ask OpenAI for a streaming chat completion given the prompt
//         const response = await openai.completions.create({
//             model: 'gpt-3.5-turbo-instruct',
//             max_tokens:400,
//             stream: true,
//             messages,
//         });

//         // Convert the response into a friendly text-stream
//         const stream = OpenAIStream(response);
//         // Respond with the stream
//         return new StreamingTextResponse(stream);
//     } catch (error) {
//         if (error instanceof OpenAI.APIError) {
//             const { name , status , headers , message  } = error
//             return NextResponse.json({
//                 name, status , headers, message
//             }, {
//                 status
//             })
//         } else {
//             console.error('an unexpected error occured while generating message ', error)
//             throw error
//         }
//     }
// }