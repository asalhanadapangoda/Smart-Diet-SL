import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/common/ImageUpload';
import { createFarmerProduct } from '../../store/slices/farmerSlice';

const FarmerAddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'vegetables',
    stock: '',
    isAvailable: true,
    nutrition: { calories: '', protein: '', carbs: '', fat: '', fiber: '' },
  });

  const categories = ['vegetables', 'fruits', 'grains', 'proteins', 'dairy', 'spices', 'other'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('nutrition.')) {
      const k = name.split('.')[1];
      setFormData((prev) => ({ ...prev, nutrition: { ...prev.nutrition, [k]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error('Please upload a product image');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        nutrition: {
          calories: parseFloat(formData.nutrition.calories) || 0,
          protein: parseFloat(formData.nutrition.protein) || 0,
          carbs: parseFloat(formData.nutrition.carbs) || 0,
          fat: parseFloat(formData.nutrition.fat) || 0,
          fiber: parseFloat(formData.nutrition.fiber) || 0,
        },
      };

      await dispatch(createFarmerProduct(payload)).unwrap();
      toast.success('Product submitted for approval');
      navigate('/farmer/products');
    } catch (err) {
      toast.error(err || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          Add New Product (Farmer)
        </h1>
        <p className="text-gray-700 mt-2">
          New products are created as <span className="font-semibold">Pending Approval</span> and won’t be visible to users until approved.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-2 text-glass">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-2 text-glass">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 text-glass">Price (Rs.) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 text-glass">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 focus:outline-none text-glass"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-white">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 text-glass">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-5 w-5 glass-input rounded text-green-500 focus:ring-green-500"
            />
            <label className="ml-2 block text-sm text-gray-800 text-glass">Product Available</label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-2 text-glass">Product Image *</label>
            <ImageUpload onUploadSuccess={setImageUrl} label="Upload Product Image" />
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-glass">Nutrition Information (per 100g)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['calories', 'protein', 'carbs', 'fat', 'fiber'].map((k) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-800 mb-2 text-glass">
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </label>
                  <input
                    type="number"
                    name={`nutrition.${k}`}
                    value={formData.nutrition[k]}
                    onChange={handleChange}
                    min="0"
                    className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading || !imageUrl}
            className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/farmer/products')}
            className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium bg-white/20"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmerAddProduct;

