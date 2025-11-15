import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminOrders, updateAdminOrder } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

const OrdersAdmin = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, statusType, value) => {
    try {
      const updateData = { [statusType]: value };
      await dispatch(updateAdminOrder({ id: orderId, orderData: updateData })).unwrap();
      toast.success('Order updated successfully');
      dispatch(getAdminOrders());
    } catch (error) {
      toast.error(error || 'Failed to update order');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-glass bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
          Manage Orders
        </h1>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/80 text-glass text-xl">No orders found</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden backdrop-blur-xl">
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
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/20">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                      {order.orderItems?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                      Rs. {order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full text-glass ${
                          order.isPaid
                            ? 'glass-button bg-green-500/30 text-green-200'
                            : 'glass-button bg-red-500/30 text-red-200'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full text-glass ${
                          order.isDelivered
                            ? 'glass-button bg-green-500/30 text-green-200'
                            : 'glass-button bg-yellow-500/30 text-yellow-200'
                        }`}
                      >{order.isDelivered ? 'Delivered' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 text-glass">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {!order.isPaid && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'isPaid', true)}
                            className="glass-button text-green-300 hover:text-green-200 px-3 py-1 rounded-xl text-sm transition-all hover:scale-105"
                          >
                            Mark Paid
                          </button>
                        )}
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'isDelivered', true)}
                            className="glass-button text-blue-300 hover:text-blue-200 px-3 py-1 rounded-xl text-sm transition-all hover:scale-105"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
