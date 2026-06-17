import { configureStore } from "@reduxjs/toolkit";

// ============================================================================
// 📦 استيراد الـ Reducers
// ============================================================================

import { categoriesReducer } from "./categoriesSlice";
import { booksReducer } from "./BooksSlice";
import { slidersreducer } from "./Slider/sliderSlice";
import { heroSliderReducer } from "./HeroSlider/heroSliderSlice";
import { authorsReducer } from "./AuthorSlice";
import { blogsReducer } from "./blogSlice";
import blogDetailsReducer from "./BlogDetailsSlice";

// ============================================================================
// 🏪 إنشاء Store
// ============================================================================

export const store = configureStore({
    reducer: {
        categories: categoriesReducer,
        books: booksReducer,
        sliders: slidersreducer,
        heroSliders: heroSliderReducer,
        authors: authorsReducer,
        blogs: blogsReducer,
        blogDetails: blogDetailsReducer,
    },
    
    // ===== Middleware =====
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // تجاهل بعض الـ actions غير المتسلسلة (إن لزم)
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
    
    // ===== Redux DevTools (مفعّل في التطوير فقط) =====
    devTools: import.meta.env.DEV,
});

// ============================================================================
// 📊 تصدير الأنواع (للاستخدام مع TypeScript مستقبلاً)
// ============================================================================

// نوع الـ State الكامل
// export type RootState = ReturnType<typeof store.getState>;

// نوع الـ Dispatch
// export type AppDispatch = typeof store.dispatch;