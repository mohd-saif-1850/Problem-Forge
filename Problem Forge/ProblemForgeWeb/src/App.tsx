import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/Login"
import { VerifyTwoStepVerification } from "./pages/VerifyTwoStepVerification";
import { CreateAccount } from "./pages/CreateAccount";
import { VerifyEmailOtp } from "./pages/VerifyEmailOtp";
import { Profile } from "./pages/Profile";

const Home = () => <div className="text-white p-8">Home Page</div>;
const Problems = () => <div className="text-white p-8">Problems Page</div>;
const Contests = () => <div className="text-white p-8">Contests Page</div>;
const Leaderboard = () => <div className="text-white p-8">Leaderboard Page</div>;
const Settings = () => <div className="text-white p-8">Settings Page</div>;
const Notifications = () => <div className="text-white p-8">Notifications Page</div>;
const Premium = () => <div className="text-white p-8">Premium Page</div>;
const NotFound = () => <div className="text-white p-8">404 - Page Not Found</div>;

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-two-step-verification" element={<VerifyTwoStepVerification />} />
            <Route path="/register" element={<CreateAccount />} />
            <Route path="/verify-email-otp" element={<VerifyEmailOtp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
