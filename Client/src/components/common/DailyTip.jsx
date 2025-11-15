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

  const fetchTodayTip = async () => {
    try {
      setLoading(true);
      const params = language !== 'en' ? `?language=${language}` : '';
      const { data } = await api.get(`/daily-tips/today${params}`);
      setTip(data);
    } catch (error) {
      console.error('Failed to fetch tip:', error);
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
      <div className="glass-card border-l-4 border-green-300/50 p-4 rounded-xl backdrop-blur-xl">
        <div className="animate-pulse text-white/80 text-glass">Loading tip...</div>
      </div>
    );
  }

  if (!tip) {
    return null;
  }

  const displayTip = tip.displayTip || tip.tip?.en || tip.tip;

  return (
    <div className="glass-card border-l-4 border-green-300/50 p-4 rounded-xl shadow-sm backdrop-blur-xl">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-2xl">💡</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-white mb-1 text-glass">
            {t('oneChange')}
          </h3>
          <p className="text-sm text-white/90 text-glass">{displayTip}</p>
        </div>
        <button
          onClick={fetchTodayTip}
          className="ml-2 text-white/80 hover:text-white text-sm transition-colors text-glass"
          title="Get another tip"
        >
          ↻
        </button>
      </div>
    </div>
  );
};

export default DailyTip;

