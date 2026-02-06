import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AdminRoute from './components/common/AdminRoute';
import AdminLayout from './components/common/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import FarmerRoute from './components/common/FarmerRoute';
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
import EditProduct from './pages/admin/EditProduct';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import ProductApprovals from './pages/admin/ProductApprovals';
// Farmer pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProducts from './pages/farmer/FarmerProducts';
import FarmerAddProduct from './pages/farmer/FarmerAddProduct';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerIncome from './pages/farmer/FarmerIncome';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen relative">
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? '' : 'flex-grow relative z-10'}>
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

          {/* Farmer Routes - Protected */}
          <Route
            path="/farmer"
            element={
              <FarmerRoute>
                <FarmerDashboard />
              </FarmerRoute>
            }
          />
          <Route
            path="/farmer/products"
            element={
              <FarmerRoute>
                <FarmerProducts />
              </FarmerRoute>
            }
          />
          <Route
            path="/farmer/products/new"
            element={
              <FarmerRoute>
                <FarmerAddProduct />
              </FarmerRoute>
            }
          />
          <Route
            path="/farmer/orders"
            element={
              <FarmerRoute>
                <FarmerOrders />
              </FarmerRoute>
            }
          />
          <Route
            path="/farmer/income"
            element={
              <FarmerRoute>
                <FarmerIncome />
              </FarmerRoute>
            }
          />
          
          {/* Admin Routes - Protected */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ProductsAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <AdminRoute>
                <AdminLayout>
                  <EditProduct />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminLayout>
                  <OrdersAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <UsersAdmin />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/product-approvals"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ProductApprovals />
                </AdminLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
        <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(16, 185, 129, 0.9)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                color: 'white',
                border: '1px solid rgba(5, 150, 105, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px 0 rgba(5, 150, 105, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: 'rgba(167, 243, 208, 1)',
                  secondary: 'white',
                },
                style: {
                  background: 'rgba(16, 185, 129, 0.9)',
                  borderColor: 'rgba(5, 150, 105, 0.5)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'rgba(254, 202, 202, 1)',
                  secondary: 'white',
                },
                style: {
                  background: 'rgba(239, 68, 68, 0.9)',
                  borderColor: 'rgba(220, 38, 38, 0.5)',
                },
              },
              loading: {
                iconTheme: {
                  primary: 'rgba(167, 243, 208, 1)',
                  secondary: 'white',
                },
                style: {
                  background: 'rgba(16, 185, 129, 0.9)',
                  borderColor: 'rgba(5, 150, 105, 0.5)',
                },
              },
            }}
          />
      </Router>
    </LanguageProvider>
  );
}

export default App;