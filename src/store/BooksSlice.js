// store/BooksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../data/api";

const initialState = {
  data: [],
  isLoading: false,
  error: null,
  meta: null,
};

export const getAllBooks = createAsyncThunk(
  "books/getAll",
  async ({ page = 1, pageSize = 100 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
        "populate": "*", // ✅ سيجلب category_ids تلقائياً
      });

      const { data } = await api.get(`/books?${params.toString()}`);
      
      
      return data;
    } catch (error) {
      console.error("❌ Error fetching books:", error);
      return rejectWithValue(
        error.response?.data?.error?.message || "فشل جلب الكتب"
      );
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearBooks: (state) => {
      state.data = [];
      state.meta = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.data = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.meta = action.payload.meta || null;
        state.isLoading = false;
      })
      .addCase(getAllBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || "حدث خطأ";
      });
  },
});

export const { clearBooks } = booksSlice.actions;
export const booksReducer = booksSlice.reducer;