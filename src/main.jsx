import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

// Styles - الترتيب مهم!
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import './index.css';

// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.js';

// Store & Context
import { store } from './store/store.js';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { QuickViewProvider } from './context/QuickViewContext.jsx';

// Main App
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <QuickViewProvider>
                    <App />
                </QuickViewProvider>
            </ThemeProvider>
        </Provider>
    </StrictMode>
);