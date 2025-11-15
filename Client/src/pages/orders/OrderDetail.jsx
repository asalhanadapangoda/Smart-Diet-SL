import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import api from '../../services/api';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8 relative">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white/80 mt-4 text-glass">Loading order details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8 relative">
          <div className="text-center py-12">
            <p className="text-white/80 mb-4 text-glass text-xl">Order not found</p>
            <Link
              to="/orders"
              className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all inline-block font-medium"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 relative max-w-4xl">
        <div className="mb-6">
          <Link
            to="/orders"
            className="text-white/80 hover:text-white transition-colors text-glass inline-flex items-center mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white text-glass bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Order Details
          </h1>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-6 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white text-glass mb-2">
                Order #{order._id.substring(0, 8).toUpperCase()}
              </h2>
              <p className="text-white/70 text-glass">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium text-glass ${
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
              <span className="text-2xl font-bold text-white text-glass">
                Rs. {order.totalPrice?.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-semibold text-white text-glass mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 glass-card bg-white/10 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border-2 border-white/30"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-glass mb-1">{item.name}</h4>
                    <p className="text-white/70 text-sm text-glass">
                      Quantity: {item.quantity} × Rs. {item.price}
                    </p>
                  </div>
                  <p className="font-bold text-white text-glass">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white text-glass mb-4">Shipping Address</h3>
            {order.shippingAddress ? (
              <div className="space-y-2 text-white/90 text-glass">
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-white/70 text-glass">No shipping address provided</p>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white text-glass mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-white/90 text-glass">
                <span>Items ({order.orderItems?.length || 0})</span>
                <span>Rs. {order.itemsPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-white/90 text-glass">
                <span>Shipping</span>
                <span>Rs. {order.shippingPrice?.toFixed(2) || '200.00'}</span>
              </div>
              <div className="border-t border-white/20 pt-3 flex justify-between font-bold text-lg text-white text-glass">
                <span>Total</span>
                <span>Rs. {order.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-white/20">
                <div className="flex justify-between text-white/90 text-glass mb-2">
                  <span>Payment Method:</span>
                  <span className="font-medium capitalize">
                    {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card Payment'}
                  </span>
                </div>
                <div className="flex justify-between text-white/90 text-glass">
                  <span>Payment Status:</span>
                  <span className={order.isPaid ? 'text-green-300' : 'text-red-300'}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderDetail;

