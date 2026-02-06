import { Link } from 'react-router-dom';
import DailyTip from '../../components/common/DailyTip';
import Chatbot from '../../components/common/Chatbot';
import { useLanguage } from '../../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="glass-card rounded-3xl p-12 max-w-4xl mx-auto backdrop-blur-xl bg-white/95">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 bg-clip-text text-transparent text-glass drop-shadow-lg">
              {t('welcome')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-800 font-medium text-glass">
              {t('trustedAdvisor')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                to="/calculator"
                className="glass-button text-white px-8 py-4 rounded-xl font-semibold hover:scale-110 transition-all text-lg shadow-lg"
              >
                {t('calculateNutrition')}
              </Link>
              <Link
                to="/diet-plans"
                className="glass-button text-white px-8 py-4 rounded-xl font-semibold hover:scale-110 transition-all text-lg"
              >
                {t('dietPlans')}
              </Link>
              <Link
                to="/sri-lankan-plates"
                className="glass-button text-white px-8 py-4 rounded-xl font-semibold hover:scale-110 transition-all text-lg"
              >
                {t('generatePlate')}
              </Link>
            </div>
            <div className="max-w-2xl mx-auto">
              <DailyTip />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800 text-glass">
            {t('whyChooseUs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/calculator"
              className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer block"
            >
              <div className="text-5xl mb-4 transform hover:scale-110 transition-transform">📊</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 text-glass">{t('nutritionCalculator')}</h3>
              <p className="text-gray-600 text-glass">
                {t('calculateNutritionIntake')}
              </p>
            </Link>
            <Link
              to="/diet-plans"
              className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer block"
            >
              <div className="text-5xl mb-4 transform hover:scale-110 transition-transform">📋</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 text-glass">{t('dietPlans')}</h3>
              <p className="text-gray-600 text-glass">
                {t('followPersonalizedPlans')}
              </p>
            </Link>
            <Link
              to="/products"
              className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer block"
            >
              <div className="text-5xl mb-4 transform hover:scale-110 transition-transform">🛒</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800 text-glass">{t('products')}</h3>
              <p className="text-gray-600 text-glass">
                {t('browseProducts')}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot - Fixed position bottom right */}
      <Chatbot />
    </div>
  );
};

export default Home;

