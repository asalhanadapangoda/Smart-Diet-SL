import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const DailyTip = () => {
  const { language, t } = useLanguage();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayTip();
  }, [language]);

  const fetchTodayTip = async (random = true) => {
    try {
      setLoading(true);
      const search = new URLSearchParams();
      if (language !== 'en') search.set('language', language);
      if (random) search.set('random', '1');
      const params = search.toString() ? `?${search}` : '';
      const { data } = await api.get(`/daily-tips/today${params}`);
      setTip(data);
    } catch (error) {
      // Only log in development, suppress in production
      if (import.meta.env.DEV) {
        console.error('Failed to fetch tip:', error);
      }
      // Set a default tip if API fails
      setTip({
        tip: {
          en: 'Stay hydrated! Drink at least 8 glasses of water daily for optimal health.',
          si: 'ජලය පානය කරන්න! ප්‍රශස්ත සෞඛ්‍යය සඳහා දිනකට අවම වශයෙන් ජලය වීදුරු 8 ක් පානය කරන්න.',
          ta: 'நீரேற்றம் செய்யுங்கள்! உகந்த ஆரோக்கியத்திற்காக தினமும் குறைந்தது 8 கிளாஸ் தண்ணீர் குடியுங்கள்.'
        },
        displayTip: language === 'si' 
          ? 'ජලය පානය කරන්න! ප්‍රශස්ත සෞඛ්‍යය සඳහා දිනකට අවම වශයෙන් ජලය වීදුරු 8 ක් පානය කරන්න.'
          : language === 'ta'
          ? 'நீரேற்றம் செய்யுங்கள்! உகந்த ஆரோக்கியத்திற்காக தினமும் குறைந்தது 8 கிளாஸ் தண்ணீர் குடியுங்கள்.'
          : 'Stay hydrated! Drink at least 8 glasses of water daily for optimal health.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card border-l-4 border-green-500 p-4 rounded-xl backdrop-blur-xl bg-green-50/80">
        <div className="animate-pulse text-gray-600 text-glass">Loading tip...</div>
      </div>
    );
  }

  if (!tip) {
    return null;
  }

  const displayTip = tip.displayTip || tip.tip?.en || tip.tip;

  return (
    <div className="glass-card border-l-4 border-green-500 p-5 rounded-xl shadow-lg backdrop-blur-xl bg-green-50/90">
      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0">
          <span className="text-3xl" aria-hidden="true">💡</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="w-8 flex-shrink-0" />
            <h3 className="text-base font-bold text-green-800 text-glass text-center flex-1">
              {t('oneChange')}
            </h3>
            <button
              onClick={() => fetchTodayTip(true)}
              className="w-8 flex-shrink-0 text-green-600 hover:text-green-700 text-lg transition-colors text-glass font-bold p-1 rounded hover:bg-green-100"
              title="Get another tip"
              type="button"
            >
              ↻
            </button>
          </div>
          <p className="text-sm md:text-base text-gray-800 leading-relaxed text-glass font-medium">{displayTip}</p>
        </div>
      </div>
    </div>
  );
};

export default DailyTip;

