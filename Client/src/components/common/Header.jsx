import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { language, changeLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
  };

  return (
    <header className="glass-dark text-white sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold flex items-center text-glass hover:scale-105 transition-transform duration-300">
            <span className="text-2xl md:text-3xl">🥗</span>
            <span className="ml-2 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">Smart Diet SL</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Main Links */}
            <Link
              to="/"
              className="px-3 py-2 rounded-lg glass-button text-sm font-medium text-white hover:scale-105"
            >
              {t('home')}
            </Link>
            <Link
              to="/diet-plans"
              className="px-3 py-2 rounded-lg glass-button text-sm font-medium text-white hover:scale-105"
            >
              {t('dietPlans')}
            </Link>
            <Link
              to="/products"
              className="px-3 py-2 rounded-lg glass-button text-sm font-medium text-white hover:scale-105"
            >
              {t('products')}
            </Link>
            {isAuthenticated && (
              <Link
                to="/diet-planner"
                className="px-3 py-2 rounded-lg glass-button text-sm font-semibold text-white hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600"
              >
                {t('aiDietPlanner')}
              </Link>
            )}

            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg glass-button text-sm font-medium flex items-center text-white hover:scale-105">
                {t('tools')}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 glass-card rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 bg-white/95">
                <div className="py-2">
                  <Link
                    to="/calculator"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-green-50 rounded-lg mx-2 transition-all"
                    onClick={() => setToolsMenuOpen(false)}
                  >
                    {t('calculator')}
                  </Link>
                  <Link
                    to="/sri-lankan-plates"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-green-50 rounded-lg mx-2 transition-all"
                    onClick={() => setToolsMenuOpen(false)}
                  >
                    {t('generatePlate')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-1 border-l border-white/20 pl-3 ml-2">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  language === 'en'
                    ? 'glass-button bg-white/30 text-white shadow-lg scale-105'
                    : 'glass-button text-white/80 hover:text-white hover:scale-105'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('si')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  language === 'si'
                    ? 'glass-button bg-white/30 text-white shadow-lg scale-105'
                    : 'glass-button text-white/80 hover:text-white hover:scale-105'
                }`}
                title="සිංහල"
              >
                සිං
              </button>
              <button
                onClick={() => changeLanguage('ta')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  language === 'ta'
                    ? 'glass-button bg-white/30 text-white shadow-lg scale-105'
                    : 'glass-button text-white/80 hover:text-white hover:scale-105'
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
            </div>

            {/* User Menu / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 border-l border-white/20 pl-3 ml-2">
                {/* Cart Link */}
                <Link 
                  to="/cart" 
                  className="px-3 py-2 rounded-lg glass-button text-sm font-medium relative text-white hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                {/* User Dropdown */}
                <div className="relative group">
                  <button className="px-3 py-2 rounded-lg glass-button text-sm font-medium flex items-center text-white hover:scale-105">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {user?.name?.split(' ')[0] || 'Account'}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 bg-white/95">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-green-50 rounded-lg mx-2 transition-all"
                      >
                        {t('profile')}
                      </Link>
                      <Link
                        to="/meal-logging"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-green-50 rounded-lg mx-2 transition-all"
                      >
                        {t('logMeal')}
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-green-50 rounded-lg mx-2 transition-all"
                      >
                        {t('myOrders')}
                      </Link>
                      {/* Admin Link - Only show if user is admin */}
                      {user?.role === 'admin' && (
                        <>
                          <hr className="my-2 border-gray-200 mx-2" />
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg mx-2 font-semibold transition-all"
                          >
                            {t('adminDashboard')}
                          </Link>
                        </>
                      )}
                      <hr className="my-2 border-gray-200 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mx-2 transition-all"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-white/20 pl-3 ml-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-lg glass-button text-sm font-medium text-white hover:scale-105"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg glass-button bg-white/30 text-white hover:bg-white/40 text-sm font-medium hover:scale-105"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg glass-button text-white hover:scale-105 transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4 glass-card rounded-xl p-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                to="/diet-plans"
                className="px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('dietPlans')}
              </Link>
              <Link
                to="/products"
                className="px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('products')}
              </Link>
              {isAuthenticated && (
                <Link
                  to="/diet-planner"
                  className="px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition font-semibold bg-gradient-to-r from-green-500 to-emerald-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('aiDietPlanner')}
                </Link>
              )}

              {/* Mobile Tools Section */}
              <div>
                <button
                  onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                  className="w-full text-left px-3 py-2 rounded-lg glass-button text-white transition flex items-center justify-between hover:scale-105"
                >
                  <span>{t('tools')}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      toolsMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {toolsMenuOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    <Link
                      to="/calculator"
                      className="block px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setToolsMenuOpen(false);
                      }}
                    >
                      {t('calculator')}
                    </Link>
                    <Link
                      to="/sri-lankan-plates"
                      className="block px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setToolsMenuOpen(false);
                      }}
                    >
                      {t('generatePlate')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Language Switcher */}
              <div className="flex items-center space-x-2 pt-2 border-t border-white/20">
                <span className="px-3 py-2 text-sm text-white/80">{t('language')}:</span>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    language === 'en'
                      ? 'glass-button bg-white/30 text-white shadow-lg scale-105'
                      : 'glass-button text-white/80 hover:text-white hover:scale-105'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('si')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    language === 'si'
                      ? 'glass-button bg-white/30 text-white shadow-lg scale-105'
                      : 'glass-button text-white/80 hover:text-white hover:scale-105'
                  }`}
                >
                  සිං
                </button>
                <button
                  onClick={() => changeLanguage('ta')}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    language === 'ta'
                      ? 'glass-button bg-white/30 text-white shadow-lg scale-105'
                      : 'glass-button text-white/80 hover:text-white hover:scale-105'
                  }`}
                >
                  தமிழ்
                </button>
              </div>

              {/* Mobile User Menu */}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-white/20">
                  <Link
                    to="/cart"
                    className="block px-3 py-2 rounded-lg glass-button text-white transition flex items-center justify-between hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{t('cart')}</span>
                    {cartItems.length > 0 && (
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                  <Link
                    to="/meal-logging"
                    className="block px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('logMeal')}
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('myOrders')}
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition bg-gradient-to-r from-green-500 to-emerald-600 font-semibold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('adminDashboard')}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg glass-button text-red-300 hover:bg-white/20 transition"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/20 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-lg glass-button text-white hover:scale-105 transition text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-lg glass-button bg-white/30 text-white hover:bg-white/40 transition text-center font-medium hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;