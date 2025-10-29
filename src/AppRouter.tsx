import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CourseType } from "./utils/mockData";
import { AuthProvider } from "./components/Header";
import { MarketplaceRouter } from "./pages/marketplace/MarketplaceRouter";
import { App } from './App';
import MarketplaceDetailsPage from "./pages/marketplace/MarketplaceDetailsPage";
import AssetLibraryPage from "./pages/assetLibrary";
import DQAgileKPIsPage from "./pages/play/DQAgileKPIsPage";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import ProtectedRoute from "./components/ProtectedRoute";
import DiscoverDQ from "./pages/DiscoverDQ";
import NotFound from "./pages/NotFound";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { DQEventsCalendar } from "./components/DQEventsCalendar";
import KfBot from "./bot/KfBot";
import ThankYou from "./pages/ThankYou";

export function AppRouter() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [compareCourses, setCompareCourses] = useState<CourseType[]>([]);
  const toggleBookmark = (courseId: string) => {
    setBookmarkedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };
  const handleAddToComparison = (course: CourseType) => {
    if (
      compareCourses.length < 3 &&
      !compareCourses.some((c) => c.id === course.id)
    ) {
      setCompareCourses((prev) => [...prev, course]);
    }
  };


  const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://9609a7336af8.ngrok-free.app/services-api",
    }), // <-- Use HttpLink
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <KfBot />
          <Routes>
            <Route path="/*" element={<App />} />
            <Route
              path="/courses/:itemId"
              element={
                <MarketplaceDetailsPage
                  marketplaceType="courses"
                  bookmarkedItems={bookmarkedCourses}
                  onToggleBookmark={toggleBookmark}
                  onAddToComparison={handleAddToComparison}
                />
              }
            />
            <Route
              path="/onboarding/:itemId"
              element={
                <MarketplaceDetailsPage
                  marketplaceType="onboarding"
                />
              }
            />
            <Route
              path="/onboarding/:itemId/details"
              element={
                <MarketplaceDetailsPage
                  marketplaceType="onboarding"
                />
              }
            />
            <Route path="/marketplace/*" element={<MarketplaceRouter />} />
            <Route
              path="/dashboard/*"
              element={
                // <ProtectedRoute>
                  <DashboardRouter />
                // </ProtectedRoute>
              }
            />
            <Route path="/asset-library" element={<AssetLibraryPage />} />
            <Route path="/play/dq-agile-kpis" element={<DQAgileKPIsPage />} />
            <Route path="/discover/dq" element={<DiscoverDQ />} />
            <Route path="/discover-dq" element={<Navigate to="/discover/dq" replace />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/404" element={<NotFound />} />

            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}
