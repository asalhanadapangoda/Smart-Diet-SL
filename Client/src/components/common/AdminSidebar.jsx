import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: '🏠',
      path: '/admin',
      color: 'bg-green-500',
    },
    {
      name: 'Total Products',
      icon: '📦',
      path: '/admin/products',
      color: 'bg-blue-500',
    },
    {
      name: 'Product Approvals',
      icon: '✅',
      path: '/admin/product-approvals',
      color: 'bg-emerald-500',
    },
    {
      name: 'View All Orders',
      icon: '📋',
      path: '/admin/orders',
      color: 'bg-blue-500',
    },
    {
      name: 'Manage Users',
      icon: '👥',
      path: '/admin/users',
      color: 'bg-purple-500',
    },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    if (path.includes('?')) {
      const basePath = path.split('?')[0];
      return location.pathname === basePath;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-card backdrop-blur-xl z-50 flex flex-col border-r border-gray-200">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/admin" className="flex items-center hover:scale-105 transition-transform duration-300">
          <span className="text-3xl">🥗</span>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              Smart Diet SL
            </h1>
            <p className="text-xs text-gray-600 text-glass">Admin Panel</p>
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
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 px-4 py-3 glass-card rounded-xl text-center">
          <p className="text-xs text-gray-500 text-glass mb-1">Logged in as</p>
          <p className="text-sm font-semibold text-gray-800 text-glass">{user?.name || 'Admin'}</p>
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

export default AdminSidebar;

