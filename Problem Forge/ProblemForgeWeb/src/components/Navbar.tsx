import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type NavLink = {
  label: string;
  href: string;
  guestAllowed: boolean;
};

const navLinks: NavLink[] = [
  { label: "Home", href: "/", guestAllowed: true },
  { label: "Problems", href: "/problems", guestAllowed: false },
  { label: "Contests", href: "/contests", guestAllowed: false },
  { label: "Leaderboard", href: "/leaderboard", guestAllowed: false },
];

const NavSkeleton = memo(() => (
  <header className="sticky top-0 z-50 h-16 bg-[#0d0d0d] border-b border-white/5 flex items-center px-6">
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-7 h-7 rounded-md bg-white/10" />
      <div className="w-28 h-3.5 rounded bg-white/10" />
    </div>
    <div className="ml-auto flex items-center gap-3 animate-pulse">
      <div className="w-20 h-8 rounded-lg bg-white/10" />
      <div className="w-28 h-8 rounded-lg bg-white/10" />
    </div>
  </header>
));

type AuthDialogProps = {
  targetHref: string;
  onClose: () => void;
};

const AuthDialog = memo(({ targetHref, onClose }: AuthDialogProps) => {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
    >
      <div className="w-full max-w-sm mx-4 bg-[#141414] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/60"
        style={{ animation: "dialogIn 0.18s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 id="auth-dialog-title" className="text-base font-semibold text-white mb-1">
          Login Required
        </h2>
        <p className="text-sm text-white/40 mb-6 leading-relaxed">
          Please sign in or create an account to continue.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
  onClick={() => navigate("/login", { state: { from: targetHref } })}
  className="group relative w-full overflow-hidden cursor-pointer rounded-xl border border-white/10 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
  aria-label="Go to login page"
>
  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

  <span className="relative z-10">
    Login
  </span>
</button>
          <button
            onClick={() => navigate("/register", { state: { from: targetHref } })}
            className="w-full cursor-pointer py-2.5 rounded-xl text-sm font-semibold text-black bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Go to registration page"
          >
            Create Account
          </button>
          <button
            onClick={onClose}
            className="w-full cursor-pointer py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-white/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/10"
            aria-label="Cancel and close dialog"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

type AvatarProps = {
  avatar?: string;
  username: string;
  size?: "sm" | "md";
};

const Avatar = memo(({ avatar, username, size = "md" }: AvatarProps) => {
  const sizeClasses = size === "sm" ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm";

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={username}
        className={`${sizeClasses} rounded-lg object-cover ring-1 ring-white/10`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center font-semibold text-cyan-400`}
      aria-label={`Avatar for ${username}`}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
});

export const Navbar = memo(() => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [authDialog, setAuthDialog] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    (link: NavLink) => {
      if (!link.guestAllowed && !isAuthenticated) {
        setAuthDialog(link.href);
        setMobileOpen(false);
      } else {
        navigate(link.href);
      }
    },
    [isAuthenticated, navigate]
  );

  const handleLogout = useCallback(async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  }, [logout, navigate]);

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  if (isLoading) return <NavSkeleton />;

  return (
    <>
      <header className="sticky top-0 z-50 h-16 bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-6">

          <button
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-lg px-1 group"
            aria-label="Problem Forge home"
          >
            <img
              src="/logo.png"
              alt="Problem Forge"
              className="w-7 h-7 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-semibold text-[15px] tracking-tight text-white/90 group-hover:text-white transition-colors duration-200">
              Problem<span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-red-500 bg-clip-text text-transparent">Forge</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                aria-label={`Navigate to ${link.label}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${
                  isActive(link.href)
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-white/40 cursor-pointer hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2.5">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  aria-label="Go to login"
                  className="group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-400 transition-all duration-300 hover:bg-cyan-500/15 hover:border-cyan-400/40 hover:text-cyan-300 cursor-pointer hover:shadow-[0_0_20px_rgba(34,211,238,0.18)] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  aria-label="Create a new account"
                  className="px-4 cursor-pointer py-2 text-sm font-semibold text-black bg-cyan-400 rounded-xl hover:bg-cyan-300 transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                {user?.subscription === "free" && (
                  <button
                    onClick={() => navigate("/premium")}
                    aria-label="Upgrade to Premium"
                    className="px-3.5 py-2 text-xs font-semibold text-amber-400 border border-amber-400/20 rounded-xl hover:bg-amber-400/5 hover:border-amber-400/40 transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-amber-400/30 tracking-wide uppercase"
                  >
                    ✦ Pro
                  </button>
                )}

                <button
                  onClick={() => navigate("/notifications")}
                  aria-label={`Notifications${user && user.unreadNotifications > 0 ? `, ${user.unreadNotifications} unread` : ""}`}
                  className="relative p-2 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {user && user.unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                  )}
                </button>

                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    aria-label="Open user menu"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <Avatar avatar={user?.avatar} username={user?.username ?? ""} />
                    <span className="text-sm text-white/60 font-medium hidden xl:block max-w-[100px] truncate">
                      {user?.username}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-52 bg-[#141414] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/60 overflow-hidden"
                      style={{ animation: "dropdownIn 0.15s cubic-bezier(0.16,1,0.3,1)" }}
                      role="menu"
                    >
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                        <p className="text-xs text-white/35 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="p-1.5 flex flex-col gap-0.5">
                        <button
                          onClick={() => navigate("/profile")}
                          aria-label="Go to profile"
                          role="menuitem"
                          className="w-full text-left px-3 py-2 text-sm text-white/55 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-150 focus:outline-none focus:bg-white/5 flex items-center gap-2.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </button>
                        <button
                          onClick={() => navigate("/settings")}
                          aria-label="Go to settings"
                          role="menuitem"
                          className="w-full text-left px-3 py-2 text-sm text-white/55 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-150 focus:outline-none focus:bg-white/5 flex items-center gap-2.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </button>
                        <div className="border-t border-white/[0.06] mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            aria-label="Logout"
                            role="menuitem"
                            className="w-full text-left px-3 py-2 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all duration-150 focus:outline-none focus:bg-red-500/5 flex items-center gap-2.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 z-40 bg-[#0d0d0d]/97 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <nav className="flex flex-col p-3 gap-0.5" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                aria-label={`Navigate to ${link.label}`}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${
                  isActive(link.href)
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="border-t border-white/[0.06] mt-3 pt-3 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => { navigate("/login"); setMobileOpen(false); }}
                    aria-label="Go to login"
                    className="w-full py-3 text-sm font-medium text-white/50 border border-white/10 rounded-xl hover:border-white/20 hover:text-white/80 hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate("/register"); setMobileOpen(false); }}
                    aria-label="Create a new account"
                    className="w-full py-3 text-sm font-semibold text-black bg-cyan-400 rounded-xl hover:bg-cyan-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                    <Avatar avatar={user?.avatar} username={user?.username ?? ""} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
                      <p className="text-xs text-white/35 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { navigate("/notifications"); setMobileOpen(false); }}
                    aria-label={`Notifications${user && user.unreadNotifications > 0 ? `, ${user.unreadNotifications} unread` : ""}`}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <span>Notifications</span>
                    {user && user.unreadNotifications > 0 && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                        {user.unreadNotifications}
                      </span>
                    )}
                  </button>

                  {user?.subscription === "free" && (
                    <button
                      onClick={() => { navigate("/premium"); setMobileOpen(false); }}
                      aria-label="Upgrade to Premium"
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-amber-400 border border-amber-400/20 hover:bg-amber-400/5 hover:border-amber-400/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                    >
                      ✦ Upgrade to Pro
                    </button>
                  )}

                  <button
                    onClick={() => { navigate("/profile"); setMobileOpen(false); }}
                    aria-label="Go to profile"
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { navigate("/settings"); setMobileOpen(false); }}
                    aria-label="Go to settings"
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    aria-label="Logout"
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {authDialog && (
        <AuthDialog
          targetHref={authDialog}
          onClose={() => setAuthDialog(null)}
        />
      )}

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.96) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </>
  );
});
