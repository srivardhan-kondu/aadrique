import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Capabilities from "@/pages/Capabilities";
import ServiceDetail from "@/pages/ServiceDetail";
import Industries from "@/pages/Industries";
import IndustryDetail from "@/pages/IndustryDetail";
import Work from "@/pages/Work";
import CaseStudyDetail from "@/pages/CaseStudyDetail";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Insights from "@/pages/Insights";
import ArticleDetail from "@/pages/ArticleDetail";
import FAQPage from "@/pages/FAQPage";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
    <div className="App">
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/capabilities" element={<Capabilities />} />
              <Route path="/capabilities/:slug" element={<ServiceDetail />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/industries/:slug" element={<IndustryDetail />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:slug" element={<CaseStudyDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/:slug" element={<ArticleDetail />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<Legal page="privacy" />} />
              <Route path="/terms" element={<Legal page="terms" />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" theme="dark" toastOptions={{ style: { borderRadius: 0, fontFamily: '"Space Grotesk", sans-serif' } }} />
      </MotionConfig>
    </div>
    </ErrorBoundary>
  );
}

export default App;
