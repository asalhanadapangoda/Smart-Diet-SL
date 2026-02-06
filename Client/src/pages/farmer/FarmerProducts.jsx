import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchFarmerProducts,
  updateFarmerAvailability,
} from '../../store/slices/farmerSlice';

const badge = (status) => {
  if (status === 'approved') return 'bg-green-100 text-green-700 border border-green-300';
  if (status === 'rejected') return 'bg-red-100 text-red-700 border border-red-300';
  return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
};

const FarmerProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((s) => s.farmer);
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const filteredProducts = statusFilter
    ? products.filter((p) => p.approvalStatus === statusFilter)
    : products;
  const emptyLabel = statusFilter
    ? `No ${statusFilter} products`
    : 'No products yet';

  useEffect(() => {
    dispatch(fetchFarmerProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const toggleAvailability = async (p) => {
    try {
      await dispatch(updateFarmerAvailability({ id: p._id, isAvailable: !p.isAvailable })).unwrap();
      toast.success('Availability updated');
    } catch (e) {
      toast.error(e || 'Failed to update availability');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          My Products
        </h1>
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
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-700 mb-4 text-glass text-xl">{emptyLabel}</p>
          <Link
            to="/farmer/products/new"
            className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p._id} className="glass-card rounded-2xl overflow-hidden backdrop-blur-xl">
              <div className="relative">
                <img src={p.image} alt={p.name} className="w-full h-44 object-cover" />
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs ${badge(p.approvalStatus)}`}>
                  {p.approvalStatus === 'pending'
                    ? 'Pending Approval'
                    : p.approvalStatus === 'approved'
                    ? 'Approved'
                    : 'Rejected'}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-lg text-gray-800 text-glass">{p.name}</h3>
                  <span className="text-green-700 font-bold text-glass">Rs. {p.price}</span>
                </div>
                {p.approvalStatus === 'rejected' && p.rejectionReason && (
                  <p className="text-sm text-red-700 mt-2">
                    Rejected: <span className="font-medium">{p.rejectionReason}</span>
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Availability:{' '}
                    <span className="font-semibold">{p.isAvailable ? 'Available' : 'Not Available'}</span>
                  </div>
                  <button
                    onClick={() => toggleAvailability(p)}
                    className="glass-button text-white px-4 py-2 rounded-xl hover:scale-105 transition-all font-medium"
                  >
                    Toggle
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Note: Only <span className="font-medium">Approved</span> products are visible to users.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerProducts;

