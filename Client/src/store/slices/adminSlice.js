import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  products: [],
  orders: [],
  users: [],
  approvalRequests: [],
  loading: false,
  error: null,
};

// ============ PRODUCTS ============

export const getAdminProducts = createAsyncThunk(
  'admin/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/products');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

export const createAdminProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const { data } = await api.post('/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

export const updateAdminProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const { data } = await api.put(`/admin/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update product'
      );
    }
  }
);

export const deleteAdminProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

// ============ ORDERS ============

export const getAdminOrders = createAsyncThunk(
  'admin/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/orders');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

export const updateAdminOrder = createAsyncThunk(
  'admin/updateOrder',
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/orders/${id}`, orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update order'
      );
    }
  }
);

// ============ PRODUCT APPROVALS ============

export const getProductApprovalRequests = createAsyncThunk(
  'admin/getProductApprovalRequests',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/product-approvals');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch approval requests'
      );
    }
  }
);

export const decideProductApproval = createAsyncThunk(
  'admin/decideProductApproval',
  async ({ id, action, rejectionReason }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/product-approvals/${id}`, {
        action,
        rejectionReason,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update approval status'
      );
    }
  }
);

// ============ USERS ============

export const getAdminUsers = createAsyncThunk(
  'admin/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/users');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, { role });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user role'
      );
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(getAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      // Orders
      .addCase(getAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      // Product approvals
      .addCase(getProductApprovalRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductApprovalRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.approvalRequests = action.payload;
      })
      .addCase(getProductApprovalRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(decideProductApproval.fulfilled, (state, action) => {
        state.approvalRequests = state.approvalRequests.filter(
          (p) => p._id !== action.payload._id
        );
        const idx = state.products.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) {
          state.products[idx] = action.payload;
        }
      })
      // Users
      .addCase(getAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;