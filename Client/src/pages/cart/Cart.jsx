import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/slices/cartSlice';
import ProtectedRoute from '../../components/common/ProtectedRoute';

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const updateQuantity = (item, qty) => {
    if (qty <= 0) {
      dispatch(removeFromCart(item.product));
    } else {
      dispatch(
        addToCart({
          ...item,
          quantity: qty,
        })
      );
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white text-glass bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/80 mb-4 text-glass text-xl">Your cart is empty</p>
            <Link
              to="/products"
              className="glass-button text-white px-6 py-3 rounded-xl hover:scale-105 transition-all inline-block font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="glass-card rounded-2xl p-4 backdrop-blur-xl flex flex-col md:flex-row items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl border-2 border-white/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-white text-glass mb-1">{item.name}</h3>
                    <p className="text-green-300 font-bold text-glass">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      className="glass-button bg-white/20 px-3 py-1 rounded-xl hover:scale-105 transition-all text-white text-glass font-medium"
                    >
                      -
                    </button>
                    <span className="px-4 text-white text-glass font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      className="glass-button bg-white/20 px-3 py-1 rounded-xl hover:scale-105 transition-all text-white text-glass font-medium"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-glass">Rs. {item.price * item.quantity}</p>
                    <button
                      onClick={() => dispatch(removeFromCart(item.product))}
                      className="text-red-300 hover:text-red-200 text-sm mt-2 transition-colors text-glass"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 sticky top-4 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-4 text-white text-glass">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-white/90 text-glass">
                    <span>Subtotal</span>
                    <span>Rs. {calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-white/90 text-glass">
                    <span>Shipping</span>
                    <span>Rs. 200</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 flex justify-between font-bold text-lg text-white text-glass">
                    <span>Total</span>
                    <span>Rs. {calculateTotal() + 200}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full glass-button text-white text-center py-3 rounded-xl hover:scale-105 transition-all font-medium"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Cart;

