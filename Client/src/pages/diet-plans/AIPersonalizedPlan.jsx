import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ProtectedRoute from '../../components/common/ProtectedRoute';

const AIPersonalizedPlan = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goal: 'weight-loss',
    // Medical Conditions
    bloodPressure: '',
    bloodSugar: '',
    cholesterol: '',
    otherConditions: '',
    activityLevel: 'moderate',
    dietaryRestrictions: '',
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  // Calculate BMI
  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    toast.loading('Generating your personal plan... 🤖');

    try {
      const { data } = await api.post('/ai/generate-plan', formData);
      setPlan(data.diet_plan);
      toast.dismiss();
      toast.success('Your plan is ready!');
    } catch (error) {
      toast.dismiss();
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to generate plan';
      console.error('AI Plan Error:', error.response?.data);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">AI Personalized Diet Plan</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Tell us about yourself</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Your Goal</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="weight-loss">Weight Loss</option>
                  <option value="weight-gain">Weight Gain</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="general-health">General Health</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    required
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  required
                  value={formData.height}
                  onChange={handleChange}
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

              {/* Medical Conditions Section */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Medical Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Blood Pressure (mmHg)
                    </label>
                    <input
                      type="text"
                      name="bloodPressure"
                      value={formData.bloodPressure}
                      onChange={handleChange}
                      placeholder="e.g., 120/80 or High/Normal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Blood Sugar Level (mg/dL)
                    </label>
                    <input
                      type="text"
                      name="bloodSugar"
                      value={formData.bloodSugar}
                      onChange={handleChange}
                      placeholder="e.g., 100 or Normal/High"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Cholesterol Level (mg/dL)
                    </label>
                    <input
                      type="text"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      placeholder="e.g., 200 or Normal/High"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Activity Level
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="sedentary">Sedentary (Little or no exercise)</option>
                      <option value="light">Light (Light exercise 1-3 days/week)</option>
                      <option value="moderate">Moderate (Moderate exercise 3-5 days/week)</option>
                      <option value="active">Active (Hard exercise 6-7 days/week)</option>
                      <option value="very-active">Very Active (Very hard exercise, physical job)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Dietary Restrictions
                    </label>
                    <input
                      type="text"
                      name="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={handleChange}
                      placeholder="e.g., Vegetarian, No seafood, Gluten-free"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Other Health Conditions
                    </label>
                    <textarea
                      name="otherConditions"
                      value={formData.otherConditions}
                      onChange={handleChange}
                      rows="2"
                      placeholder="e.g., Heart disease, Kidney issues, Allergies"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate My Plan'}
              </button>
            </form>
          </div>

          {/* Plan Display Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px]">
              <h2 className="text-xl font-semibold mb-4">Your Personalized 7-Day Meal Plan</h2>
              {loading && <div className="text-center py-12">Generating your plan...</div>}
              
              {!loading && !plan && (
                <div className="text-center py-12 text-gray-500">
                  Fill out the form to generate your personalized diet plan.
                </div>
              )}

              {plan && (
                <div className="space-y-6">
                  {plan.map((day) => (
                    <div key={day.day} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-green-700">Day {day.day}</h3>
                        {day.calories && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {day.calories} cal
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm font-semibold text-blue-900 mb-1">🌅 Breakfast</p>
                          <p className="text-sm text-gray-700">{day.breakfast}</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded">
                          <p className="text-sm font-semibold text-yellow-900 mb-1">☀️ Lunch</p>
                          <p className="text-sm text-gray-700">{day.lunch}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded">
                          <p className="text-sm font-semibold text-purple-900 mb-1">🌙 Dinner</p>
                          <p className="text-sm text-gray-700">{day.dinner}</p>
                        </div>
                        {day.snacks && (
                          <div className="bg-orange-50 p-3 rounded">
                            <p className="text-sm font-semibold text-orange-900 mb-1">🍎 Snacks</p>
                            <p className="text-sm text-gray-700">{day.snacks}</p>
                          </div>
                        )}
                        {day.notes && (
                          <div className="bg-gray-50 p-3 rounded border-l-4 border-green-500">
                            <p className="text-sm font-semibold text-gray-900 mb-1">📝 Important Notes</p>
                            <p className="text-sm text-gray-700">{day.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AIPersonalizedPlan;