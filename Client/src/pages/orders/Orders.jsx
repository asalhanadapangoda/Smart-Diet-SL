import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white text-glass bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
          My Orders
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white/80 mt-4 text-glass">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="glass-card rounded-2xl p-12 backdrop-blur-xl max-w-md mx-auto">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-white/80 mb-6 text-glass text-xl">You haven't placed any orders yet</p>
              <Link
                to="/products"
                className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all inline-block font-medium"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="glass-card rounded-2xl p-6 backdrop-blur-xl hover:scale-[1.02] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white text-glass mb-1">
                          Order #{order._id.substring(0, 8).toUpperCase()}
                        </h3>
                        <p className="text-white/70 text-sm text-glass">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium text-glass ${
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
                        <span className="text-lg font-bold text-white text-glass">
                          Rs. {order.totalPrice?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.orderItems?.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 text-white/90 text-glass"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl border-2 border-white/30"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-white/70">
                              Qty: {item.quantity} × Rs. {item.price}
                            </p>
                          </div>
                          <p className="font-semibold">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      {order.orderItems?.length > 3 && (
                        <p className="text-white/70 text-sm text-glass">
                          +{order.orderItems.length - 3} more item(s)
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-white/80 text-glass">
                      <div>
                        <span className="font-medium">Items:</span> {order.orderItems?.length || 0}
                      </div>
                      <div>
                        <span className="font-medium">Shipping:</span> Rs. {order.shippingPrice || 200}
                      </div>
                      {order.shippingAddress && (
                        <div>
                          <span className="font-medium">Address:</span>{' '}
                          {order.shippingAddress.city || 'N/A'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:ml-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="glass-button text-white px-4 py-2 rounded-xl hover:scale-105 transition-all text-center font-medium text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Orders;

