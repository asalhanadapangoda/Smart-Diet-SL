import { useSelector } from 'react-redux';
import { useLanguage } from '../../contexts/LanguageContext';
import { useInactivityLogout } from '../../hooks/useInactivityLogout';

/**
 * Component that enables auto-logout after 15 minutes of inactivity
 * for all authenticated users (user, farmer, admin).
 * Renders nothing - only manages the inactivity timer.
 */
const InactivityLogout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { t } = useLanguage();

  useInactivityLogout(isAuthenticated, t('sessionExpired'));

  return null;
};

export default InactivityLogout;
