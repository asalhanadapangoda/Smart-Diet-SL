import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const SriLankanPlates = () => {
  const { language, t } = useLanguage();
  const [goal, setGoal] = useState('weight-loss');
  const [calories, setCalories] = useState(2000);
  const [plate, setPlate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busyLifeOnly, setBusyLifeOnly] = useState(false);

  const generatePlate = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('goal', goal);
      params.append('calories', calories);
      if (language !== 'en') params.append('language', language);

      const { data } = await api.get(`/sri-lankan-plates/generate?${params.toString()}`);
      setPlate(data);
    } catch (error) {
      toast.error('Failed to generate plate');
    } finally {
      setLoading(false);
    }
  }, [goal, calories, language]);

  useEffect(() => {
    generatePlate();
  }, [generatePlate]);

  const goals = [
    { value: 'weight-loss', labelKey: 'weightLoss' },
    { value: 'diabetes', labelKey: 'diabetesManagement' },
    { value: 'weight-gain', labelKey: 'weightGain' },
    { value: 'general-health', labelKey: 'generalHealth' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white text-glass text-center">
        {t('generatePlate')}
      </h1>
      <p className="text-white/80 mb-6 text-glass text-center text-lg">
        {t('getPersonalizedPlates')}
      </p>

      <div className="glass-card rounded-2xl p-6 mb-6 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2 text-glass">
              {t('healthGoal')}
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-white focus:outline-none text-glass"
            >
              {goals.map((g) => (
                <option key={g.value} value={g.value} className="bg-gray-800">
                  {t(g.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-2 text-glass">
              {t('targetCalories')}
            </label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(parseInt(e.target.value) || 2000)}
              className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none text-glass"
              min="1000"
              max="4000"
              step="100"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={busyLifeOnly}
                onChange={(e) => setBusyLifeOnly(e.target.checked)}
                className="mr-2 w-5 h-5 rounded glass-input"
              />
              <span className="text-sm text-white/90 text-glass">{t('busyLifeHack')}</span>
            </label>
          </div>
        </div>

        <button
          onClick={generatePlate}
          disabled={loading}
          className="glass-button mt-4 w-full md:w-auto px-6 py-3 text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50 font-medium"
        >
          {loading ? t('generating') : t('generateNewPlate')}
        </button>
      </div>

      {plate && (
        <div className="glass-card rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white text-glass">
              {plate.displayName || plate.name?.en || plate.name}
            </h2>
            {plate.isBusyLifeFriendly && (
              <span className="glass-button bg-blue-400/30 text-blue-200 text-xs px-3 py-1 rounded-full">
                {t('busyLifeHack')}
              </span>
            )}
          </div>

          {plate.displayDescription && (
            <p className="text-white/80 mb-4 text-glass">{plate.displayDescription}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plate Items */}
            <div>
              <h3 className="font-semibold mb-3 text-white text-glass">{t('plateContents')}:</h3>
              <div className="space-y-2">
                {plate.items?.map((item, index) => (
                  <div
                    key={index}
                    className="glass-card bg-white/10 p-3 rounded-xl flex justify-between items-center hover:scale-105 transition-all"
                  >
                    <div>
                      <div className="font-medium text-white text-glass">{item.name}</div>
                      <div className="text-sm text-white/70 text-glass">{item.portion}</div>
                    </div>
                    <div className="text-sm text-white/90 text-glass font-semibold">
                      {Math.round(item.nutrition?.calories || 0)} cal
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Summary */}
            <div>
              <h3 className="font-semibold mb-3 text-white text-glass">{t('nutritionSummary')}:</h3>
              <div className="glass-card bg-green-500/20 p-4 rounded-xl space-y-2 border border-green-300/30">
                <div className="flex justify-between">
                  <span className="text-white/90 text-glass">{t('totalCalories')}:</span>
                  <span className="font-semibold text-green-300 text-glass">
                    {Math.round(plate.totalNutrition?.calories || 0)} cal
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 text-glass">{t('protein')}:</span>
                  <span className="text-white/90 text-glass">{Math.round(plate.totalNutrition?.protein || 0)}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 text-glass">{t('carbs')}:</span>
                  <span className="text-white/90 text-glass">{Math.round(plate.totalNutrition?.carbs || 0)}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 text-glass">{t('fat')}:</span>
                  <span className="text-white/90 text-glass">{Math.round(plate.totalNutrition?.fat || 0)}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 text-glass">{t('fiber')}:</span>
                  <span className="text-white/90 text-glass">{Math.round(plate.totalNutrition?.fiber || 0)}g</span>
                </div>
              </div>

              {plate.substitutions && plate.substitutions.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-white text-glass">{t('suggestedSubstitutions')}:</h4>
                  <ul className="space-y-1 text-sm">
                    {plate.substitutions.map((sub, index) => (
                      <li key={index} className="text-white/80 text-glass">
                        <span className="font-medium">{sub.original}</span> →{' '}
                        <span className="font-medium text-green-300">{sub.substitute}</span>
                        {sub.reason && (
                          <span className="text-white/60 ml-2">({sub.reason})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plate.prepTime > 0 && (
                <div className="mt-4 text-sm text-white/80 text-glass">
                  <span className="font-medium">{t('prepTime')}:</span> {plate.prepTime} {t('minutes')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SriLankanPlates;

