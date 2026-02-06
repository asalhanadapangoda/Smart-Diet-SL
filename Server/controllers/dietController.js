// Server/controllers/dietController.js
import dotenv from 'dotenv';
dotenv.config();
import DietPlan from '../models/DietPlan.js';

// Free AI API using Hugging Face Inference API (no API key required for public models)
// Optionally use HUGGINGFACE_API_KEY for better rate limits (free token from https://huggingface.co/settings/tokens)
async function generateWithHuggingFace(prompt) {
  const apiKey = process.env.HUGGINGFACE_API_KEY || ''; // Optional, works without it but with rate limits
  
  // Using a simpler, more reliable model that's widely available
  // Try different models in order of preference
  const models = [
    process.env.HUGGINGFACE_MODEL,
    'gpt2', // Simple, reliable model
    'distilgpt2', // Smaller, faster version
    'google/flan-t5-base' // Good for instruction following
  ].filter(Boolean); // Remove undefined values
  
  const model = models[0] || 'gpt2';
  
  // Try the new router endpoint first, fallback to old format
  const endpoints = [
    `https://api-inference.huggingface.co/models/${model}`,
    `https://hf-inference.com/models/${model}`
  ];

  // Try different endpoints and models
  let lastError = null;

  for (const apiUrl of endpoints) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt + 1} for ${apiUrl}...`);
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retry
        }

        console.log(`Trying endpoint: ${apiUrl}`);

        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.7,
            return_full_text: false,
            top_p: 0.9,
            do_sample: true
          }
        })
      });

        // Handle 503 (model loading) - retry
        if (response.status === 503) {
          const errorData = await response.json().catch(() => ({ error: 'Model is loading' }));
          if (attempt < 1) {
            console.log('Model is loading, will retry...');
            lastError = new Error('Model is loading, please wait');
            continue;
          }
          // Try next endpoint
          break;
        }

        if (!response.ok) {
          const errorData = await response.text();
          console.log(`Endpoint ${apiUrl} failed: ${response.status}`);
          lastError = new Error(`API error: ${response.status} - ${errorData.substring(0, 200)}`);
          // Try next endpoint
          break;
        }

        const data = await response.json();
        
        // Handle different response formats
        if (Array.isArray(data) && data[0]?.generated_text) {
          console.log('✓ Successfully generated plan using:', apiUrl);
          return data[0].generated_text.trim();
        } else if (data.generated_text) {
          console.log('✓ Successfully generated plan using:', apiUrl);
          return data.generated_text.trim();
        } else if (typeof data === 'string') {
          console.log('✓ Successfully generated plan using:', apiUrl);
          return data.trim();
        } else if (Array.isArray(data) && data[0]?.summary_text) {
          console.log('✓ Successfully generated plan using:', apiUrl);
          return data[0].summary_text.trim();
        } else {
          console.error('Unexpected response format:', JSON.stringify(data, null, 2));
          lastError = new Error('Unexpected response format from API');
          break; // Try next endpoint
        }
      } catch (error) {
        console.error(`Error with endpoint ${apiUrl}:`, error.message);
        lastError = error;
        // Continue to next endpoint
      }
    }
  }

  // If all endpoints failed, throw the last error
  throw lastError || new Error('Failed to generate response from all endpoints');
}

// Fallback function to generate a basic diet plan template
function generateBasicDietPlan(input, bmi, bmiCategory) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sriLankanMeals = {
    breakfast: ['Rice and curry with dhal', 'String hoppers with curry', 'Hoppers with sambol', 'Roti with curry', 'Rice and fish curry', 'Kottu roti', 'Rice and chicken curry'],
    lunch: ['Rice with 3 curries (vegetable, dhal, fish)', 'Rice with chicken curry and mallum', 'Rice with fish curry and gotukola sambol', 'Rice with vegetable curry and papadam', 'Rice with beef curry and salad', 'Rice with prawn curry and mallum', 'Rice with egg curry and vegetables'],
    dinner: ['Rice with light curry', 'Soup with bread', 'Rice with vegetable curry', 'Rice with fish curry', 'Rice with chicken curry', 'Rice with dhal curry', 'Rice with mixed vegetables']
  };

  let plan = `7-Day Personalized Diet Plan for Sri Lankan Cuisine\n`;
  plan += `========================================\n\n`;
  plan += `User Profile:\n`;
  plan += `- Age: ${input.age} years\n`;
  plan += `- Weight: ${input.weight} kg\n`;
  plan += `- Height: ${input.height} cm\n`;
  plan += `- BMI: ${bmi} (${bmiCategory})\n`;
  if (input.bloodPressure) plan += `- Blood Pressure: ${input.bloodPressure}\n`;
  if (input.sugar) plan += `- Blood Sugar: ${input.sugar}\n`;
  plan += `\n`;

  days.forEach((day, index) => {
    plan += `\n${day} (Day ${index + 1}):\n`;
    plan += `Breakfast: ${sriLankanMeals.breakfast[index % sriLankanMeals.breakfast.length]}\n`;
    plan += `Mid-morning Snack: Fresh fruit (papaya, banana, or apple)\n`;
    plan += `Lunch: ${sriLankanMeals.lunch[index % sriLankanMeals.lunch.length]}\n`;
    plan += `Afternoon Snack: A handful of nuts or a cup of green tea\n`;
    plan += `Dinner: ${sriLankanMeals.dinner[index % sriLankanMeals.dinner.length]}\n`;
    plan += `Water Intake: 2-3 liters throughout the day\n`;
    
    if (input.bloodPressure && input.bloodPressure.toLowerCase().includes('high')) {
      plan += `Notes: Low sodium options. Include potassium-rich vegetables like gotukola and murunga.\n`;
    }
    if (input.sugar && (input.sugar.toLowerCase().includes('high') || input.sugar.toLowerCase().includes('diabetes'))) {
      plan += `Notes: Use whole grains (brown rice, kurakkan). Avoid refined sugars.\n`;
    }
  });

  plan += `\n\nGeneral Lifestyle Tips:\n`;
  plan += `- Drink 2-3 liters of water daily\n`;
  plan += `- Take a 30-minute walk daily\n`;
  plan += `- Eat meals at regular times\n`;
  plan += `- Control portion sizes\n`;
  plan += `- Include fresh vegetables in every meal\n`;
  plan += `\nImportant: This is a general plan. Consult with a healthcare professional for personalized medical advice.\n`;

  return plan;
}

function buildPrompt(input) {
  // Calculate BMI
  const heightInMeters = input.height / 100;
  const bmi = (input.weight / (heightInMeters * heightInMeters)).toFixed(1);
  const bmiCategory = bmi < 18.5 ? 'Underweight' : 
                      bmi < 25 ? 'Normal' : 
                      bmi < 30 ? 'Overweight' : 'Obese';

  return `
You are an expert Sri Lankan nutritionist and dietitian with specialized knowledge in managing medical conditions through diet.

USER PROFILE:
- Age: ${input.age} years
- Weight: ${input.weight} kg
- Height: ${input.height} cm
- BMI: ${bmi} (${bmiCategory})
- Body Type: ${input.bodyType || 'Not specified'}
- Activity Level: ${input.activityLevel || 'moderate'}

MEDICAL CONDITIONS:
- Blood Pressure: ${input.bloodPressure || 'Not specified'}
- Blood Sugar Level / Diabetes: ${input.sugar || 'Not specified'}

CRITICAL REQUIREMENTS:
1. Generate a personalized 7-day diet plan using ONLY common, affordable Sri Lankan foods and ingredients.
2. The plan MUST be medically appropriate for their conditions:
   ${input.bloodPressure ? `- For Blood Pressure (${input.bloodPressure}): Include foods that help manage BP (low sodium, potassium-rich foods like gotukola, murunga, kankun, etc.)` : ''}
   ${input.sugar ? `- For Blood Sugar (${input.sugar}): Include low glycemic index foods, avoid high sugar, use whole grains like kurakkan, brown rice, avoid refined sugars` : ''}
3. Consider their BMI (${bmi} - ${bmiCategory}) and body type (${input.bodyType || 'Not specified'}).
4. Use traditional Sri Lankan meals: rice, curry, sambol, mallum, etc.
5. Include portion sizes appropriate for their needs.
6. Provide specific meal recommendations with Sri Lankan dish names.

IMPORTANT MEDICAL CONSIDERATIONS:
- If blood pressure is high: Low sodium, include potassium-rich vegetables (gotukola, murunga, kankun)
- If blood sugar is high or diabetes: Low glycemic index foods, avoid refined sugars, use natural sweeteners sparingly, include whole grains
- Always prioritize whole, unprocessed Sri Lankan foods
- Include water intake recommendations (2-3 liters per day)
- Add simple lifestyle tips (walking, portion control, meal timing)

FORMAT:
For each of the 7 days, provide:
- Day X (e.g., Day 1, Day 2, etc.)
- Breakfast: [Meal name and description with portion size]
- Mid-morning Snack: [Healthy snack option]
- Lunch: [Meal name and description with portion size]
- Afternoon Snack: [Healthy snack option]
- Dinner: [Meal name and description with portion size]
- Water Intake: [Recommended amount]
- Notes: [Any specific considerations for that day]

At the end, include:
- General Lifestyle Tips
- Important Reminders (consult healthcare professional if needed)

Format output as clear, readable text with day headings and organized sections. Use Sri Lankan food names and measurements.
`;
}

export const generateDietPlan = async (req, res) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { weight, height, age, bloodPressure, sugar, bodyType, activityLevel } = req.body;

    // Validate required fields
    if (!weight || !height || !age) {
      return res.status(400).json({ error: 'weight, height and age are required' });
    }

    const input = { weight, height, age, bloodPressure, sugar, bodyType, activityLevel };
    
    // Calculate BMI for fallback
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    const bmiCategory = bmi < 18.5 ? 'Underweight' : 
                        bmi < 25 ? 'Normal' : 
                        bmi < 30 ? 'Overweight' : 'Obese';

    const prompt = buildPrompt(input);

    console.log('Generating diet plan for user:', userId);
    console.log('Input data:', input);

    // Use free Hugging Face API with fallback
    let planText;
    try {
      planText = await generateWithHuggingFace(prompt);
    } catch (aiError) {
      console.error('AI generation failed, using template fallback:', aiError.message);
      // Fallback: Generate a basic diet plan template
      planText = generateBasicDietPlan(input, bmi, bmiCategory);
    }

    if (!planText || planText === 'No plan generated') {
      return res.status(500).json({ error: 'Failed to generate diet plan content' });
    }

    const created = await DietPlan.create({
      type: 'user',
      isActive: false,
      user: userId,
      input,
      planText,
      metadata: { 
        model: process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',
        provider: 'huggingface'
      }
    });

    console.log('Diet plan created successfully:', created._id);

    res.json({ planId: created._id, planText });
  } catch (err) {
    console.error('generateDietPlan error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data
    });

    // Provide more specific error messages
    let errorMessage = 'Failed to generate diet plan';
    
    if (err.message?.includes('Hugging Face')) {
      errorMessage = err.message;
    } else if (err.message?.includes('429') || err.message?.includes('rate limit')) {
      errorMessage = 'API rate limit exceeded. Please wait a moment and try again.';
    } else if (err.message?.includes('503') || err.message?.includes('loading')) {
      errorMessage = 'AI model is loading. Please wait 10-20 seconds and try again.';
    } else if (err.message) {
      errorMessage = err.message;
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const getUserPlans = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const plans = await DietPlan.find({ user: userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    console.error('getUserPlans error:', err);
    res.status(500).json({ error: 'Failed to fetch diet plans' });
  }
};
