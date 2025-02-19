/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import AppLayout from "./components/layout";
import { LoadingSpinner } from "./components/ui/loading";
import { useAuth } from "./hooks/useAuth";
import PageNotFound from "./PageNotFound";
import PageNotPermission from "./PageNotPermission";
import EvenOddHistoryPage from "./pages/even-odd-history";
import HomePage from "./pages/home/HomePage";
import LottoPage from "./pages/lotto";
import TransactionPage from "./pages/transaction";
import UnderOverHistoryPage from "./pages/under-over-history";
import WalletPage from "./pages/wallet";

// game bets
import UnderOverGamePage from "./pages/under-over-game";
import EvenOddGamePage from "./pages/even-odd-game";

import { setNavigate } from "./utils/navigation-services";
import LottoGame from "./pages/lotto-game";
import BannerPage from "./pages/home/BannerPage";

const VerifyToken = ({ type }: { type: string }) => {
  const [searchParams] = useSearchParams();
  const { verifyEmail, verifyGoolge, destroyStatus, user } = useAuth();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      type === "google" ? verifyGoolge(token) : verifyEmail(token);
    }
  }, [token, type]);

  useEffect(() => {
    if (user.data) {
      window.location.replace("/home");
      destroyStatus();
    }
  }, [user]);

  return (
    user.isLoadding && (
      <div className="h-screen w-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  );
};

function NavigationInitializer() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return null;
}

function AppRoute() {
  return (
    <Router>
      <NavigationInitializer />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="transaction" element={<TransactionPage />} />
          <Route path="even-odd-history" element={<EvenOddHistoryPage />} />
          <Route path="under-over-history" element={<UnderOverHistoryPage />} />
          <Route path="even-odd" element={<EvenOddGamePage />} />
          <Route path="under-over" element={<UnderOverGamePage />} />
          <Route path="lotto" element={<LottoPage />} />
          <Route path="deposit" element={<WalletPage />} />
          <Route path="withdraw-history" element={<div></div>} />
          <Route path="wallet" element={<div></div>} />
          <Route path="login" element={<div></div>} />
          <Route path="lotto-game" element={<LottoGame />} />
          <Route path="banner/:id" element={<BannerPage />} />

          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="verify-email" element={<VerifyToken type="mail" />} />
        <Route path="verify-google" element={<VerifyToken type="google" />} />
        <Route path="permission" element={<PageNotPermission />} />
      </Routes>
    </Router>
  );
}
export default AppRoute;
