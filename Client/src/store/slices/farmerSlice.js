import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  products: [],
  orders: [],
  income: { totalIncome: 0, payouts: [] },
  loading: false,
  error: null,
};

export const fetchFarmerProducts = createAsyncThunk(
  'farmer/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/farmer/products');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch farmer products');
    }
  }
);

export const createFarmerProduct = createAsyncThunk(
  'farmer/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      // Supports both JSON body (image url) and multipart (image file)
      if (productData instanceof FormData) {
        const { data } = await api.post('/farmer/products', productData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      }

      const { data } = await api.post('/farmer/products', productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateFarmerAvailability = createAsyncThunk(
  'farmer/updateAvailability',
  async ({ id, isAvailable }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/farmer/products/${id}/availability`, { isAvailable });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update availability');
    }
  }
);

export const fetchFarmerOrders = createAsyncThunk(
  'farmer/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/farmer/orders');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch farmer orders');
    }
  }
);

export const fetchFarmerIncome = createAsyncThunk(
  'farmer/fetchIncome',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/farmer/income');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch income');
    }
  }
);

const farmerSlice = createSlice({
  name: 'farmer',
  initialState,
  reducers: {
    clearFarmerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFarmerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchFarmerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFarmerProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateFarmerAvailability.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(fetchFarmerOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchFarmerIncome.fulfilled, (state, action) => {
        state.income = action.payload;
      });
  },
});

export const { clearFarmerError } = farmerSlice.actions;
export default farmerSlice.reducer;

