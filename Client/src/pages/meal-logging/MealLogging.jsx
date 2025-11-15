import { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const MealLogging = () => {
  const { language, t } = useLanguage();
  const [mealType, setMealType] = useState('breakfast');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [recognizedItems, setRecognizedItems] = useState([]);
  const [manualItems, setManualItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Simulate image recognition (in production, this would call an AI service)
      simulateImageRecognition(file);
    }
  };

  const simulateImageRecognition = (file) => {
    // This is a placeholder - in production, you'd call an image recognition API
    setTimeout(() => {
      const mockRecognitions = [
        { name: 'Rice & Fish Curry', confidence: 0.85, estimatedPortion: 'Medium portion' },
        { name: 'Dhal', confidence: 0.75, estimatedPortion: '1 cup' },
      ];
      setRecognizedItems(mockRecognitions);
      toast.success(t('mealRecognized'));
    }, 1000);
  };

  const addManualItem = () => {
    setManualItems([
      ...manualItems,
      {
        name: '',
        portion: '',
        calories: 0,
      },
    ]);
  };

  const updateManualItem = (index, field, value) => {
    const updated = [...manualItems];
    updated[index][field] = value;
    setManualItems(updated);
  };

  const removeManualItem = (index) => {
    setManualItems(manualItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image && manualItems.length === 0) {
      toast.error(t('pleaseAddImageOrItems'));
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      if (image) formData.append('image', image);
      formData.append('mealType', mealType);
      formData.append('recognizedItems', JSON.stringify(recognizedItems));
      formData.append('manualItems', JSON.stringify(manualItems));
      formData.append('notes', notes);

      await api.post('/meal-logs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(t('mealLoggedSuccess'));
      
      // Reset form
      setImage(null);
      setImagePreview(null);
      setImageUrl(null);
      setRecognizedItems([]);
      setManualItems([]);
      setNotes('');
    } catch (error) {
      toast.error(error.response?.data?.message || t('failedToLogMeal'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white text-glass text-center">
        {t('logMeal')}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-6 space-y-6 backdrop-blur-xl">
          {/* Meal Type */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2 text-glass">
              {t('mealType')}
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-white focus:outline-none text-glass"
            >
              <option value="breakfast" className="bg-gray-800">{t('breakfast')}</option>
              <option value="lunch" className="bg-gray-800">{t('lunch')}</option>
              <option value="dinner" className="bg-gray-800">{t('dinner')}</option>
              <option value="snack" className="bg-gray-800">{t('snack')}</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2 text-glass">
              {t('takePhoto')}
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Meal preview"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    setImageUrl(null);
                    setRecognizedItems([]);
                  }}
                  className="absolute top-2 right-2 glass-button bg-red-500/30 text-white px-3 py-1 rounded-xl hover:scale-105"
                >
                  {t('remove')}
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:glass-button file:text-white hover:file:scale-105 cursor-pointer"
                />
                <p className="mt-1 text-xs text-white/60 text-glass">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}

            {/* Recognized Items */}
            {recognizedItems.length > 0 && (
              <div className="mt-4 p-4 glass-card bg-blue-500/20 rounded-xl border border-blue-300/30">
                <h3 className="font-semibold mb-2 text-white text-glass">{t('recognizedItems')}:</h3>
                <ul className="space-y-2">
                  {recognizedItems.map((item, index) => (
                    <li key={index} className="text-sm text-white/90 text-glass">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-white/70 ml-2">
                        ({item.estimatedPortion}, {Math.round(item.confidence * 100)}% {t('confidence')})
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-white/60 mt-2 text-glass">
                  {t('pleaseVerify')}
                </p>
              </div>
            )}
          </div>

          {/* Manual Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-white/90 text-glass">
                {t('addItemsManually')}
              </label>
              <button
                type="button"
                onClick={addManualItem}
                className="text-sm text-green-300 hover:text-green-200 transition-colors text-glass"
              >
                {t('addItem')}
              </button>
            </div>
            {manualItems.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={t('foodName')}
                  value={item.name}
                  onChange={(e) => updateManualItem(index, 'name', e.target.value)}
                  className="flex-1 glass-input px-3 py-2 rounded-xl text-white placeholder-white/60 text-sm"
                />
                <input
                  type="text"
                  placeholder={t('portion')}
                  value={item.portion}
                  onChange={(e) => updateManualItem(index, 'portion', e.target.value)}
                  className="w-24 glass-input px-3 py-2 rounded-xl text-white placeholder-white/60 text-sm"
                />
                <input
                  type="number"
                  placeholder={t('calories')}
                  value={item.calories}
                  onChange={(e) => updateManualItem(index, 'calories', parseInt(e.target.value) || 0)}
                  className="w-24 glass-input px-3 py-2 rounded-xl text-white placeholder-white/60 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeManualItem(index)}
                  className="px-3 py-2 glass-button bg-red-500/30 text-red-200 rounded-xl text-sm hover:scale-105"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2 text-glass">
              {t('notesOptional')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none text-glass resize-none"
              placeholder={t('additionalNotes')}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full text-white py-3 px-4 rounded-xl hover:scale-105 transition-all disabled:opacity-50 font-medium"
          >
            {loading ? t('logging') : t('logMeal')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MealLogging;

