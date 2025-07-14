import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image, prompt, type } = await req.json()
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    let systemPrompt = ''
    if (type === 'diagnosis') {
      systemPrompt = "Analyze this crop/plant image for diseases, pests, or health issues. Provide a JSON response with: disease (name), confidence (0-100), severity (Low/Medium/High), treatment (detailed steps), prevention (preventive measures). If healthy, indicate 'Healthy Plant'."
    } else {
      systemPrompt = "You are an agricultural expert AI assistant. Provide helpful advice about farming, crops, diseases, and agricultural practices. Keep responses concise and practical."
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: image ? [
            { text: systemPrompt + (prompt ? ` User question: ${prompt}` : '') },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: image
              }
            }
          ] : [
            { text: systemPrompt + ` User question: ${prompt}` }
          ]
        }]
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      throw new Error('No response from AI')
    }

    return new Response(
      JSON.stringify({ content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})