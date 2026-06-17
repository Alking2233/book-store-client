import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../data/api";

// ===== الحالة الابتدائية =====
const initialState = {
    data: [],
    isLoading: false,  // ✅ موحّد (كان isloading)
    error: null,
};

// ===== جلب كل السلايدرات =====
export const getAllSliders = createAsyncThunk(
    "sliders/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/sliders?populate=*");
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
const sliderSlice = createSlice({
    name: "sliders",
    initialState,
    reducers: {
        clearSliders: (state) => {
            state.data = [];
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllSliders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllSliders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload?.data || [];
                state.error = null;
            })
            .addCase(getAllSliders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "حدث خطأ غير متوقع";
            });
    },
});

export const { clearSliders } = sliderSlice.actions;
export const slidersreducer = sliderSlice.reducer;  // ⚠️ احتفظت بالاسم لتجنب تعديل store.js