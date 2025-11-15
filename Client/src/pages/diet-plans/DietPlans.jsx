import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DietPlans = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchDietPlans();
  }, [category]);

  const fetchDietPlans = async () => {
    try {
      setLoading(true);
      const params = category ? `?category=${category}` : '';
      const { data } = await api.get(`/diet-plans${params}`);
      setDietPlans(data);
    } catch (error) {
      toast.error('Failed to fetch diet plans');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'all',
    'weight-loss',
    'weight-gain',
    'diabetic',
    'vegetarian',
    'general',
    'athletic',
  ];

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white text-glass text-center">
        Recommended Diet Plans
      </h1>

      {/* Category Filter */}
      <div className="mb-8">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value === 'all' ? '' : e.target.value)}
          className="glass-input px-6 py-3 rounded-xl text-white focus:outline-none text-glass"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === 'all' ? '' : cat} className="bg-gray-800">
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-white text-glass text-xl">Loading diet plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dietPlans.map((plan) => (
            <div
              key={plan._id}
              className="glass-card rounded-2xl overflow-hidden group"
            >
              {plan.image && (
                <div className="relative overflow-hidden">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white text-glass">{plan.title}</h3>
                  <span className="glass-button bg-green-400/30 text-green-200 text-xs px-3 py-1 rounded-full">
                    {plan.category}
                  </span>
                </div>
                <p className="text-white/80 mb-4 line-clamp-3 text-glass">{plan.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70 text-glass">Duration:</span>
                    <span className="font-semibold text-white text-glass">{plan.duration} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70 text-glass">Total Calories:</span>
                    <span className="font-semibold text-white text-glass">{plan.totalCalories} cal</span>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <h4 className="font-semibold mb-2 text-white text-glass">Meals:</h4>
                  <div className="space-y-1 text-sm">
                    {plan.meals.breakfast && (
                      <div className="text-white/80 text-glass">
                        <span className="font-medium">Breakfast:</span>{' '}
                        {plan.meals.breakfast.name}
                      </div>
                    )}
                    {plan.meals.lunch && (
                      <div className="text-white/80 text-glass">
                        <span className="font-medium">Lunch:</span> {plan.meals.lunch.name}
                      </div>
                    )}
                    {plan.meals.dinner && (
                      <div className="text-white/80 text-glass">
                        <span className="font-medium">Dinner:</span> {plan.meals.dinner.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && dietPlans.length === 0 && (
        <p className="text-center text-white/80 py-12 text-glass text-xl">No diet plans available</p>
      )}
    </div>
  );
};

export default DietPlans;

