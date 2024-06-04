import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Define types for the request body
interface ChatRequest {
  input: string;
}


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const json: ChatRequest = await req.json();

    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${process.env.REMINISC_BASE_API_URL}/chat`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(json),
    });

    if (!response.body) {
      throw new Error("No response body from FastAPI");
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
