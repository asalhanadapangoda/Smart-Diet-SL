import { Link } from 'react-router-dom';
import DailyTip from '../../components/common/DailyTip';
import Chatbot from '../../components/common/Chatbot';
import { useLanguage } from '../../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="glass-card rounded-3xl p-12 max-w-4xl mx-auto backdrop-blur-xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-emerald-100 to-green-100 bg-clip-text text-transparent text-glass">
              {t('welcome')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 text-glass">
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
                className="glass-button text-white px-8 py-4 rounded-xl font-semibold hover:scale-110 transition-all text-lg border-2 border-white/30"
              >
                {t('dietPlans')}
              </Link>
              <Link
                to="/sri-lankan-plates"
                className="glass-button text-white px-8 py-4 rounded-xl font-semibold hover:scale-110 transition-all text-lg border-2 border-white/30"
              >
                {t('generatePlate')}
              </Link>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="glass-card rounded-2xl p-6">
                <DailyTip />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white text-glass">
            {t('whyChooseUs')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/calculator"
              className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer block"
            >
              <div className="text-5xl mb-4 transform hover:scale-110 transition-transform">📊</div>
              <h3 className="text-2xl font-semibold mb-3 text-white text-glass">{t('nutritionCalculator')}</h3>
              <p className="text-white/80 text-glass">
                {t('calculateNutritionIntake')}
              </p>
            </Link>
            <Link
              to="/diet-plans"
              className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer block"
            >
              <div className="text-5xl mb-4 transform hover:scale-110 transition-transform">📋</div>
              <h3 className="text-2xl font-semibold mb-3 text-white text-glass">{t('dietPlans')}</h3>
              <p className="text-white/80 text-glass">
                {t('followPersonalizedPlans')}
              </p>
            </Link>
            <Link
              to="/products"
              className="glass-card p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer block"
            >
              <div className="text-5xl mb-4 transform hover:scale-110 transition-transform">🛒</div>
              <h3 className="text-2xl font-semibold mb-3 text-white text-glass">{t('products')}</h3>
              <p className="text-white/80 text-glass">
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

