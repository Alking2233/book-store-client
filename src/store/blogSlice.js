import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../data/api";

// ===== الحالة الابتدائية =====
const initialState = {
    data: [],
    isLoading: false,
    error: null,
};

// ===== جلب كل المقالات =====
export const getAllBlogs = createAsyncThunk(
    "blogs/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/blogs?populate=*");
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error?.message || 
                "فشل في جلب المقالات"
            );
        }
    }
);

// ===== إنشاء الـ Slice =====
const blogsSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        clearBlogs: (state) => {
            state.data = [];
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllBlogs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllBlogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload?.data || [];
                state.error = null;
            })
            .addCase(getAllBlogs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "حدث خطأ غير متوقع";
            });
    },
});

export const { clearBlogs } = blogsSlice.actions;
export const blogsReducer = blogsSlice.reducer;