import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '~/components/GlobalStyles';
import { ToastProvider } from '~/context/ToastProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <GlobalStyles>
        <ToastProvider>
            <App />
        </ToastProvider>
    </GlobalStyles>,
    // {/* </React.StrictMode>, */}
);

reportWebVitals();
