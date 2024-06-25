import { createClient } from '@/utils/supabase/server';
import 'server-only';

export const runtime = 'edge';

const apiUrl = `${process.env.NEXT_PUBLIC_REMINISC_BASE_API_URL}/v0/memory`;

export async function GET(req: Request) {
 
  const supabase = createClient()
  const userResponse = await supabase.auth.getUser()
  const userId = userResponse.data.user?.id


  if (!userId) {
    console.log('Unauthorized request: No user ID found')
    return new Response('Unauthorized', { status: 401 })
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-reminisc-api-key': `${process.env.REMINISC_API_KEY}`,
    'x-openai-api-key': `${process.env.OPENAI_API_KEY}`,
  };

  try {
    // Retrieve memories from Reminisc API
    const response = await fetch(`${apiUrl}/${userId}`, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 403) {
      console.log('Forbidden: Invalid API key');
      return new Response('Forbidden', { status: 403 });
    }

    const responseJson = await response.json();

    return new Response(JSON.stringify(responseJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during API requests:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}



export async function POST(req: Request) {
  const json = await req.json()
  const { content } = json

  const supabase = createClient()
  const userResponse = await supabase.auth.getUser()
  const userId = userResponse.data.user?.id


  if (!userId) {
    console.log('Unauthorized request: No user ID found')
    return new Response('Unauthorized', { status: 401 })
  }


  const headers = {
    'Content-Type': 'application/json',
    'x-reminisc-api-key': `${process.env.REMINISC_API_KEY}`,
    'x-openai-api-key': `${process.env.OPENAI_API_KEY}`,
  }

  try {
    // Process input through Reminisc API
    const response = await fetch(`${apiUrl}/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        content,
        user_id: userId
      })
    })

    const responseJson = await response.json()

    return new Response(JSON.stringify(responseJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during API requests:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}


export async function PUT(req: Request) {
  const json = await req.json()
  const { memoryId, content } = json

  const supabase = createClient()
  const userResponse = await supabase.auth.getUser()
  const userId = userResponse.data.user?.id


  if (!userId) {
    console.log('Unauthorized request: No user ID found')
    return new Response('Unauthorized', { status: 401 })
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-reminisc-api-key': `${process.env.REMINISC_API_KEY}`,
    'x-openai-api-key': `${process.env.OPENAI_API_KEY}`,
  }

  try {
    const response = await fetch(`${apiUrl}/${memoryId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({
        content,
        user_id: userId
      })
    })

    const responseJson = await response.json()
    return new Response(JSON.stringify(responseJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during API requests:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}


export async function DELETE(req: Request) {
  const json = await req.json()
  const { memoryId } = json
  const supabase = createClient()
  const userResponse = await supabase.auth.getUser()
  const userId = userResponse.data.user?.id


  if (!userId) {
    console.log('Unauthorized request: No user ID found')
    return new Response('Unauthorized', { status: 401 })
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-reminisc-api-key': `${process.env.REMINISC_API_KEY}`,
    'x-openai-api-key': `${process.env.OPENAI_API_KEY}`,
  }

  try {
    const response = await fetch(`${apiUrl}/${memoryId}`, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({
        memory_id: memoryId
      })
    })

    const responseJson = await response.json()

    return new Response(JSON.stringify(responseJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during API requests:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}