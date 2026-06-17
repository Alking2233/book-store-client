import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../data/api";

// ===== الحالة الابتدائية =====
const initialState = {
    data: null,  // ← null لأنها مقالة واحدة (وليس قائمة)
    isLoading: false,
    error: null,
};

// ===== جلب تفاصيل مقالة واحدة =====
export const getBlogDetails = createAsyncThunk(
    "blogDetails/getOne",
    async (documentId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(
                `/blogs/${documentId}?populate=*`
            );
            
            // التحقق من وجود البيانات
            if (!data?.data) {
                return rejectWithValue("المقال غير موجود");
            }
            
            return data.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return rejectWithValue("المقال غير موجود");
            }
            return rejectWithValue(
                error.response?.data?.error?.message || 
                "فشل في جلب المقال"
            );
        }
    }
);

// ===== إنشاء الـ Slice =====
const blogDetailsSlice = createSlice({
    name: "blogDetails",
    initialState,
    reducers: {
        clearBlogDetails: (state) => {
            state.data = null;
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBlogDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getBlogDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(getBlogDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "حدث خطأ غير متوقع";
                state.data = null;  // مسح البيانات عند الخطأ
            });
    },
});

export const { clearBlogDetails } = blogDetailsSlice.actions;
export default blogDetailsSlice.reducer;