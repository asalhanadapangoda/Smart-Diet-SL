import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Smart Diet SL
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-200 transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-green-200 transition">
              Products
            </Link>
            <Link to="/calculator" className="hover:text-green-200 transition">
              Calculator
            </Link>
            <Link to="/diet-plans" className="hover:text-green-200 transition">
              Diet Plans
            </Link>
            <Link to="/ai-plan" className="hover:text-green-200 transition"> {/* <--- ADD THIS LINE */}
              AI Personal Plan
            </Link>
            {isAuthenticated && (
              <Link to="/test/upload" className="hover:text-green-200 transition">
                Test Upload
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="hover:text-green-200 transition relative">
                  Cart
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="hover:text-green-200 transition">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-600 px-4 py-2 rounded hover:bg-green-50 transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

