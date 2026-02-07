import SriLankanPlate from '../models/SriLankanPlate.js';
import TraditionalFood from '../models/TraditionalFood.js';

// @desc    Generate goal-specific plate
// @route   GET /api/sri-lankan-plates/generate
// @access  Public
export const generatePlate = async (req, res) => {
  try {
    const { goal, calories, language, busyLife } = req.query;
    const targetCalories = parseInt(calories) || 2000;
    const busyLifeOnly = busyLife === 'true';

    // Always generate fresh plate based on user's goal, calories, and busyLife preference
    const plates = await generateNewPlate(goal || 'general-health', targetCalories, busyLifeOnly);
    const selectedPlate = plates[0];

    if (!selectedPlate) {
      return res.status(500).json({ message: 'Could not generate plate' });
    }

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

// Helper function to generate a new plate
const generateNewPlate = async (goal, targetCalories, busyLifeOnly = false) => {
  // Build goal-specific food query
  const baseQuery = { isCommon: true, isAffordable: true };
  let foodQuery = { ...baseQuery };

  if (goal === 'diabetes') {
    // Strict: Low GI foods only (≤55)
    foodQuery = {
      ...baseQuery,
      $or: [
        { 'nutrition.glycemicIndex': { $lte: 55 } },
        { 'nutrition.glycemicIndex': { $exists: false } },
        { 'nutrition.glycemicIndex': 0 },
      ],
    };
  } else if (goal === 'weight-loss') {
    // Lower calorie: under 200 cal per 100g
    foodQuery['nutrition.calories'] = { $lte: 200 };
  } else if (goal === 'weight-gain') {
    // Calorie-dense: over 150 cal per 100g
    foodQuery['nutrition.calories'] = { $gte: 150 };
  }
  // general-health: no extra filters

  if (busyLifeOnly) {
    foodQuery.preparationMethods = { $in: QUICK_PREP_METHODS };
  }

  // Use aggregate with $sample for random selection - ensures different plates each time
  let foodsToUse = await TraditionalFood.aggregate([
    { $match: foodQuery },
    { $sample: { size: 50 } },
  ]);

  // Fallback: if no foods match strict filters, broaden the query
  if (foodsToUse.length < 5) {
    const fallbackQuery = { isCommon: true, isAffordable: true };
    if (busyLifeOnly) {
      fallbackQuery.preparationMethods = { $in: QUICK_PREP_METHODS };
    }
    foodsToUse = await TraditionalFood.aggregate([
      { $match: fallbackQuery },
      { $sample: { size: 50 } },
    ]);
  }

  const goalLabels = {
    diabetes: 'Diabetes-Friendly',
    'weight-loss': 'Weight Loss',
    'weight-gain': 'Weight Gain',
    'general-health': 'General Health',
  };
  const goalDesc = {
    diabetes: 'Plate with low glycemic index foods to help manage blood sugar.',
    'weight-loss': 'Lower calorie plate with high-fiber traditional foods.',
    'weight-gain': 'Calorie-dense plate for healthy weight gain.',
    'general-health': 'Balanced Sri Lankan plate for overall wellness.',
  };

  const plate = {
    name: {
      en: `${goalLabels[goal] || goal} Friendly Plate`,
      si: '',
      ta: '',
    },
    description: {
      en: goalDesc[goal] || 'Personalized Sri Lankan meal plate.',
      si: '',
      ta: '',
    },
    goal,
    items: [],
    totalNutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    },
    isBusyLifeFriendly: busyLifeOnly,
    prepTime: busyLifeOnly ? 20 : 35,
    substitutions: [],
  };

  let currentCalories = 0;
  const selectedFoods = [];

  for (const food of foodsToUse) {
    if (currentCalories >= targetCalories * 0.95) break;

    const remainingCal = targetCalories - currentCalories;
    const portion = calculatePortion(food, remainingCal);
    const nutrition = calculateNutrition(food, portion);

    selectedFoods.push({
      foodId: food._id,
      name: food.name?.en || food.name,
      portion,
      nutrition,
    });

    currentCalories += nutrition.calories;
    plate.totalNutrition.calories += nutrition.calories;
    plate.totalNutrition.protein += nutrition.protein;
    plate.totalNutrition.carbs += nutrition.carbs;
    plate.totalNutrition.fat += nutrition.fat;
    plate.totalNutrition.fiber += nutrition.fiber;
  }

  plate.items = selectedFoods;

  return [plate];
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

