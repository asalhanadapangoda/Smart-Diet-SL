import MealLog from '../models/MealLog.js';
import TraditionalFood from '../models/TraditionalFood.js';
import cloudinary from '../config/cloudinary.js';

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const parseJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const uploadBufferToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result?.secure_url || '');
      }
    );

    uploadStream.end(file.buffer);
  });

// @desc    Create meal log
// @route   POST /api/meal-logs
// @access  Private
export const createMealLog = async (req, res) => {
  try {
    const { mealType, image, recognizedItems, manualItems, notes } = req.body;
    const parsedRecognizedItems = parseJsonArray(recognizedItems);
    const parsedManualItems = parseJsonArray(manualItems);
    let imageUrl = image || '';

    if (req.file) {
      if (!hasCloudinaryConfig) {
        return res.status(400).json({
          message: 'Cloudinary not configured. Please add Cloudinary credentials to .env file',
        });
      }
      imageUrl = await uploadBufferToCloudinary(req.file, 'smart-diet-sl/meal-logs');
    }

    // Calculate total nutrition from manual items
    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    if (parsedManualItems.length > 0) {
      for (const item of parsedManualItems) {
        if (item.foodId) {
          const food = await TraditionalFood.findById(item.foodId);
          if (food) {
            totalNutrition.calories += food.nutrition.calories || 0;
            totalNutrition.protein += food.nutrition.protein || 0;
            totalNutrition.carbs += food.nutrition.carbs || 0;
            totalNutrition.fat += food.nutrition.fat || 0;
            totalNutrition.fiber += food.nutrition.fiber || 0;
          }
        } else if (item.calories) {
          totalNutrition.calories += item.calories || 0;
          totalNutrition.protein += item.protein || 0;
          totalNutrition.carbs += item.carbs || 0;
          totalNutrition.fat += item.fat || 0;
          totalNutrition.fiber += item.fiber || 0;
        }
      }
    }

    const mealLog = new MealLog({
      user: req.user.id,
      mealType,
      image: imageUrl,
      recognizedItems: parsedRecognizedItems,
      manualItems: parsedManualItems,
      totalNutrition,
      notes,
    });

    const createdLog = await mealLog.save();
    res.status(201).json(createdLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user meal logs
// @route   GET /api/meal-logs
// @access  Private
export const getUserMealLogs = async (req, res) => {
  try {
    const { date, mealType } = req.query;
    const query = { user: req.user.id };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (mealType) query.mealType = mealType;

    const logs = await MealLog.find(query).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get meal log statistics
// @route   GET /api/meal-logs/stats
// @access  Private
export const getMealLogStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default to last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query.date = { $gte: sevenDaysAgo };
    }

    const logs = await MealLog.find(query);

    const stats = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      mealCount: logs.length,
      byMealType: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snack: 0,
      },
    };

    logs.forEach((log) => {
      stats.totalCalories += log.totalNutrition.calories || 0;
      stats.totalProtein += log.totalNutrition.protein || 0;
      stats.totalCarbs += log.totalNutrition.carbs || 0;
      stats.totalFat += log.totalNutrition.fat || 0;
      stats.totalFiber += log.totalNutrition.fiber || 0;
      stats.byMealType[log.mealType] = (stats.byMealType[log.mealType] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

