import 'server-only'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

const apiUrl = `${process.env.REMINISC_BASE_API_URL}/v0/memory`

export async function DELETE(req: Request) {
  const json = await req.json()
  const { memoryId } = json

  // const supabase = createClient()
  // const userResponse = await supabase.auth.getUser()
  // const userId = userResponse.data.user?.id
  const userId = 'advait'

  console.log('Received POST request')
  console.log('User ID:', userId)
  console.log('User input:', memoryId)

  if (!userId) {
    console.log('Unauthorized request: No user ID found')
    return new Response('Unauthorized', { status: 401 })
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-OPENAI-API-KEY': `${process.env.OPENAI_API_KEY}`,
    'X-REMINISC-API-KEY': `${process.env.REMINISC_API_KEY}`,
  }

  try {
    // Process input through Reminisc API
    const response = await fetch(`${apiUrl}/${memoryId}`, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({
        memory_id: memoryId
      })
    })

    const responseJson = await response.json()

    console.log('Response output:', responseJson)

    return new Response(JSON.stringify(responseJson), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error during API requests:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}