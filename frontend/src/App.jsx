import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

import { Home } from "./pages/Home/Home";
import { Books } from "./pages/Books/Books";
import { BookDetails } from "./pages/BookDetails/BookDetails";
import { Favorites } from "./pages/Favorites/Favorites";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { CreateBook } from "./pages/CreateBook/CreateBook";
import { EditBook } from "./pages/EditBook/EditBook";

import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { useAuth } from "./Hooks/UseAuth";
import { ThemeProvider, useTheme } from "./Hooks/UseTheme";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  return user ? <Navigate to="/books" replace /> : children;
};

const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando página...</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="text-6xl mb-4">📚</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
      <p className="text-gray-600 mb-6">La página que buscas no existe o ha sido movida.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Volver atrás
        </button>
        <a
          href="/books"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
        >
          Ir a libros
        </a>
      </div>
    </div>
  </div>
);

function AppContent() {
  const { isDark } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/create"
                element={
                  <ProtectedRoute>
                    <CreateBook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditBook />
                  </ProtectedRoute>
                }
              />
              <Route path="/create-book" element={<Navigate to="/books/create" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1F2937' : '#363636',
            color: isDark ? '#F9FAFB' : '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            border: isDark ? '1px solid #374151' : 'none',
          },
          success: {
            duration: 3000,
            style: { background: '#10B981', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#10B981' },
          },
          error: {
            duration: 5000,
            style: { background: '#EF4444', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#EF4444' },
          },
          loading: {
            style: { background: isDark ? '#4F46E5' : '#6366F1', color: '#fff' },
          },
        }}
      />
    </Router>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
