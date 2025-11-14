import { GoogleGenerativeAI } from '@google/generative-ai';

// @desc    Generate a personalized diet plan
// @route   POST /api/ai/generate-plan
// @access  Private
export const generateDietPlan = async (req, res) => {
  try {
    console.log('=== AI Diet Plan Request ===');
    console.log('Request body:', req.body);
    console.log('GOOGLE_API_KEY exists:', !!process.env.GOOGLE_API_KEY);
    console.log('GOOGLE_API_KEY length:', process.env.GOOGLE_API_KEY?.length || 0);

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY is missing!');
      return res.status(500).json({ 
        message: 'Google API key not configured. Please add GOOGLE_API_KEY to your .env file.' 
      });
    }

    // Initialize the Gemini client
    let genAI;
    try {
      genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      console.log('GoogleGenerativeAI initialized successfully');
    } catch (initError) {
      console.error('Failed to initialize GoogleGenerativeAI:', initError);
      return res.status(500).json({ 
        message: 'Failed to initialize AI client',
        error: initError.message 
      });
    }

    const { 
      age, 
      weight, 
      height, 
      goal,
      bloodPressure,
      bloodSugar,
      cholesterol,
      otherConditions,
      activityLevel,
      dietaryRestrictions
    } = req.body;

    // Validate required fields
    if (!age || !weight || !height || !goal) {
      console.error('Missing required fields:', { age, weight, height, goal });
      return res.status(400).json({ 
        message: 'Missing required fields: age, weight, height, and goal are required.' 
      });
    }

    // 1. Try to list available models first (optional - might not be available)
    console.log('Checking available models...');
    let availableModelNames = [];
    
    try {
      if (typeof genAI.listModels === 'function') {
        const modelsList = await genAI.listModels();
        const models = modelsList.models || [];
        availableModelNames = models
          .filter(m => {
            const name = m.name || '';
            return name.includes('gemini') && 
                   m.supportedGenerationMethods?.includes('generateContent');
          })
          .map(m => {
            // Remove 'models/' prefix if present
            let name = m.name || '';
            if (name.startsWith('models/')) {
              name = name.substring(7);
            }
            return name;
          })
          .filter(name => name); // Remove empty names
        console.log('Available Gemini models:', availableModelNames.length > 0 ? availableModelNames.join(', ') : 'None found');
      } else {
        console.log('listModels() not available, will try common model names');
      }
    } catch (listError) {
      console.warn('Could not list models:', listError.message);
      console.warn('This is okay, we will try common model names');
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    const bmiCategory = bmi < 18.5 ? 'Underweight' : 
                        bmi < 25 ? 'Normal' : 
                        bmi < 30 ? 'Overweight' : 'Obese';

    // 2. Create the comprehensive prompt
    const prompt = `
      You are an expert Sri Lankan nutritionist and dietitian with specialized knowledge in managing medical conditions through diet.

      USER PROFILE:
      - Age: ${age} years
      - Weight: ${weight} kg
      - Height: ${height} cm
      - BMI: ${bmi} (${bmiCategory})
      - Goal: ${goal}
      - Activity Level: ${activityLevel || 'moderate'}

      MEDICAL CONDITIONS:
      - Blood Pressure: ${bloodPressure || 'Not specified'}
      - Blood Sugar Level: ${bloodSugar || 'Not specified'}
      - Cholesterol Level: ${cholesterol || 'Not specified'}
      - Other Conditions: ${otherConditions || 'None'}
      - Dietary Restrictions: ${dietaryRestrictions || 'None'}

      CRITICAL REQUIREMENTS:
      1. Generate a personalized 7-day diet plan using ONLY common, affordable Sri Lankan foods and ingredients.
      2. The plan MUST be medically appropriate for their conditions:
         ${bloodPressure ? `- For Blood Pressure (${bloodPressure}): Include foods that help manage BP (low sodium, potassium-rich foods like gotukola, murunga, etc.)` : ''}
         ${bloodSugar ? `- For Blood Sugar (${bloodSugar}): Include low glycemic index foods, avoid high sugar, use whole grains like kurakkan, brown rice` : ''}
         ${cholesterol ? `- For Cholesterol (${cholesterol}): Include heart-healthy fats, avoid saturated fats, use healthy cooking methods` : ''}
      3. Consider their BMI (${bmi} - ${bmiCategory}) and goal (${goal}).
      4. Respect dietary restrictions: ${dietaryRestrictions || 'None'}
      5. Use traditional Sri Lankan meals: rice, curry, sambol, mallum, etc.
      6. Include portion sizes appropriate for their needs.
      7. Provide specific meal recommendations with Sri Lankan dish names.

      IMPORTANT MEDICAL CONSIDERATIONS:
      - If blood pressure is high: Low sodium, include potassium-rich vegetables (gotukola, murunga, kankun)
      - If blood sugar is high: Low glycemic index foods, avoid refined sugars, use natural sweeteners sparingly
      - If cholesterol is high: Limit saturated fats, include omega-3 rich foods, use healthy cooking oils
      - Always prioritize whole, unprocessed Sri Lankan foods

      Return the plan ONLY as a valid JSON object with no markdown formatting, no code blocks, and no additional text.
      The JSON must have a key "diet_plan" which is an array of exactly 7 day objects.
      Each day object must have:
      - "day" (number): Day number (1-7)
      - "breakfast" (string): Detailed breakfast meal with Sri Lankan dish names
      - "lunch" (string): Detailed lunch meal with Sri Lankan dish names
      - "dinner" (string): Detailed dinner meal with Sri Lankan dish names
      - "snacks" (string): Optional healthy snacks
      - "notes" (string): Important notes about that day's meals, portion sizes, and medical considerations
      - "calories" (number): Estimated total calories for the day

      Example format: {"diet_plan":[{"day":1,"breakfast":"...","lunch":"...","dinner":"...","snacks":"...","notes":"...","calories":1800},{"day":2,...},...]}
    `;

    // 3. Try models until one works (test by actually calling generateContent)
    // Order: Try latest models first (Google updated model names)
    const modelsToTry = [
      'gemini-1.5-flash-latest', // Latest flash model
      'gemini-1.5-pro-latest', // Latest pro model
      'gemini-1.5-flash', // Fallback flash
      'gemini-1.5-pro', // Fallback pro
      'gemini-pro', // Legacy model
      ...availableModelNames, // Try listed models if available
    ];

    console.log('Trying models in order:', modelsToTry.length > 0 ? modelsToTry.join(', ') : 'None found, will try default');
    
    let result, response, text;
    let lastError = null;
    let workingModelName = null;

    // Try models in order
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const testModel = genAI.getGenerativeModel({ model: modelName });
        workingModelName = modelName;
        
        // Actually test the model by making a small call first
        console.log('Testing model with small request...');
        const testResult = await testModel.generateContent('Say "test"');
        const testResponse = testResult.response;
        const testText = testResponse.text();
        
        // If we get here, the model works!
        console.log(`✓ Model ${workingModelName} works! Test response: "${testText}"`);
        console.log('Making actual diet plan request...');
        
        // Now make the actual request
        result = await testModel.generateContent(prompt);
        response = result.response;
        text = response.text();
        console.log('✓ API call successful, response length:', text.length);
        break;
      } catch (modelError) {
        const errorMsg = modelError.message?.substring(0, 200) || modelError.toString();
        console.log(`✗ Model ${modelName} failed:`, errorMsg);
        lastError = modelError;
        continue;
      }
    }

    // If no model worked, try REST API directly as fallback
    if (!text) {
      console.log('SDK models failed, trying REST API directly...');
      try {
        const restModel = 'models/gemini-1.5-flash-latest';
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/${restModel}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }]
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`REST API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          console.log('✓ REST API call successful, response length:', text.length);
          workingModelName = 'gemini-1.5-flash-latest (via REST API)';
        } else {
          throw new Error('No text in REST API response');
        }
      } catch (restError) {
        console.error('REST API also failed:', restError.message);
        const triedModels = modelsToTry.filter(m => m !== null).join(', ');
        throw new Error(
          `No working Gemini model found. Tried SDK models: ${triedModels}, and REST API with gemini-1.5-flash-latest. ` +
          `Last error: ${lastError?.message || restError.message}. ` +
          `Please verify your GOOGLE_API_KEY is valid and has access to Gemini models. ` +
          `You can test your API key at: https://aistudio.google.com/apikey`
        );
      }
    }
    
    // Try to parse JSON response
    let planJson;
    try {
      planJson = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', text);
      // Try to extract JSON from text if it's wrapped
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    res.json(planJson);

  } catch (error) {
    console.error('AI Diet Plan Generation Error:', error);
    console.error('Error Stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to generate AI diet plan', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};