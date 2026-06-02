import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/auth-context";
import { NavigationProvider } from "@/contexts/navigation-context";
import { GlobalLoader } from "@/components/global-loader";
import Scroll from "@/components/scroll";
import ModalWrapper from "@/components/modal-wrapper";
import LoginModalWrapper from "@/components/login-modal-wrapper";
import { DocumentUploadModal } from "@/components/document-upload-modal";

import Campaign from "@/app/page";
import HomePage from "@/app/home/page";
import AboutUsPage from "@/app/about-us/page";
import AuthCallbackPage from "@/app/auth/callback/page";
import CalendarPage from "@/app/calendar/page";
import RaceDetailPage from "@/app/calendar/[id]/page";
import EditRacePage from "@/app/calendar/[id]/edit/page";
import CreateRacePage from "@/app/calendar/create/page";
import CoachingPage from "@/app/coaching/page";
import ConfirmEmailPage from "@/app/confirm-email/page";
import ContactPage from "@/app/contact/page";
import CyclingTeamPage from "@/app/cycling-team/page";
import ForbiddenPage from "@/app/forbidden/page";
import GalleryIndexPage from "@/app/gallery/page";
import GalleryAlbumPage from "@/app/gallery/[slug]/page";
import GetStartedPage from "@/app/get-started/page";
import LoginPage from "@/app/login/page";
import NSC2026Page from "@/app/nsc-2026/page";
import NewsIndexPage from "@/app/news/page";
import NewsDetailPage from "@/app/news/[slug]/page";
import EditNewsPage from "@/app/news/[slug]/edit/page";
import CreateNewsPage from "@/app/news/create/page";
import PartnersPage from "@/app/partners/page";
import PersonalCoachingPage from "@/app/personal-coaching/page";
import ProfilePage from "@/app/profile/page";
import EditProfilePage from "@/app/profile/edit/page";
import RegisterPage from "@/app/register/page";
import RegisterSuccessPage from "@/app/register/success/page";
import SocialRidesPage from "@/app/social-rides/page";
import TermsAndConditionsPage from "@/app/terms-and-conditions/page";
import TrainersPage from "@/app/trainers/page";
import TrainingsPage from "@/app/trainings/page";
import CyclingTrainingsPage from "@/app/trainings/cycling-trainings/page";
import RunningTrainingsPage from "@/app/trainings/running-trainings/page";
import TriathlonTrainingsPage from "@/app/trainings/triathlon-trainings/page";

import DashboardLayout from "@/app/dashboard/layout";
import DashboardHomePage from "@/app/dashboard/page";
import DashboardProfilePage from "@/app/dashboard/profile/page";
import DashboardMyRacesPage from "@/app/dashboard/my-races/page";
import DashboardMyOrdersPage from "@/app/dashboard/my-orders/page";
import DashboardAllOrdersPage from "@/app/dashboard/all-orders/page";
import DashboardMembersPage from "@/app/dashboard/members/page";
import DashboardPaymentsPage from "@/app/dashboard/payments/page";
import DashboardStoresPage from "@/app/dashboard/stores/page";
import VittoriaStorePage from "@/app/dashboard/vittoria-store/page";
import VittoriaStoreAdminPage from "@/app/dashboard/vittoria-store/admin/page";
import VittoriaStoreCheckoutPage from "@/app/dashboard/vittoria-store/checkout/page";
import VittoriaStoreConfirmationPage from "@/app/dashboard/vittoria-store/confirmation/page";
import FourEnduranceStorePage from "@/app/dashboard/4endurance-store/page";
import FourEnduranceStoreAdminPage from "@/app/dashboard/4endurance-store/admin/page";
import FourEnduranceStoreCheckoutPage from "@/app/dashboard/4endurance-store/checkout/page";
import FourEnduranceStoreConfirmationPage from "@/app/dashboard/4endurance-store/confirmation/page";
import ApparelStorePage from "@/app/dashboard/apparel-store/page";
import ApparelStoreAdminPage from "@/app/dashboard/apparel-store/admin/page";
import ApparelStoreCheckoutPage from "@/app/dashboard/apparel-store/checkout/page";
import ApparelStoreConfirmationPage from "@/app/dashboard/apparel-store/confirmation/page";

import { Navbar, Footer } from "@/components";

function NotFound() {
  return (
    <>
      <Navbar />
      <section className="container mx-auto px-4 py-12 min-h-[calc(100vh-400px)] flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            The page you're looking for doesn't exist.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <GlobalLoader />
        <Scroll />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Campaign />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/calendar/create" element={<CreateRacePage />} />
          <Route path="/calendar/:id" element={<RaceDetailPage />} />
          <Route path="/calendar/:id/edit" element={<EditRacePage />} />

          <Route path="/coaching" element={<CoachingPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cycling-team" element={<CyclingTeamPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          <Route path="/gallery" element={<GalleryIndexPage />} />
          <Route path="/gallery/:slug" element={<GalleryAlbumPage />} />

          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/nsc-2026" element={<NSC2026Page />} />

          <Route path="/news" element={<NewsIndexPage />} />
          <Route path="/news/create" element={<CreateNewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/news/:slug/edit" element={<EditNewsPage />} />

          <Route path="/partners" element={<PartnersPage />} />
          <Route
            path="/personal-coaching"
            element={<PersonalCoachingPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/success" element={<RegisterSuccessPage />} />
          <Route path="/social-rides" element={<SocialRidesPage />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditionsPage />}
          />
          <Route path="/trainers" element={<TrainersPage />} />

          <Route path="/trainings" element={<TrainingsPage />} />
          <Route
            path="/trainings/cycling-trainings"
            element={<CyclingTrainingsPage />}
          />
          <Route
            path="/trainings/running-trainings"
            element={<RunningTrainingsPage />}
          />
          <Route
            path="/trainings/triathlon-trainings"
            element={<TriathlonTrainingsPage />}
          />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHomePage />} />
            <Route path="profile" element={<DashboardProfilePage />} />
            <Route path="my-races" element={<DashboardMyRacesPage />} />
            <Route path="my-orders" element={<DashboardMyOrdersPage />} />
            <Route path="all-orders" element={<DashboardAllOrdersPage />} />
            <Route path="members" element={<DashboardMembersPage />} />
            <Route path="payments" element={<DashboardPaymentsPage />} />
            <Route path="stores" element={<DashboardStoresPage />} />

            <Route path="vittoria-store" element={<VittoriaStorePage />} />
            <Route
              path="vittoria-store/admin"
              element={<VittoriaStoreAdminPage />}
            />
            <Route
              path="vittoria-store/checkout"
              element={<VittoriaStoreCheckoutPage />}
            />
            <Route
              path="vittoria-store/confirmation"
              element={<VittoriaStoreConfirmationPage />}
            />

            <Route
              path="4endurance-store"
              element={<FourEnduranceStorePage />}
            />
            <Route
              path="4endurance-store/admin"
              element={<FourEnduranceStoreAdminPage />}
            />
            <Route
              path="4endurance-store/checkout"
              element={<FourEnduranceStoreCheckoutPage />}
            />
            <Route
              path="4endurance-store/confirmation"
              element={<FourEnduranceStoreConfirmationPage />}
            />

            <Route path="apparel-store" element={<ApparelStorePage />} />
            <Route
              path="apparel-store/admin"
              element={<ApparelStoreAdminPage />}
            />
            <Route
              path="apparel-store/checkout"
              element={<ApparelStoreCheckoutPage />}
            />
            <Route
              path="apparel-store/confirmation"
              element={<ApparelStoreConfirmationPage />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <ModalWrapper />
        <LoginModalWrapper />
        <DocumentUploadModal />
      </NavigationProvider>
    </AuthProvider>
  );
}
