import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import About from "./pages/About";
import Journal from "./pages/Journal";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

// Storefront chrome (header/footer/cart). The dashboard renders its own layout.
function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<StoreLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<LegalPage docKey="terms" />} />
              <Route path="/privacy" element={<LegalPage docKey="privacy" />} />
              <Route path="/refund-policy" element={<LegalPage docKey="refund-policy" />} />
              <Route path="/shipping-policy" element={<LegalPage docKey="shipping-policy" />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
