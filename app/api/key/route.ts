import { createClient } from '@/utils/supabase/server';
import 'server-only';

export const runtime = 'edge';

const apiUrl = `${process.env.NEXT_PUBLIC_REMINISC_BASE_API_URL}/v0/key`;

export async function GET(req: Request) {
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();
  const userId = userResponse.data.user?.id;

  if (!userId) {
    console.log('Unauthorized request: No user ID found');
    return new Response('Unauthorized', { status: 401 });
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-REMINISC-MASTER-PASSWORD': `${process.env.REMINISC_MASTER_PASSWORD}`,
  };

  try {
    const response = await fetch(`${apiUrl}/${userId}`, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 403) {
      console.log('Forbidden: Invalid master password');
      return new Response('Forbidden', { status: 403 });
    }

    const responseJson = await response.json();

    return new Response(JSON.stringify(responseJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during API request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}


export async function POST(req: Request) {
  const json = await req.json();
  const { name } = json;

  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();
  const userId = userResponse.data.user?.id;
  const email = userResponse.data.user?.email;

  if (!userId) {
    console.log('Unauthorized request: No user ID found');
    return new Response('Unauthorized', { status: 401 });
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-REMINISC-MASTER-PASSWORD': `${process.env.REMINISC_MASTER_PASSWORD}`,
  };

  try {
    const response = await fetch(`${apiUrl}/create`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ email, name, user_id: userId }),
    });

    if (response.status === 403) {
      console.log('Forbidden: Invalid master password');
      return new Response('Forbidden', { status: 403 });
    }

    const responseJson = await response.json();

    return new Response(JSON.stringify(responseJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during API request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  const json = await req.json();
  const { apiKeyId, name } = json;

  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();
  const userId = userResponse.data.user?.id;

  if (!userId) {
    console.log('Unauthorized request: No user ID found');
    return new Response('Unauthorized', { status: 401 });
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-REMINISC-MASTER-PASSWORD': `${process.env.REMINISC_MASTER_PASSWORD}`,
  };

  try {
    const response = await fetch(`${apiUrl}/update`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ api_key_id: apiKeyId, name }),
    });

    if (response.status === 403) {
      console.log('Forbidden: Invalid master password');
      return new Response('Forbidden', { status: 403 });
    }

    const responseJson = await response.json();

    return new Response(JSON.stringify(responseJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during API request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const json = await req.json();
  const { apiKeyId } = json;

  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();
  const userId = userResponse.data.user?.id;

  if (!userId) {
    console.log('Unauthorized request: No user ID found');
    return new Response('Unauthorized', { status: 401 });
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-REMINISC-MASTER-PASSWORD': `${process.env.REMINISC_MASTER_PASSWORD}`,
  };

  try {
    const response = await fetch(`${apiUrl}/delete/${apiKeyId}`, {
      method: 'DELETE',
      headers: headers,
    });

    if (response.status === 403) {
      console.log('Forbidden: Invalid master password');
      return new Response('Forbidden', { status: 403 });
    }

    const responseJson = await response.json();

    return new Response(JSON.stringify(responseJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during API request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}