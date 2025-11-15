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
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-glass bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
          Manage Products
        </h1>
        <Link
          to="/admin/products/new"
          className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
        >
          ➕ Add New Product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/80 mb-4 text-glass text-xl">No products found</p>
          <Link
            to="/admin/products/new"
            className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
          >
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="glass-card bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/90 uppercase text-glass">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 object-cover rounded-xl border-2 border-white/30"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white text-glass">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="glass-button px-3 py-1 text-xs rounded-full bg-blue-500/30 text-blue-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                      Rs. {product.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/90 text-glass">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full text-glass ${
                          product.isAvailable
                            ? 'glass-button bg-green-500/30 text-green-200'
                            : 'glass-button bg-red-500/30 text-red-200'
                        }`}
                      >
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="text-blue-300 hover:text-blue-200 mr-4 transition-colors text-glass"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-300 hover:text-red-200 transition-colors text-glass"
                      >
                        Delete
                      </button>
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