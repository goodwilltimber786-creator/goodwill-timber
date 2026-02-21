import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppFloating } from "@/components/WhatsAppFloating";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { MyOrders } from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminLogin, useAdminAuth } from "./components/admin/AdminLogin";
import AdminPage from "./pages/admin/AdminPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import ProductsPage from "./pages/admin/ProductsPage";
import SubmissionsPage from "./pages/admin/SubmissionsPage";

const queryClient = new QueryClient();
const WHATSAPP_NUMBER = "918638264329"; // Change to your WhatsApp business number

// Protected route wrapper
const ProtectedAdminRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated } = useAdminAuth();
  return isAuthenticated ? element : <Navigate to="/admin/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-orders" element={<MyOrders />} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Routes - Protected */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<ProtectedAdminRoute element={<AdminPage />} />} />
            <Route path="/admin/categories" element={<ProtectedAdminRoute element={<CategoriesPage />} />} />
            <Route path="/admin/products" element={<ProtectedAdminRoute element={<ProductsPage />} />} />
            <Route path="/admin/submissions" element={<ProtectedAdminRoute element={<SubmissionsPage />} />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* WhatsApp Floating Button - Visible on all pages */}
        <WhatsAppFloating 
          phoneNumber={WHATSAPP_NUMBER}
          message="Hi! I'm interested in your products. Can you help me?" 
        />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
