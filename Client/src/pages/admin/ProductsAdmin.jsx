import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAdminProducts, deleteAdminProduct } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

const ProductsAdmin = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteAdminProduct(id)).unwrap();
        toast.success('Product deleted successfully');
        dispatch(getAdminProducts());
      } catch (error) {
        toast.error(error || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          Manage Products
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-700 mb-4 text-glass text-xl">No products found</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="glass-card bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Name
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase text-glass">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-xl border-2 border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800 text-glass">
                        {product.name}
                      </div>
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
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full text-glass ${
                          product.isAvailable
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-blue-700 bg-blue-400/25 hover:bg-blue-400/40 border border-blue-300/60 backdrop-blur-sm transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-red-700 bg-red-400/25 hover:bg-red-400/40 border border-red-300/60 backdrop-blur-sm transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
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

export default ProductsAdmin;