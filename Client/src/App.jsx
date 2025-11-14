import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Products from './pages/products/Products';
import ProductDetail from './pages/products/ProductDetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import Calculator from './pages/calculator/Calculator';
import DietPlans from './pages/diet-plans/DietPlans';
import Profile from './pages/profile/Profile';
import ImageUploadTest from './pages/test/ImageUploadTest';
import AIPersonalizedPlan from './pages/diet-plans/AIPersonalizedPlan';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/diet-plans" element={<DietPlans />} />
            <Route path="/ai-plan" element={<AIPersonalizedPlan />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/test/upload" element={<ImageUploadTest />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
