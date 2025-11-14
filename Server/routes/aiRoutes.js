import express from 'express';
import { generateDietPlan } from '../controllers/aiController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Test endpoint to check if AI route is working
router.get('/test', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    if (!process.env.GOOGLE_API_KEY) {
      return res.json({ 
        message: 'AI route is working',
        hasApiKey: false,
        error: 'GOOGLE_API_KEY not set in .env file'
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // Try to list models to verify API key (this might not be available in all SDK versions)
    let modelsList = null;
    let listError = null;
    try {
      // Try different ways to list models
      if (typeof genAI.listModels === 'function') {
        modelsList = await genAI.listModels();
      } else {
        listError = 'listModels() method not available in this SDK version';
      }
    } catch (err) {
      listError = err.message;
    }

    // Try different models to see which one works
    const modelsToTest = [
      'gemini-pro', // Most widely available
      'gemini-1.5-pro', // Newer model
      'gemini-1.5-flash', // Faster model
    ];

    let workingModel = null;
    let workingModelName = null;
    let testError = null;

    for (const modelName of modelsToTest) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Say hello');
        const response = result.response;
        const text = response.text();
        
        if (text) {
          workingModel = model;
          workingModelName = modelName;
          console.log(`✓ Model ${modelName} works!`);
          break;
        }
      } catch (err) {
        testError = err.message;
        console.log(`✗ Model ${modelName} failed: ${err.message}`);
        continue;
      }
    }

    res.json({ 
      message: 'AI route is working',
      hasApiKey: true,
      apiKeyLength: process.env.GOOGLE_API_KEY.length,
      apiKeyPreview: process.env.GOOGLE_API_KEY.substring(0, 10) + '...',
      canListModels: !!modelsList,
      availableModels: modelsList?.models?.map(m => m.name) || [],
      workingModel: workingModelName,
      modelWorks: !!workingModel,
      listError: listError,
      testError: testError
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error testing AI setup',
      error: error.message
    });
  }
});

// This route is protected, only logged-in users can access it
router.post('/generate-plan', protect, generateDietPlan);

export default router;
