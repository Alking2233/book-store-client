import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../data/api";

// ===== الحالة الابتدائية =====
const initialState = {
    data: [],
    isLoading: false,
    error: null,
};

// ===== جلب كل السلايدرات =====
export const getAllHeroSliders = createAsyncThunk(
    "heroSliders/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                "/hero-sliders?sort=Order:asc&populate=BackgroundImage"
            );
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error?.message || 
                "فشل في جلب السلايدرات"
            );
        }
    }
);

// ===== إنشاء الـ Slice =====
const heroSliderSlice = createSlice({
    name: "heroSliders",
    initialState,
    reducers: {
        // مسح البيانات يدوياً (مفيد عند تسجيل الخروج مثلاً)
        clearHeroSliders: (state) => {
            state.data = [];
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // ⏳ جاري التحميل
            .addCase(getAllHeroSliders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            // ✅ نجح
            .addCase(getAllHeroSliders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload?.data || [];
                state.error = null;
            })
            // ❌ فشل
            .addCase(getAllHeroSliders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "حدث خطأ غير متوقع";
            });
    },
});

export const { clearHeroSliders } = heroSliderSlice.actions;
export const heroSliderReducer = heroSliderSlice.reducer;