import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../data/api';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

// ✅ 1. اسم thunk واضح + استخدام rejectWithValue
export const getAllCategories = createAsyncThunk(
  "categories/getAll", // ✅ أفضل من "categories-actions"
  async (_, { rejectWithValue }) => {
    try {
      // ✅ تأكد من وجود / في بداية المسار
      const { data } = await api.get("/categories?populate=*");
      
      // ✅ Strapi v4+ يرجع البيانات داخل data.data
      return data.data || [];
    } catch (error) {
      // ✅ إرجاع رسالة خطأ مخصصة
      return rejectWithValue(
        error.response?.data?.error?.message || "فشل جلب التصنيفات"
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        // ✅ 2. التحقق من أن البيانات مصفوفة قبل التعيين
        state.data = Array.isArray(action.payload) ? action.payload : [];
        state.isLoading = false;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        // ✅ 3. استخدام action.payload للرسالة المخصصة
        state.error = action.payload || action.error.message || "حدث خطأ غير متوقع";
      });
  },
});

export const categoriesReducer = categoriesSlice.reducer;