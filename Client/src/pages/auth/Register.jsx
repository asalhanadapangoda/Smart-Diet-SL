import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../store/slices/authSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { t } = useLanguage();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t('passwordMinLength'));
      return;
    }

    const { confirmPassword, ...userData } = formData;
    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="glass-card rounded-3xl p-8 backdrop-blur-xl">
          <div>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-white text-glass bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              {t('createAccount')}
            </h2>
            <p className="mt-2 text-center text-sm text-white/80 text-glass">
              {t('or')}{' '}
              <Link
                to="/login"
                className="font-medium text-green-300 hover:text-green-200 transition-colors"
              >
                {t('signInExisting')}
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90 text-glass mb-1">
                  {t('fullName')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none text-glass"
                  placeholder={t('enterFullName')}
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 text-glass mb-1">
                  {t('email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none text-glass"
                  placeholder={t('enterEmail')}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white/90 text-glass mb-1">
                  {t('phone')}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none text-glass"
                  placeholder={t('enterPhone')}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-white/90 text-glass mb-1">
                  {t('address')}
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none text-glass resize-none"
                  placeholder={t('enterAddress')}
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 text-glass mb-1">
                  {t('password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none text-glass"
                  placeholder={t('enterPassword')}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 text-glass mb-1">
                  {t('confirmPassword')}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none text-glass"
                  placeholder={t('confirmYourPassword')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="glass-button group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-xl text-white hover:scale-105 focus:outline-none disabled:opacity-50 transition-all"
              >
                {loading ? t('creatingAccount') : t('createAccountButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

