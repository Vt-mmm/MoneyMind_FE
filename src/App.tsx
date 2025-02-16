/* eslint-disable react-hooks/exhaustive-deps */
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ✅ Import Google OAuth Provider
import AppRouter from 'routes/router';
import ThemeProvider from 'theme';

// ✅ Thêm Google Client ID từ Google Developer Console
const GOOGLE_CLIENT_ID = "986468886606-knqemnsdc3h29ehpv7iiovbfk13arbn8.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <HelmetProvider>
            <ThemeProvider>
              <AppRouter />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                limit={1}
              />
            </ThemeProvider>
          </HelmetProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
