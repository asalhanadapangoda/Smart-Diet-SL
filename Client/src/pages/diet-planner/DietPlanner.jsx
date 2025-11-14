import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateDietPlan, fetchMyPlans, clearPlan } from '../../features/diet/dietSlice';
import toast from 'react-hot-toast';

export default function DietPlanner() {
  const dispatch = useDispatch();
  const { loading, error, currentPlan, history } = useSelector(s => s.diet || {});

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
        const bmiCategory = bmi < 18.5 ? 'Underweight' : 
                          bmi < 25 ? 'Normal' : 
                          bmi < 30 ? 'Overweight' : 'Obese';
        return { bmi, category: bmiCategory };
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
      toast.error('Please fill in Weight, Height, and Age (required fields)');
      return;
    }

    toast.loading('Generating your personalized diet plan... 🤖');
    dispatch(generateDietPlan(form))
      .unwrap()
      .then((data) => {
        toast.dismiss();
        toast.success('Your diet plan is ready!');
        console.log('Diet plan response:', data);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err || 'Failed to generate diet plan');
        console.error('Diet plan error:', err);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-green-700">AI Diet Planner</h1>
      <p className="text-gray-600 mb-6">Get a personalized 7-day diet plan based on your health profile</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Your Health Information</h2>

            {/* Required Fields */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                required
                placeholder="e.g., 70"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                required
                placeholder="e.g., 170"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                required
                placeholder="e.g., 30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* BMI Display */}
            {bmiData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Your BMI:</span>
                  <span className={`text-lg font-bold ${
                    bmiData.category === 'Normal' ? 'text-green-600' :
                    bmiData.category === 'Underweight' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {bmiData.bmi}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Category: <span className="font-semibold">{bmiData.category}</span>
                </p>
              </div>
            )}

            {/* Medical Information */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Medical Information</h3>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={form.bloodPressure}
                  onChange={handleChange}
                  placeholder="e.g., 120/80 or High/Normal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Blood Sugar Level / Diabetes
                </label>
                <input
                  type="text"
                  name="sugar"
                  value={form.sugar}
                  onChange={handleChange}
                  placeholder="e.g., Normal, Pre-diabetes, Type 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Body Type
                </label>
                <select
                  name="bodyType"
                  value={form.bodyType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select body type</option>
                  <option value="ectomorph">Ectomorph (Naturally thin, fast metabolism)</option>
                  <option value="mesomorph">Mesomorph (Naturally athletic, balanced)</option>
                  <option value="endomorph">Endomorph (Naturally stocky, slower metabolism)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Activity Level
                </label>
                <select
                  name="activityLevel"
                  value={form.activityLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Low (Little or no exercise)</option>
                  <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
                  <option value="high">High (Exercise 6-7 days/week)</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating Plan...' : 'Generate My Diet Plan'}
              </button>
              {currentPlan && (
                <button
                  type="button"
                  onClick={() => dispatch(clearPlan())}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Clear Plan
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Plan Display Section */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {typeof error === 'string' ? error : error?.message || 'An error occurred'}
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your personalized diet plan...</p>
            </div>
          )}

          {!loading && currentPlan && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-green-700">Your Personalized 7-Day Diet Plan</h2>
                <span className="text-sm text-gray-500">Plan ID: {currentPlan.planId || 'N/A'}</span>
              </div>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-gray-50 p-4 rounded border">
                  {currentPlan.planText || JSON.stringify(currentPlan, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {!loading && !currentPlan && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Fill out the form to generate your personalized diet plan.</p>
            </div>
          )}

          {/* Previous Plans */}
          {history && history.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Previous Plans</h3>
              <div className="space-y-4">
                {history.map((plan) => (
                  <div key={plan._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Created: {new Date(plan.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-3">
                      {plan.planText.substring(0, 200)}...
                    </div>
                    <button
                      onClick={() => {
                        dispatch(clearPlan());
                        setTimeout(() => {
                          dispatch(generateDietPlan(plan.input));
                        }, 100);
                      }}
                      className="mt-2 text-sm text-green-600 hover:text-green-700"
                    >
                      View Full Plan
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
