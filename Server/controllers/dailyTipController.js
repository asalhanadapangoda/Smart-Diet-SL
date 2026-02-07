import DailyTip from '../models/DailyTip.js';

// @desc    Get today's tip
// @route   GET /api/daily-tips/today
// @access  Public
export const getTodayTip = async (req, res) => {
  try {
    const { language, category } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First try with date filter, if no results, get any active tip
    let query = { isActive: true };
    if (category) query.category = category;

    let tips = await DailyTip.find({ ...query, date: { $lte: today } }).sort({ date: -1 });
    
    // If no tips with date filter, get any active tip
    if (tips.length === 0) {
      tips = await DailyTip.find(query).sort({ createdAt: -1 });
    }

    // If still no tips, return a default tip
    if (tips.length === 0) {
      const defaultTip = {
        tip: {
          en: 'Stay hydrated! Drink at least 8 glasses of water daily for optimal health.',
          si: 'ජලය පානය කරන්න! ප්‍රශස්ත සෞඛ්‍යය සඳහා දිනකට අවම වශයෙන් ජලය ග්ලාස් 8 ක් පානය කරන්න.',
          ta: 'நீரேற்றம் செய்யுங்கள்! உகந்த ஆரோக்கியத்திற்காக தினமும் குறைந்தது 8 கிளாஸ் தண்ணீர் குடியுங்கள்.'
        },
        category: 'hydration',
        date: today,
        isActive: true,
        _id: 'default'
      };

      if (language && (language === 'si' || language === 'ta')) {
        return res.json({
          ...defaultTip,
          displayTip: defaultTip.tip[language] || defaultTip.tip.en,
        });
      }

      return res.json(defaultTip);
    }

    // Random tip when ?random=1 (e.g. refresh button), otherwise day-of-year for consistency
    const wantRandom = req.query.random === '1' || req.query.random === 'true';
    const selectedTip = wantRandom
      ? tips[Math.floor(Math.random() * tips.length)]
      : tips[Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24) % tips.length];

    if (language && (language === 'si' || language === 'ta')) {
      const localized = {
        ...selectedTip.toObject(),
        displayTip: selectedTip.tip[language] || selectedTip.tip.en,
      };
      return res.json(localized);
    }

    res.json(selectedTip);
  } catch (error) {
    console.error('Error fetching today tip:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all tips
// @route   GET /api/daily-tips
// @access  Public
export const getDailyTips = async (req, res) => {
  try {
    const { language, category } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const tips = await DailyTip.find(query).sort({ date: -1 });

    if (language && (language === 'si' || language === 'ta')) {
      const localized = tips.map((tip) => ({
        ...tip.toObject(),
        displayTip: tip.tip[language] || tip.tip.en,
      }));
      return res.json(localized);
    }

    res.json(tips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create daily tip
// @route   POST /api/daily-tips
// @access  Private/Admin
export const createDailyTip = async (req, res) => {
  try {
    const tip = new DailyTip(req.body);
    const createdTip = await tip.save();
    res.status(201).json(createdTip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

