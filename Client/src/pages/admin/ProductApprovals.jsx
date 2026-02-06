import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductApprovalRequests, decideProductApproval } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

const ProductApprovals = () => {
  const dispatch = useDispatch();
  const { approvalRequests, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getProductApprovalRequests());
  }, [dispatch]);

  const handleApproval = async (productId, action) => {
    try {
      await dispatch(decideProductApproval({ id: productId, action })).unwrap();
      toast.success(`Product ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      dispatch(getProductApprovalRequests());
    } catch (error) {
      toast.error(error || `Failed to ${action} product`);
    }
  };

  return (
    <div className="relative">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          Product Approvals
        </h1>
        <p className="text-gray-600 text-glass mt-2">Review and approve or reject product submissions from farmers</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : approvalRequests.length === 0 ? (
        <div className="text-center py-12">
          <div className="glass-card rounded-2xl p-12 backdrop-blur-xl max-w-md mx-auto">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-700 text-glass text-xl mb-2">No pending approvals</p>
            <p className="text-gray-600 text-glass">All products have been reviewed</p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="p-4 bg-yellow-50 border-b border-yellow-200">
            <p className="text-sm text-gray-700 text-glass">
              <span className="font-semibold">{approvalRequests.length}</span> product(s) waiting for approval
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="glass-card bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Product Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Farmer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approvalRequests.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-xl border-2 border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800 text-glass">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 text-glass max-w-xs truncate">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-glass">
                      {product.farmer?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-glass">
                      Rs. {product.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-glass">
                      {product.stock || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproval(product._id, 'approve')}
                          className="glass-button text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-sm transition-all hover:scale-105 font-medium"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleApproval(product._id, 'reject')}
                          className="glass-button text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition-all hover:scale-105 font-medium"
                        >
                          ❌ Reject
                        </button>
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

export default ProductApprovals;

