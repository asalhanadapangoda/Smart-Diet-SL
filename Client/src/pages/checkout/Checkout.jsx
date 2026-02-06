import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, savePaymentMethod } from '../../store/slices/cartSlice';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, shippingAddress } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    address: shippingAddress.address || user?.address || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.postalCode || '',
    country: shippingAddress.country || 'Sri Lanka',
    paymentMethod: 'cash',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = 200;
    return {
      itemsPrice,
      shippingPrice,
      totalPrice: itemsPrice + shippingPrice,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(saveShippingAddress(formData));
    dispatch(savePaymentMethod(formData.paymentMethod));

    const { itemsPrice, shippingPrice, totalPrice } = calculateTotal();

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8 text-center relative">
          <p className="text-gray-700 mb-4 text-glass text-xl">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  const { itemsPrice, shippingPrice, totalPrice } = calculateTotal();

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800 text-glass bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-6 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-glass">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800 text-glass">Address</label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass resize-none"
                      rows="3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800 text-glass">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-800 text-glass">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800 text-glass">Country</label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none text-glass"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-glass">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="w-5 h-5 glass-input text-green-500 focus:ring-green-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-3 text-gray-700 text-glass group-hover:text-gray-900 transition-colors">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-5 h-5 glass-input text-green-500 focus:ring-green-500 focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-3 text-gray-700 text-glass group-hover:text-gray-900 transition-colors">Card Payment</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full glass-button text-white py-3 rounded-xl hover:scale-105 transition-all disabled:opacity-50 font-medium"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-4 backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-glass">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex justify-between text-sm text-gray-700 text-glass">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-700 text-glass">
                  <span>Items</span>
                  <span>Rs. {itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-glass">
                  <span>Shipping</span>
                  <span>Rs. {shippingPrice}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-800 text-glass">
                  <span>Total</span>
                  <span>Rs. {totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Checkout;

