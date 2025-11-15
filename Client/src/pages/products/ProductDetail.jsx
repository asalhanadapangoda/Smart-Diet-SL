import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearProduct } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const { t } = useLanguage();

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearProduct());
    };
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: quantity,
        })
      );
      toast.success(t('productAddedToCart'));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-white text-glass">{t('loadingProducts')}</div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-white/80 mb-4 text-glass">{t('productNotFound')}</p>
        <button
          onClick={() => navigate('/products')}
          className="glass-button text-white px-6 py-2 rounded-xl hover:scale-105 transition-all"
        >
          {t('backToProducts')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-green-300 hover:text-green-200 text-glass transition-colors"
      >
        {t('back')}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4 text-white text-glass">{product.name}</h1>
          <p className="text-2xl text-green-300 font-bold mb-4 text-glass">
            Rs. {product.price}
          </p>
          <p className="text-white/80 mb-6 text-glass">{product.description}</p>

          {product.nutrition && (
            <div className="glass-card bg-white/10 p-4 rounded-xl mb-6 backdrop-blur-xl">
              <h3 className="font-semibold mb-2 text-white text-glass">{t('nutritionInformation')}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-white/80 text-glass">{t('calories')}:</span>{' '}
                  <span className="font-semibold text-white text-glass">{product.nutrition.calories} cal</span>
                </div>
                <div>
                  <span className="text-white/80 text-glass">{t('protein')}:</span>{' '}
                  <span className="font-semibold text-white text-glass">{product.nutrition.protein}g</span>
                </div>
                <div>
                  <span className="text-white/80 text-glass">{t('carbs')}:</span>{' '}
                  <span className="font-semibold text-white text-glass">{product.nutrition.carbs}g</span>
                </div>
                <div>
                  <span className="text-white/80 text-glass">{t('fat')}:</span>{' '}
                  <span className="font-semibold text-white text-glass">{product.nutrition.fat}g</span>
                </div>
                <div>
                  <span className="text-white/80 text-glass">{t('fiber')}:</span>{' '}
                  <span className="font-semibold text-white text-glass">{product.nutrition.fiber}g</span>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-white text-glass">{t('quantity')}</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="glass-button bg-white/20 text-white px-4 py-2 rounded-xl hover:scale-110 transition-all"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center text-white text-glass">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="glass-button bg-white/20 text-white px-4 py-2 rounded-xl hover:scale-110 transition-all"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full glass-button text-white py-3 rounded-xl hover:scale-105 transition-all font-semibold"
          >
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

