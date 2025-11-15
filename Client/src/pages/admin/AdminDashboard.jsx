import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminProducts,
  getAdminOrders,
  getAdminUsers,
} from '../../store/slices/adminSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, orders, users, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    document.title = 'Smart Diet SL-Admin';
    dispatch(getAdminProducts());
    dispatch(getAdminOrders());
    dispatch(getAdminUsers());
  }, [dispatch]);

  const stats = [
    {
      name: 'Total Products',
      value: products.length,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      name: 'Total Orders',
      value: orders.length,
      icon: '🛒',
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      name: 'Total Users',
      value: users.length,
      icon: '👥',
      color: 'bg-purple-500',
      link: '/admin/users',
    },
    {
      name: 'Pending Orders',
      value: orders.filter((o) => !o.isDelivered).length,
      icon: '⏳',
      color: 'bg-yellow-500',
      link: '/admin/orders',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-glass bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-white/80 text-glass text-lg">Manage your ecommerce platform</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Link
                key={stat.name}
                to={stat.link}
                className="glass-card rounded-2xl p-6 hover:scale-105 transition-all backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm text-glass">{stat.name}</p>
                    <p className="text-3xl font-bold text-white mt-2 text-glass">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`glass-button ${stat.color} rounded-full p-4 text-3xl bg-opacity-30`}>
                    {stat.icon}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-6 mb-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-4 text-glass">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/products/new"
                className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all text-center font-medium bg-green-500/40"
              >
                ➕ Add New Product
              </Link>
              <Link
                to="/admin/orders"
                className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all text-center font-medium bg-blue-500/40"
              >
                📋 View All Orders
              </Link>
              <Link
                to="/admin/users"
                className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all text-center font-medium bg-purple-500/40"
              >
                👥 Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass-card rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-4 text-glass">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-white/80 text-glass">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead className="glass-card bg-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                          {order.user?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                          Rs. {order.totalPrice?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs rounded-full text-glass ${
                              order.isDelivered
                                ? 'glass-button bg-green-500/30 text-green-200'
                                : order.isPaid
                                ? 'glass-button bg-yellow-500/30 text-yellow-200'
                                : 'glass-button bg-red-500/30 text-red-200'
                            }`}
                          >
                            {order.isDelivered
                              ? 'Delivered'
                              : order.isPaid
                              ? 'Paid'
                              : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-glass">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;