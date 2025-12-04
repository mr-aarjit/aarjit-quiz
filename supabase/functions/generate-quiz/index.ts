import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a quiz generator for a classroom competition for Class 8-10 students. Generate a complete quiz dataset in valid JSON format.

IMPORTANT: Generate unique, diverse questions every time. Never repeat questions. Use creativity and variety.

The quiz must have EXACTLY this structure:
{
  "game_title": "Ultimate Quiz: [Topic]",
  "intro_lines": [5 motivational lines about the topic],
  "host_correct_lines": [5 congratulatory phrases],
  "host_wrong_lines": [5 encouraging phrases for wrong answers],
  "creator_taglines": [4 taglines crediting "Aarjit"],
  "rounds": [
    {
      "round_name": "Round Name",
      "round_type": "normal" | "gamble" | "special",
      "rules_summary": "Brief rules",
      "question_grid": [1,2,3,4,5,6,7,8,9,10],
      "questions": [array of 10 questions]
    }
  ],
  "ending_message": "Closing message"
}

Each question MUST have:
{
  "round_number": number (1-5),
  "question_number": number (1-10),
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "answer": "Correct option (must match exactly one option)",
  "explanation": "Simple explanation for students",
  "difficulty": "easy" | "medium" | "hard",
  "image": "AI image prompt or empty string",
  "time_limit_host": 30,
  "time_limit_pass": 10,
  "used": false,
  "cool_fact": "Interesting fact related to the answer"
}

ROUNDS MUST BE:
1. Round 1: "${topic} Basics" (round_type: "normal") - Easy/medium questions
2. Round 2: "${topic} Advanced" (round_type: "normal") - Medium questions  
3. Round 3: "${topic} Gamble" (round_type: "gamble") - Mixed difficulty, risky!
4. Round 4: "${topic} Extra Bits" (round_type: "normal") - Fun facts and trivia
5. Round 5: "${topic} Special" (round_type: "special") - Riddles, logic, visual questions

RULES:
- Questions MUST be appropriate for Class 8-10 students
- Mix difficulties: 3 easy, 4 medium, 3 hard per round
- At least 2-3 questions per round should have "image" field with AI prompt
- All questions MUST be about "${topic}"
- Make questions interesting, educational, and competitive
- Ensure variety in question types and topics within the theme

Return ONLY valid JSON, no markdown formatting, no code blocks.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a complete quiz about: ${topic}. Make sure all 5 rounds have 10 unique questions each. Be creative and educational!` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content received from AI");
    }

    // Clean the response - remove any markdown formatting
    let cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse and validate the JSON
    const quizData = JSON.parse(cleanedContent);
    
    // Validate structure
    if (!quizData.rounds || quizData.rounds.length !== 5) {
      throw new Error("Invalid quiz structure: must have exactly 5 rounds");
    }

    for (const round of quizData.rounds) {
      if (!round.questions || round.questions.length !== 10) {
        throw new Error(`Invalid round: ${round.round_name} must have exactly 10 questions`);
      }
    }

    return new Response(JSON.stringify(quizData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate quiz" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
