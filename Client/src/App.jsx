import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AdminRoute from './components/common/AdminRoute';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Calculator from './pages/calculator/Calculator';
import DietPlans from './pages/diet-plans/DietPlans';
import DietPlanner from './pages/diet-planner/DietPlanner';
import MealLogging from './pages/meal-logging/MealLogging';
import SriLankanPlates from './pages/sri-lankan-plates/SriLankanPlates';
import Profile from './pages/profile/Profile';
import Products from './pages/products/Products';
import ProductDetail from './pages/products/ProductDetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import Orders from './pages/orders/Orders';
import OrderDetail from './pages/orders/OrderDetail';
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="flex flex-col min-h-screen relative">
          <Header />
          <main className="flex-grow relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/diet-plans" element={<DietPlans />} />
              <Route path="/diet-planner" element={<ProtectedRoute><DietPlanner /></ProtectedRoute>} />
              <Route path="/meal-logging" element={<ProtectedRoute><MealLogging /></ProtectedRoute>} />
              <Route path="/sri-lankan-plates" element={<SriLankanPlates />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              
              {/* Admin Routes - Protected */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductsAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  <AdminRoute>
                    <AddProduct />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/:id/edit"
                element={
                  <AdminRoute>
                    <EditProduct />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrdersAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UsersAdmin />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(5, 150, 105, 0.5)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                color: 'white',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px 0 rgba(4, 120, 87, 0.4), inset 0 1px 0 rgba(34, 197, 94, 0.3)',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: 'rgba(74, 222, 128, 1)',
                  secondary: 'white',
                },
                style: {
                  background: 'rgba(5, 150, 105, 0.5)',
                  borderColor: 'rgba(34, 197, 94, 0.6)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'rgba(248, 113, 113, 1)',
                  secondary: 'white',
                },
                style: {
                  background: 'rgba(220, 38, 38, 0.5)',
                  borderColor: 'rgba(248, 113, 113, 0.6)',
                },
              },
              loading: {
                iconTheme: {
                  primary: 'rgba(74, 222, 128, 1)',
                  secondary: 'white',
                },
                style: {
                  background: 'rgba(5, 150, 105, 0.5)',
                  borderColor: 'rgba(34, 197, 94, 0.6)',
                },
              },
            }}
          />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;