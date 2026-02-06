import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FarmerRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'farmer') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default FarmerRoute;

