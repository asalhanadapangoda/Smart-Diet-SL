import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { fetchFarmerProducts } from '../../store/slices/farmerSlice';

const FarmerSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products = [] } = useSelector((state) => state.farmer) || {};
  const pendingCount = (products || []).filter((p) => p.approvalStatus === 'pending').length;

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(fetchFarmerProducts());
  }, [dispatch]);

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: '/farmer' },
    { name: 'My Products', icon: '📦', path: '/farmer/products' },
    { name: 'Pending Approvals', icon: '⏳', path: '/farmer/products?status=pending', badge: pendingCount },
    { name: 'My Orders', icon: '🛒', path: '/farmer/orders' },
    { name: 'Total Income', icon: '💰', path: '/farmer/income' },
    { name: 'Add New Product', icon: '➕', path: '/farmer/products/new' },
  ];

  const isActive = (path) => {
    if (path === '/farmer') {
      return location.pathname === '/farmer';
    }
    if (path.includes('?')) {
      const basePath = path.split('?')[0];
      return location.pathname === basePath && location.search.includes('status=pending');
    }
    // /farmer/products: active only when NOT on Add New Product or Pending Approvals
    if (path === '/farmer/products') {
      return (
        location.pathname === '/farmer/products' &&
        !location.pathname.startsWith('/farmer/products/new') &&
        !location.search.includes('status=pending')
      );
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-card backdrop-blur-xl z-50 flex flex-col border-r border-gray-200">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/farmer" className="flex items-center hover:scale-105 transition-transform duration-300">
          <span className="text-3xl">🥗</span>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              Smart Diet SL
            </h1>
            <p className="text-xs text-gray-600 text-glass">Farmer Panel</p>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'glass-button bg-green-500/20 text-green-700 border border-green-300 shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-gray-100 hover:scale-105 text-glass'
              }`}
            >
              <span className="text-2xl mr-3">{item.icon}</span>
              <span className="font-medium flex-1">{item.name}</span>
              {item.badge > 0 && (
                <span className="bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 px-4 py-3 glass-card rounded-xl text-center">
          <p className="text-xs text-gray-500 text-glass mb-1">Logged in as</p>
          <p className="text-sm font-semibold text-gray-800 text-glass">{user?.name || 'Farmer'}</p>
        </div>
        <Link
          to="/"
          className="block w-full px-4 py-2.5 text-center glass-button text-white rounded-xl hover:scale-105 transition-all font-medium mb-2"
        >
          Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 text-center bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default FarmerSidebar;
