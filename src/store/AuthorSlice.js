import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../data/api";

// ===== الحالة الابتدائية =====
const initialState = {
    data: [],
    isLoading: false,
    error: null,
};

// ===== جلب كل المؤلفين =====
export const getAllAuthors = createAsyncThunk(
    "authors/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/authors?populate=*");
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error?.message || 
                "فشل في جلب المؤلفين"
            );
        }
    }
);

// ===== إنشاء الـ Slice =====
const authorsSlice = createSlice({
    name: "authors",
    initialState,
    reducers: {
        clearAuthors: (state) => {
            state.data = [];
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAuthors.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllAuthors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload?.data || [];
                state.error = null;
            })
            .addCase(getAllAuthors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "حدث خطأ غير متوقع";
            });
    },
});

export const { clearAuthors } = authorsSlice.actions;
export const authorsReducer = authorsSlice.reducer;