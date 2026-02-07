import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import SriLankanPlate from '../models/SriLankanPlate.js';
import TraditionalFood from '../models/TraditionalFood.js';

dotenv.config();

let groqClient = null;
try {
  if (process.env.GROQ_API_KEY) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (e) {
  console.warn('GROQ client init failed:', e?.message);
}

// @desc    Generate goal-specific plate
// @route   GET /api/sri-lankan-plates/generate
// @access  Public
export const generatePlate = async (req, res) => {
  try {
    const { goal, calories, language, busyLife } = req.query;
    const targetCalories = parseInt(calories) || 2000;
    const busyLifeOnly = busyLife === 'true';
    const goalVal = goal || 'general-health';

    let selectedPlate = null;

    // Try GROQ AI first for smarter, culturally accurate plate combinations
    if (groqClient) {
      try {
        selectedPlate = await generatePlateWithGroq(goalVal, targetCalories, busyLifeOnly);
      } catch (groqErr) {
        console.warn('GROQ plate generation failed, using rule-based:', groqErr?.message);
      }
    }

    // Fallback to rule-based logic
    if (!selectedPlate) {
      const plates = await generateNewPlate(goalVal, targetCalories, busyLifeOnly);
      selectedPlate = plates[0];
    }

    if (!selectedPlate) {
      return res.status(500).json({ message: 'Could not generate plate' });
    }

    // Scale plate so Total Calories equals Target Calories
    selectedPlate = scalePlateToTargetCalories(selectedPlate, targetCalories);

    // Prevent caching - ensure fresh plate on each request
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    if (language && (language === 'si' || language === 'ta')) {
      const localized = {
        ...selectedPlate,
        displayName: selectedPlate.name?.[language] || selectedPlate.name?.en || selectedPlate.name,
        displayDescription: selectedPlate.description?.[language] || selectedPlate.description?.en || selectedPlate.description || '',
      };
      return res.json(localized);
    }

    res.json(selectedPlate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Quick prep methods for Busy Life Hack
const QUICK_PREP_METHODS = ['Raw', 'Raw salad', 'Boiled', 'Steamed', 'Mallung', 'Brewed', 'Fresh', 'Grated', 'Juice'];

// GROQ AI: Generate plate with smart food pairing
const generatePlateWithGroq = async (goal, targetCalories, busyLifeOnly) => {
  const baseQuery = buildGoalQuery(goal, busyLifeOnly);
  const allFoods = await TraditionalFood.find(baseQuery).limit(80).lean();

  if (allFoods.length < 4) {
    throw new Error('Not enough foods in database');
  }

  const foodList = allFoods
    .map((f) => {
      const name = f.name?.en || f.name || 'Unknown';
      const cal = f.nutrition?.calories || 100;
      const cat = f.category || '';
      return `"${name}" (${cat}, ${cal} cal/100g)`;
    })
    .join('\n');

  const goalContext = {
    diabetes: 'Diabetes management: choose only low-GI foods (glycemic index ≤55). Prioritize vegetables, dhal, fish.',
    'weight-loss': 'Weight loss: prioritize lower-calorie vegetables, lean proteins, smaller rice portions, high-fiber foods.',
    'weight-gain': 'Weight gain: include calorie-dense items like rice, coconut, fish/chicken curry, dhal.',
    'general-health': 'General health: balanced Sri Lankan meal with rice, dhal, 1-2 vegetables, protein, and a sambol or side.',
  };

  const prompt = `You are a Sri Lankan nutrition expert. Create a complete Sri Lankan meal plate.

GOAL: ${goal}
TARGET CALORIES: ${targetCalories}
${goalContext[goal] || goalContext['general-health']}
${busyLifeOnly ? 'BUSY LIFE: Prefer quick-prep foods (boiled, steamed, raw, mallung).' : ''}

AVAILABLE FOODS (use EXACT names only):
${foodList}

Select exactly 4-5 foods that go well together as a traditional Sri Lankan meal. Include: 1 rice/staple, 1 protein (dhal or curry), 1-2 vegetables, optionally a sambol. Distribute portions so total ≈ ${targetCalories} calories.

Respond with ONLY a valid JSON array, no other text:
[{"name": "Exact Food Name", "portionGrams": 100}, ...]`;

  const completion = await groqClient.chat.completions.create({
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 800,
  });

  const content = completion.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty GROQ response');

  let choices = [];
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      choices = JSON.parse(jsonMatch[0]);
    }
  } catch {
    throw new Error('Failed to parse GROQ JSON');
  }

  if (!Array.isArray(choices) || choices.length < 4) {
    throw new Error('GROQ returned invalid selection');
  }

  const nameToFood = new Map();
  allFoods.forEach((f) => {
    const name = (f.name?.en || f.name || '').trim();
    if (name) nameToFood.set(name.toLowerCase(), f);
  });

  const selectedFoods = [];
  for (const c of choices) {
    const name = (c.name || c.food || '').trim();
    if (!name) continue;
    const food = nameToFood.get(name.toLowerCase()) || allFoods.find((f) => (f.name?.en || '').toLowerCase().includes(name.toLowerCase()));
    if (!food) continue;
    const grams = Math.min(500, Math.max(20, parseInt(c.portionGrams || c.portion || 100) || 100));
    const portion = `${grams}g`;
    selectedFoods.push({ food, portion });
  }

  if (selectedFoods.length < 4) throw new Error('Could not match enough foods');

  const goalLabels = {
    diabetes: 'Diabetes-Friendly',
    'weight-loss': 'Weight Loss',
    'weight-gain': 'Weight Gain',
    'general-health': 'General Health',
  };
  const goalDesc = {
    diabetes: 'AI-selected low GI Sri Lankan meal - rice, dhal, vegetables that help manage blood sugar.',
    'weight-loss': 'AI-selected lower-calorie Sri Lankan plate with balanced portions.',
    'weight-gain': 'AI-selected calorie-dense Sri Lankan meal for healthy weight gain.',
    'general-health': 'AI-selected balanced Sri Lankan meal with foods that complement each other.',
  };

  const plate = {
    name: { en: `${goalLabels[goal] || goal} Friendly Plate`, si: '', ta: '' },
    description: { en: goalDesc[goal] || 'AI-optimized Sri Lankan meal.', si: '', ta: '' },
    goal,
    items: [],
    totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    isBusyLifeFriendly: busyLifeOnly,
    prepTime: busyLifeOnly ? 25 : 40,
    substitutions: [],
  };

  for (const { food, portion } of selectedFoods) {
    const nutrition = calculateNutrition(food, portion);
    plate.items.push({
      foodId: food._id,
      name: food.name?.en || food.name,
      portion,
      nutrition,
    });
    plate.totalNutrition.calories += nutrition.calories;
    plate.totalNutrition.protein += nutrition.protein;
    plate.totalNutrition.carbs += nutrition.carbs;
    plate.totalNutrition.fat += nutrition.fat;
    plate.totalNutrition.fiber += nutrition.fiber;
  }

  return plate;
};

// Build base query with goal-specific filters
const buildGoalQuery = (goal, busyLifeOnly) => {
  const baseQuery = { isCommon: true, isAffordable: true };
  let q = { ...baseQuery };

  if (goal === 'diabetes') {
    q = {
      ...baseQuery,
      $or: [
        { 'nutrition.glycemicIndex': { $lte: 55 } },
        { 'nutrition.glycemicIndex': { $exists: false } },
        { 'nutrition.glycemicIndex': 0 },
      ],
    };
  } else if (goal === 'weight-loss') {
    q['nutrition.calories'] = { $lte: 250 };
  } else if (goal === 'weight-gain') {
    q['nutrition.calories'] = { $gte: 100 };
  }
  if (busyLifeOnly) {
    q.preparationMethods = { $in: QUICK_PREP_METHODS };
  }
  return q;
};

// Pick one random item from array
const pickOne = (arr) => (arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null);

// Helper function to generate a new plate - 4-5 foods that go together
const generateNewPlate = async (goal, targetCalories, busyLifeOnly = false) => {
  const baseQuery = buildGoalQuery(goal, busyLifeOnly);

  // Sri Lankan plate structure: Rice + Protein + Vegetable(s) + Optional Sambol/Dish
  // Fetch by category for a balanced meal that matches
  const [riceFoods, proteinFoods, vegetableFoods, dishFoods] = await Promise.all([
    TraditionalFood.aggregate([{ $match: { ...baseQuery, category: 'rice' } }, { $sample: { size: 5 } }]),
    TraditionalFood.aggregate([{ $match: { ...baseQuery, category: 'grains' } }, { $sample: { size: 8 } }]),
    TraditionalFood.aggregate([{ $match: { ...baseQuery, category: 'vegetables' } }, { $sample: { size: 10 } }]),
    TraditionalFood.aggregate([
      { $match: { ...baseQuery, category: { $in: ['proteins', 'other'] } } },
      { $sample: { size: 12 } },
    ]),
  ]);

  // Build a proper meal: 1 rice + 1-2 proteins/grains (dhal, curry) + 1-2 veggies + optional sambol
  const selectedFoods = [];

  // 1. Rice (staple - ~35% of calories)
  const rice = pickOne(riceFoods);
  if (rice) {
    const portion = calculatePortion(rice, targetCalories * 0.35);
    selectedFoods.push({ food: rice, portion });
  }

  // 2. Protein/Dhal (grains or protein dishes - ~25% of calories)
  const dhalCurryPool = [...proteinFoods, ...dishFoods.filter((f) => /dhal|curry|parippu|kadala/i.test(f.name?.en || ''))];
  const protein = pickOne(dhalCurryPool);
  if (protein) {
    const portion = calculatePortion(protein, targetCalories * 0.25);
    selectedFoods.push({ food: protein, portion });
  }

  // 3. Vegetable curry or mallung (~20% of calories)
  const veg1 = pickOne(vegetableFoods);
  if (veg1) {
    const portion = calculatePortion(veg1, targetCalories * 0.2);
    selectedFoods.push({ food: veg1, portion });
  }

  // 4. Second vegetable or protein (fish/chicken) (~15% of calories)
  const veg1Id = veg1?._id?.toString();
  const veg2 = pickOne(vegetableFoods.filter((f) => f._id?.toString() !== veg1Id));
  const meatFishPool = dishFoods.filter((f) => /fish|chicken|egg|mutton|beef|prawn/i.test(f.name?.en || ''));
  const protein2 = pickOne(meatFishPool);
  const fourth = veg2 || protein2;
  if (fourth) {
    const portion = calculatePortion(fourth, targetCalories * 0.15);
    selectedFoods.push({ food: fourth, portion });
  }

  // 5. Sambol or mallung side (~5% of calories)
  const sambolPool = [
    ...dishFoods.filter((f) => /sambol|mallung|lunu miris/i.test(f.name?.en || '')),
    ...vegetableFoods.filter((f) => /mallung|sambol/i.test(f.name?.en || '')),
  ];
  const sambol = pickOne(sambolPool);
  if (sambol) {
    const portion = calculatePortion(sambol, targetCalories * 0.05);
    selectedFoods.push({ food: sambol, portion });
  }

  // Fallback: if we have fewer than 4 items, add more from any category
  const usedIds = new Set(selectedFoods.map((s) => s.food._id?.toString()));
  if (selectedFoods.length < 4) {
    const allPool = [...riceFoods, ...proteinFoods, ...vegetableFoods, ...dishFoods];
    const remaining = Math.max(80, targetCalories * 0.15);
    for (const f of allPool) {
      if (selectedFoods.length >= 5) break;
      if (usedIds.has(f._id?.toString())) continue;
      usedIds.add(f._id?.toString());
      selectedFoods.push({ food: f, portion: calculatePortion(f, remaining) });
    }
  }

  // Ultimate fallback: if still empty, get any matching foods
  if (selectedFoods.length === 0) {
    const anyFoods = await TraditionalFood.aggregate([
      { $match: baseQuery },
      { $sample: { size: 5 } },
    ]);
    const calEach = targetCalories / 5;
    for (const f of anyFoods) {
      selectedFoods.push({ food: f, portion: calculatePortion(f, calEach) });
    }
  }

  const goalLabels = {
    diabetes: 'Diabetes-Friendly',
    'weight-loss': 'Weight Loss',
    'weight-gain': 'Weight Gain',
    'general-health': 'General Health',
  };
  const goalDesc = {
    diabetes: 'Balanced plate with low GI foods - rice, dhal, vegetables that go well together.',
    'weight-loss': 'Lower calorie plate with rice, protein, and vegetables that match.',
    'weight-gain': 'Calorie-dense plate with rice, curry, and sides that complement each other.',
    'general-health': 'Balanced Sri Lankan meal - rice, dhal, vegetables, and sides eaten together.',
  };

  const plate = {
    name: { en: `${goalLabels[goal] || goal} Friendly Plate`, si: '', ta: '' },
    description: { en: goalDesc[goal] || 'Complete meal with 4-5 foods that go well together.', si: '', ta: '' },
    goal,
    items: [],
    totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    isBusyLifeFriendly: busyLifeOnly,
    prepTime: busyLifeOnly ? 25 : 40,
    substitutions: [],
  };

  for (const { food, portion } of selectedFoods) {
    const nutrition = calculateNutrition(food, portion);
    plate.items.push({
      foodId: food._id,
      name: food.name?.en || food.name,
      portion,
      nutrition,
    });
    plate.totalNutrition.calories += nutrition.calories;
    plate.totalNutrition.protein += nutrition.protein;
    plate.totalNutrition.carbs += nutrition.carbs;
    plate.totalNutrition.fat += nutrition.fat;
    plate.totalNutrition.fiber += nutrition.fiber;
  }

  return [plate];
};

// Scale plate portions so total calories equals target
const scalePlateToTargetCalories = (plate, targetCalories) => {
  const currentTotal = plate.totalNutrition?.calories || 0;
  if (currentTotal <= 0 || !plate.items?.length) return plate;

  const scaleFactor = targetCalories / currentTotal;
  plate.totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  for (const item of plate.items) {
    const portionMatch = (item.portion || '').match(/(\d+)/);
    const oldGrams = portionMatch ? parseInt(portionMatch[1], 10) : 100;
    const newGrams = Math.round(oldGrams * scaleFactor);
    const clampedGrams = Math.max(10, Math.min(500, newGrams));
    const itemScale = clampedGrams / oldGrams;

    item.portion = `${clampedGrams}g`;
    item.nutrition = {
      calories: Math.round((item.nutrition?.calories || 0) * itemScale),
      protein: Math.round((item.nutrition?.protein || 0) * itemScale * 10) / 10,
      carbs: Math.round((item.nutrition?.carbs || 0) * itemScale * 10) / 10,
      fat: Math.round((item.nutrition?.fat || 0) * itemScale * 10) / 10,
      fiber: Math.round((item.nutrition?.fiber || 0) * itemScale * 10) / 10,
    };

    plate.totalNutrition.calories += item.nutrition.calories;
    plate.totalNutrition.protein += item.nutrition.protein;
    plate.totalNutrition.carbs += item.nutrition.carbs;
    plate.totalNutrition.fat += item.nutrition.fat;
    plate.totalNutrition.fiber += item.nutrition.fiber;
  }

  // Ensure Total Calories exactly equals Target Calories (adjust for rounding)
  const diff = targetCalories - Math.round(plate.totalNutrition.calories);
  if (diff !== 0 && plate.items.length > 0) {
    plate.items[0].nutrition.calories = Math.max(0, (plate.items[0].nutrition?.calories || 0) + diff);
  }
  plate.totalNutrition.calories = targetCalories;
  return plate;
};

const calculatePortion = (food, remainingCalories) => {
  const caloriesPer100g = food.nutrition.calories || 100;
  const maxGrams = (remainingCalories / caloriesPer100g) * 100;
  return `${Math.round(maxGrams)}g`;
};

const calculateNutrition = (food, portion) => {
  const portionMatch = portion.match(/(\d+)/);
  const grams = portionMatch ? parseInt(portionMatch[1]) : 100;
  const multiplier = grams / 100;

  return {
    calories: (food.nutrition.calories || 0) * multiplier,
    protein: (food.nutrition.protein || 0) * multiplier,
    carbs: (food.nutrition.carbs || 0) * multiplier,
    fat: (food.nutrition.fat || 0) * multiplier,
    fiber: (food.nutrition.fiber || 0) * multiplier,
  };
};

// @desc    Get all plates
// @route   GET /api/sri-lankan-plates
// @access  Public
export const getPlates = async (req, res) => {
  try {
    const { goal, language, busyLife } = req.query;
    const query = {};

    if (goal) query.goal = goal;
    if (busyLife === 'true') query.isBusyLifeFriendly = true;

    const plates = await SriLankanPlate.find(query).sort({ createdAt: -1 });

    if (language && (language === 'si' || language === 'ta')) {
      const localized = plates.map((plate) => ({
        ...plate.toObject(),
        displayName: plate.name[language] || plate.name.en,
        displayDescription: plate.description[language] || plate.description.en,
      }));
      return res.json(localized);
    }

    res.json(plates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create plate
// @route   POST /api/sri-lankan-plates
// @access  Private/Admin
export const createPlate = async (req, res) => {
  try {
    const plate = new SriLankanPlate(req.body);
    const createdPlate = await plate.save();
    res.status(201).json(createdPlate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

