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

    // Check if topic is geography-related for location images
    const isGeography = /geography|country|countries|capital|continent|ocean|river|mountain|city|map|world|nation|place|location/i.test(topic);
    const imageInstruction = isGeography 
      ? "IMPORTANT: Include location/map images for at least 3 questions per round since this is geography-related."
      : "Include relevant image prompts for 2-3 questions per round.";

    const systemPrompt = `You are a fast quiz generator for Class 8-10 students. Generate a complete quiz in valid JSON.

IMPORTANT: Be concise, unique, and fast. Every question must be different.

Output this EXACT JSON structure:
{
  "game_title": "Ultimate Quiz: ${topic}",
  "intro_lines": ["line1", "line2", "line3", "line4", "line5"],
  "host_correct_lines": ["line1", "line2", "line3", "line4", "line5"],
  "host_wrong_lines": ["line1", "line2", "line3", "line4", "line5"],
  "creator_taglines": ["Designed by Aarjit", "Aarjit's Quiz Engine", "Created by Aarjit", "Aarjit's Masterpiece"],
  "ending_message": "Thanks for playing!",
  "rounds": [5 rounds with 10 questions each]
}

Each round: {"round_name": "", "round_type": "normal|gamble|special", "rules_summary": "", "question_grid": [1-10], "questions": [10 questions]}

Each question: {"round_number": 1-5, "question_number": 1-10, "question": "", "options": ["A","B","C","D"], "answer": "exact match to one option", "explanation": "brief", "difficulty": "easy|medium|hard", "image": "${imageInstruction}", "time_limit_host": 30, "time_limit_pass": 10, "used": false, "cool_fact": "short fact"}

ROUNDS: 1-Basics(normal), 2-Advanced(normal), 3-Gamble(gamble), 4-Fun Facts(normal), 5-Special(special-riddles/logic)

RULES: Mix 3 easy, 4 medium, 3 hard per round. All about "${topic}". Return ONLY valid JSON.`;

    console.log("Generating quiz for topic:", topic);

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
          { role: "user", content: `Generate quiz about: ${topic}. Be fast and creative!` }
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      console.error("AI gateway error status:", status);
      
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content received from AI");
    }

    console.log("Received AI response, parsing...");

    // Clean the response
    let cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const quizData = JSON.parse(cleanedContent);
    
    // Quick validation
    if (!quizData.rounds || quizData.rounds.length !== 5) {
      throw new Error("Invalid quiz: must have 5 rounds");
    }

    for (const round of quizData.rounds) {
      if (!round.questions || round.questions.length !== 10) {
        throw new Error(`Round ${round.round_name} must have 10 questions`);
      }
    }

    console.log("Quiz generated successfully!");

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