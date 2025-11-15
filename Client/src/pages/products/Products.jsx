import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ category, search }));
  }, [dispatch, category, search]);

  const categories = [
    'all',
    'vegetables',
    'fruits',
    'grains',
    'proteins',
    'dairy',
    'spices',
    'other',
  ];

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      })
    );
    toast.success('Product added to cart');
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white text-glass text-center">
        Our Products
      </h1>

      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 glass-input px-6 py-3 rounded-xl text-white placeholder-white/60 focus:outline-none text-glass"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value === 'all' ? '' : e.target.value)}
          className="glass-input px-6 py-3 rounded-xl text-white focus:outline-none text-glass"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === 'all' ? '' : cat} className="bg-gray-800">
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12 text-white text-glass text-xl">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="glass-card rounded-2xl overflow-hidden group"
            >
              <Link to={`/products/${product._id}`} className="block">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </Link>
              <div className="p-5">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-lg mb-2 text-white text-glass hover:text-green-300 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-white/80 text-sm mb-4 line-clamp-2 text-glass">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-green-300 font-bold text-lg text-glass">Rs. {product.price}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="glass-button text-white px-4 py-2 rounded-xl hover:scale-110 transition-all font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="text-center text-white/80 py-12 text-glass text-xl">No products found</p>
      )}
    </div>
  );
};

export default Products;

