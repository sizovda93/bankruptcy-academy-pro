import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import CoursePromotionNoAds from "./pages/CoursePromotionNoAds";
import CourseLegalAspectsBfl from "./pages/CourseLegalAspectsBfl";
import CourseSalesPromotion from "./pages/CourseSalesPromotion";
import CourseTransactionDisputes from "./pages/CourseTransactionDisputes";
import CourseNonDischarge from "./pages/CourseNonDischarge";
import CourseEffectiveTeam from "./pages/CourseEffectiveTeam";
import WebinarBankruptcyBusiness from "./pages/WebinarBankruptcyBusiness";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/courses/promotion-without-ads" element={<CoursePromotionNoAds />} />
          <Route path="/courses/legal-aspects-bfl" element={<CourseLegalAspectsBfl />} />
          <Route path="/courses/sales-promotion" element={<CourseSalesPromotion />} />
          <Route path="/courses/transaction-disputes" element={<CourseTransactionDisputes />} />
          <Route path="/courses/non-discharge" element={<CourseNonDischarge />} />
          <Route path="/courses/effective-team" element={<CourseEffectiveTeam />} />
          <Route path="/webinars/bankruptcy-business" element={<WebinarBankruptcyBusiness />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
