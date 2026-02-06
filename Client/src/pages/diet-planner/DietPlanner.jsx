import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateDietPlan, fetchMyPlans, clearPlan } from '../../features/diet/dietSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

export default function DietPlanner() {
  const dispatch = useDispatch();
  const { loading, error, currentPlan, history } = useSelector(s => s.diet || {});
  const { t } = useLanguage();

  // Debug: Log state changes
  useEffect(() => {
    console.log('Diet state:', { loading, error, currentPlan, hasPlan: !!currentPlan });
  }, [loading, error, currentPlan]);

  const [form, setForm] = useState({
    weight: '',
    height: '',
    age: '',
    bloodPressure: '',
    sugar: '',
    bodyType: '',
    activityLevel: 'moderate'
  });

  // Calculate BMI
  const calculateBMI = () => {
    if (form.weight && form.height) {
      const heightInMeters = parseFloat(form.height) / 100;
      const weightInKg = parseFloat(form.weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        let categoryKey = 'normal';
        if (bmi < 18.5) categoryKey = 'underweight';
        else if (bmi < 25) categoryKey = 'normal';
        else if (bmi < 30) categoryKey = 'overweight';
        else categoryKey = 'obese';
        return { bmi, category: t(categoryKey), categoryKey };
      }
    }
    return null;
  };

  const bmiData = calculateBMI();

  useEffect(() => {
    dispatch(fetchMyPlans());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.weight || !form.height || !form.age) {
      toast.error(t('pleaseFillRequired'));
      return;
    }

    toast.loading(t('generatingPersonalizedPlan') + ' 🤖');
    dispatch(generateDietPlan(form))
      .unwrap()
      .then((data) => {
        toast.dismiss();
        toast.success(t('dietPlanReady'));
        console.log('Diet plan response:', data);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err || t('failedToGeneratePlan'));
        console.error('Diet plan error:', err);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
        {t('aiDietPlanner')}
      </h1>
      <p className="text-gray-700 mb-6 text-glass text-lg">{t('getPersonalizedPlan')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-glass">{t('yourHealthInformation')}</h2>

            {/* Required Fields */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 text-glass">
                {t('weight')} <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                required
                placeholder="e.g., 70"
                className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 text-glass">
                {t('height')} <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                required
                placeholder="e.g., 170"
                className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800 text-glass">
                {t('age')} <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
                placeholder="e.g., 30"
                className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
              />
            </div>

            {/* BMI Display */}
            {bmiData && (
              <div className="glass-card bg-blue-100 border border-blue-300 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800 text-glass">{t('yourBMI')}:</span>
                  <span className={`text-lg font-bold text-glass ${
                    bmiData.categoryKey === 'normal' ? 'text-green-700' :
                    bmiData.categoryKey === 'underweight' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {bmiData.bmi}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 text-glass">
                  {t('category')}: <span className="font-semibold">{bmiData.category}</span>
                </p>
              </div>
            )}

            {/* Medical Information */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-800 text-glass">{t('medicalInformation')}</h3>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800 text-glass">
                  {t('bloodPressure')}
                </label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={form.bloodPressure}
                  onChange={handleChange}
                  placeholder="e.g., 120/80 or High/Normal"
                  className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800 text-glass">
                  {t('bloodSugarLevel')}
                </label>
                <input
                  type="text"
                  name="sugar"
                  value={form.sugar}
                  onChange={handleChange}
                  placeholder="e.g., Normal, Pre-diabetes, Type 2"
                  className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800 text-glass">
                  {t('bodyType')}
                </label>
                <select
                  name="bodyType"
                  value={form.bodyType}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 focus:outline-none text-glass"
                >
                  <option value="" className="bg-white">{t('selectBodyType')}</option>
                  <option value="ectomorph" className="bg-white">{t('ectomorph')}</option>
                  <option value="mesomorph" className="bg-white">{t('mesomorph')}</option>
                  <option value="endomorph" className="bg-white">{t('endomorph')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800 text-glass">
                  {t('activityLevel')}
                </label>
                <select
                  name="activityLevel"
                  value={form.activityLevel}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 focus:outline-none text-glass"
                >
                  <option value="low" className="bg-white">{t('low')}</option>
                  <option value="moderate" className="bg-white">{t('moderate')}</option>
                  <option value="high" className="bg-white">{t('high')}</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="glass-button w-full text-white py-3 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? t('generatingPlan') : t('generateMyDietPlan')}
              </button>
              {currentPlan && (
                <button
                  type="button"
                  onClick={() => dispatch(clearPlan())}
                  className="glass-button w-full mt-2 px-4 py-2 rounded-xl text-white hover:scale-105 transition-all"
                >
                  {t('clearPlan')}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Plan Display Section */}
        <div className="lg:col-span-2">
          {error && (
            <div className="glass-card bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 text-glass">
              {typeof error === 'string' ? error : error?.message || 'An error occurred'}
            </div>
          )}

          {loading && (
            <div className="glass-card rounded-2xl p-8 text-center backdrop-blur-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-700 text-glass">{t('generatingPersonalizedPlan')}</p>
            </div>
          )}

          {!loading && currentPlan && (
            <div className="glass-card rounded-2xl p-6 mb-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                  {t('yourPersonalizedPlan')}
                </h2>
                <span className="text-sm text-gray-600 text-glass">{t('planId')}: {currentPlan.planId || 'N/A'}</span>
              </div>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans glass-card bg-gray-50 p-4 rounded-xl text-glass border border-gray-200">
                  {currentPlan.planText || JSON.stringify(currentPlan, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {!loading && !currentPlan && (
            <div className="glass-card rounded-2xl p-8 text-center backdrop-blur-xl">
              <p className="text-gray-700 text-glass">{t('fillFormToGenerate')}</p>
            </div>
          )}

          {/* Previous Plans */}
          {history && history.length > 0 && (
            <div className="glass-card rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 text-glass">{t('previousPlans')}</h3>
              <div className="space-y-4">
                {history.map((plan) => (
                  <div key={plan._id} className="glass-card border border-gray-200 rounded-xl p-4 hover:scale-105 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 text-glass">
                        {t('created')}: {new Date(plan.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-3 text-glass">
                      {plan.planText.substring(0, 200)}...
                    </div>
                    <button
                      onClick={() => {
                        dispatch(clearPlan());
                        setTimeout(() => {
                          dispatch(generateDietPlan(plan.input));
                        }, 100);
                      }}
                      className="mt-2 text-sm text-green-600 hover:text-green-700 transition-colors text-glass font-medium"
                    >
                      {t('viewFullPlan')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
