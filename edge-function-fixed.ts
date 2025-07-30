import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const requestBody = await req.json()
    console.log('Received request body:', JSON.stringify(requestBody, null, 2))
    
    const { personaId, coachMessage, messages, conversationHistory } = requestBody

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Handle both parameter names for backward compatibility
    const messageArray = messages || conversationHistory
    
    // Validate that messages array exists
    if (!messageArray || !Array.isArray(messageArray)) {
      console.error('Messages validation failed. Received:', {
        messages: messages,
        conversationHistory: conversationHistory,
        messageArray: messageArray
      })
      throw new Error(`Messages array is required. Received: messages=${!!messages}, conversationHistory=${!!conversationHistory}`)
    }

    console.log('Using message array:', messageArray.length, 'messages')

    // Make request to OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messageArray,
        max_tokens: 300,
        temperature: 0.8,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const openaiData = await openaiResponse.json()
    const generatedResponse = openaiData.choices[0]?.message?.content

    if (!generatedResponse) {
      throw new Error('No response generated from OpenAI')
    }

    console.log('✅ Successfully generated response for persona:', personaId)

    // Return the generated response
    return new Response(
      JSON.stringify({ 
        success: true,
        response: generatedResponse,
        personaId,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to generate response',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})