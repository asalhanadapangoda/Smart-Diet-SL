import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, getProfile } from '../../store/slices/authSlice';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    } else {
      dispatch(getProfile());
    }
  }, [user, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success(t('profileUpdatedSuccess'));
    } catch (error) {
      toast.error(error || t('failedToUpdateProfile'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          {t('myProfile')}
        </h1>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-6 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 text-glass">{t('fullName')}</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 text-glass">{t('email')}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 text-glass">{t('phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800 text-glass">{t('address')}</label>
                <textarea
                  name="address"
                  rows="4"
                  value={formData.address}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glass-button w-full text-white py-3 rounded-xl hover:scale-105 transition-all disabled:opacity-50 font-medium"
              >
                {loading ? t('updating') : t('updateProfile')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;

