import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getAdminOrders, updateAdminOrder } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

const OrdersAdmin = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.admin);
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'pending') {
      return orders.filter((order) => !order.isDelivered);
    }
    return orders;
  }, [orders, statusFilter]);

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

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await dispatch(updateAdminOrder({ id: orderId, orderData: { status } })).unwrap();
      toast.success('Order status updated');
      dispatch(getAdminOrders());
    } catch (error) {
      toast.error(error || 'Failed to update order status');
    }
  };

  return (
    <div className="relative">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          Manage Orders
        </h1>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-700 text-glass text-xl">
            {statusFilter === 'pending' ? 'No pending orders found' : 'No orders found'}
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden backdrop-blur-xl">
          {statusFilter === 'pending' && (
            <div className="p-4 bg-yellow-50 border-b border-yellow-200">
              <p className="text-sm text-gray-700 text-glass">
                Showing only pending orders ({filteredOrders.length} of {orders.length})
              </p>
            </div>
          )}
          <div className="overflow-x-auto p-4">
            <table className="w-full divide-y divide-gray-200 border-separate border-spacing-0">
              <thead className="glass-card bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-800 uppercase text-glass w-24">
                    Order ID
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-800 uppercase text-glass w-32">
                    User
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-800 uppercase text-glass w-20">
                    Items
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-800 uppercase text-glass w-24">
                    Total
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-800 uppercase text-glass w-24">
                    Payment
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-800 uppercase text-glass w-24">
                    Delivery
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-800 uppercase text-glass w-24">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-medium text-gray-800 uppercase text-glass w-40">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-800 text-glass">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-800 text-glass truncate max-w-[120px]">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-800 text-glass">
                      {order.orderItems?.length || 0} items
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-800 text-glass">
                      Rs. {order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-sm rounded-full text-glass inline-block ${
                          order.isPaid
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-sm rounded-full text-glass inline-block ${
                          order.isDelivered
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                        }`}
                      >{order.isDelivered ? 'Delivered' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600 text-glass">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-1.5">
                        {!order.isPaid && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'isPaid', true)}
                            className="glass-button text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded-lg text-sm transition-all hover:scale-105 font-medium w-full"
                          >
                            Mark Paid
                          </button>
                        )}
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'isDelivered', true)}
                            className="glass-button text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-lg text-sm transition-all hover:scale-105 font-medium w-full"
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
