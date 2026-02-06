import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchFarmerOrders } from '../../store/slices/farmerSlice';

const FarmerOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((s) => s.farmer);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchFarmerOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const normalized = useMemo(() => {
    const farmerId = user?._id || user?.id;
    return (orders || []).map((o) => {
      const myItems = (o.orderItems || []).filter(
        (it) => (it.farmer && String(it.farmer) === String(farmerId)) || (it.farmer?._id && String(it.farmer._id) === String(farmerId))
      );
      const myTotal = myItems.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);
      return { ...o, myItems, myTotal };
    });
  }, [orders, user]);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
        Orders for My Products
      </h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : normalized.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-700 text-glass text-xl">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {normalized.map((o) => (
            <div key={o._id} className="glass-card rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-lg font-bold text-gray-800">Order #{String(o._id).slice(0, 8).toUpperCase()}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(o.createdAt).toLocaleString()} • Status: <span className="font-medium">{o.status || (o.isDelivered ? 'completed' : 'pending')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">My items total</div>
                  <div className="text-xl font-bold text-green-700">Rs. {o.myTotal.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-3">
                {o.myItems.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{it.name}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {it.quantity} × Rs. {it.price}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800">
                      Rs. {((Number(it.price) || 0) * (Number(it.quantity) || 0)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;

