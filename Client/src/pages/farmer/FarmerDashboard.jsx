import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFarmerProducts,
  fetchFarmerOrders,
  fetchFarmerIncome,
} from '../../store/slices/farmerSlice';

const FarmerDashboard = () => {
  const dispatch = useDispatch();
  const { products, orders, income, loading } = useSelector((s) => s.farmer);

  useEffect(() => {
    dispatch(fetchFarmerProducts());
    dispatch(fetchFarmerOrders());
    dispatch(fetchFarmerIncome());
  }, [dispatch]);

  const pendingCount = useMemo(
    () => products.filter((p) => p.approvalStatus === 'pending').length,
    [products]
  );

  const stats = [
    { name: 'My Products', value: products.length, icon: '📦', link: '/farmer/products' },
    { name: 'Pending Approvals', value: pendingCount, icon: '⏳', link: '/farmer/products?status=pending' },
    { name: 'My Orders', value: orders.length, icon: '🛒', link: '/farmer/orders' },
    { name: 'Total Income', value: `Rs. ${(income?.totalIncome || 0).toFixed(2)}`, icon: '💰', link: '/farmer/income' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
            Farmer Dashboard
          </h1>
          <p className="text-gray-700 text-glass text-lg">Manage your products, orders and income</p>
        </div>
        <Link
          to="/farmer/products/new"
          className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
        >
          ➕ Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Link
                key={stat.name}
                to={stat.link}
                className="glass-card rounded-2xl p-6 hover:scale-105 transition-all backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm text-glass">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2 text-glass">{stat.value}</p>
                  </div>
                  <div className="glass-button bg-green-100 rounded-full p-4 text-3xl border border-green-300">
                    {stat.icon}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {pendingCount > 0 && (
            <div className="glass-card rounded-2xl p-6 backdrop-blur-xl border border-yellow-300 bg-yellow-50 mb-8">
              <h2 className="text-xl font-bold text-gray-800 text-glass mb-2">Pending Approval</h2>
              <p className="text-gray-700 text-glass">
                You have <span className="font-semibold">{pendingCount}</span> product(s) waiting for admin approval.
              </p>
              <Link
                to="/farmer/products?status=pending"
                className="inline-block mt-3 text-green-700 hover:text-green-800 font-medium"
              >
                View my products →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FarmerDashboard;

