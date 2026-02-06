import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const Calculator = () => {
  const { language, t } = useLanguage();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await api.get('/traditional-foods');
        setFoods(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) => {
    const name = food.name?.[language] || food.name?.en || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const addFood = (food) => {
    if (!selectedFoods.find((f) => f._id === food._id)) {
      setSelectedFoods([...selectedFoods, food]);
      const defaultAmount = food.servingSize?.amount || 100;
      setQuantities({ ...quantities, [food._id]: defaultAmount });
    }
  };

  const removeFood = (foodId) => {
    setSelectedFoods(selectedFoods.filter((f) => f._id !== foodId));
    const newQuantities = { ...quantities };
    delete newQuantities[foodId];
    setQuantities(newQuantities);
  };

  const updateQuantity = (foodId, quantity) => {
    setQuantities({ ...quantities, [foodId]: parseFloat(quantity) || 0 });
  };

  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    selectedFoods.forEach((food) => {
      const quantity = quantities[food._id] || 0;
      const servingSize = food.servingSize?.amount || 100;
      const multiplier = quantity / servingSize; // Convert to per serving basis

      totalCalories += (food.nutrition?.calories || 0) * multiplier;
      totalProtein += (food.nutrition?.protein || 0) * multiplier;
      totalCarbs += (food.nutrition?.carbs || 0) * multiplier;
      totalFat += (food.nutrition?.fat || 0) * multiplier;
      totalFiber += (food.nutrition?.fiber || 0) * multiplier;
    });

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
    };
  };

  const nutrition = calculateNutrition();

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800 text-glass text-center">
        {t('nutritionCalculator')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Food Selection */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 mb-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-glass">{t('addTraditionalFoods')}</h2>
            <input
              type="text"
              placeholder={t('searchFoods')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass mb-4"
            />
            {loading ? (
              <div className="text-center py-8 text-gray-600 text-glass">{t('loadingFoods')}</div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredFoods.map((food) => {
                  const foodName = food.name?.[language] || food.name?.en || 'Unknown';
                  return (
                    <div
                      key={food._id}
                      className="glass-card flex items-center justify-between p-3 rounded-xl hover:scale-105 transition-all"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-glass">{foodName}</h3>
                        <p className="text-sm text-gray-600 text-glass">
                          {food.nutrition?.calories || 0} cal per {food.servingSize?.amount || 100}{food.servingSize?.unit || 'g'}
                        </p>
                      </div>
                      <button
                        onClick={() => addFood(food)}
                        disabled={selectedFoods.find((f) => f._id === food._id)}
                        className="glass-button text-white px-4 py-2 rounded-xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {selectedFoods.find((f) => f._id === food._id)
                          ? t('added')
                          : t('add')}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Foods */}
          <div className="glass-card rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-glass">{t('selectedFoods')}</h2>
            {selectedFoods.length === 0 ? (
              <p className="text-gray-600 text-glass">{t('noFoodsSelected')}</p>
            ) : (
              <div className="space-y-4">
                {selectedFoods.map((food) => {
                  const foodName = food.name?.[language] || food.name?.en || 'Unknown';
                  const unit = food.servingSize?.unit || 'g';
                  return (
                    <div
                      key={food._id}
                      className="glass-card flex items-center justify-between p-4 rounded-xl hover:scale-105 transition-all"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-glass">{foodName}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <label className="text-sm text-gray-600 text-glass">{t('quantity')} ({unit})</label>
                          <input
                            type="number"
                            value={quantities[food._id] || 0}
                            onChange={(e) => updateQuantity(food._id, e.target.value)}
                            className="glass-input w-24 px-2 py-1 rounded-xl ml-2 text-gray-800 text-sm"
                            min="0"
                          />
                        </div>
                        <button
                          onClick={() => removeFood(food._id)}
                          className="text-red-600 hover:text-red-700 transition-colors text-glass font-medium"
                        >
                          {t('remove')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Nutrition Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 sticky top-4 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-glass">{t('nutritionSummary')}</h2>
            <div className="space-y-4">
              <div className="glass-card p-4 bg-green-100 rounded-xl border border-green-300">
                <div className="text-sm text-gray-700 text-glass">{t('calories')}</div>
                <div className="text-2xl font-bold text-green-700 text-glass">{nutrition.calories}</div>
              </div>
              <div className="glass-card p-4 bg-blue-100 rounded-xl border border-blue-300">
                <div className="text-sm text-gray-700 text-glass">{t('protein')}</div>
                <div className="text-2xl font-bold text-blue-700 text-glass">{nutrition.protein}g</div>
              </div>
              <div className="glass-card p-4 bg-yellow-100 rounded-xl border border-yellow-300">
                <div className="text-sm text-gray-700 text-glass">{t('carbohydrates')}</div>
                <div className="text-2xl font-bold text-yellow-700 text-glass">{nutrition.carbs}g</div>
              </div>
              <div className="glass-card p-4 bg-orange-100 rounded-xl border border-orange-300">
                <div className="text-sm text-gray-700 text-glass">{t('fat')}</div>
                <div className="text-2xl font-bold text-orange-700 text-glass">{nutrition.fat}g</div>
              </div>
              <div className="glass-card p-4 bg-purple-100 rounded-xl border border-purple-300">
                <div className="text-sm text-gray-700 text-glass">{t('fiber')}</div>
                <div className="text-2xl font-bold text-purple-700 text-glass">{nutrition.fiber}g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;

