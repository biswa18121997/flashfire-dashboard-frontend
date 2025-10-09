import type React from "react";
import { useEffect, useRef, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  FileText,
  User,
  LogOut,
  ChevronDown,
  Edit2Icon,
  Mail,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { UserContext } from "../state_management/UserContext.tsx";
import { useUserProfile } from "../state_management/ProfileContext";
import { useOperationsStore } from "../state_management/Operations.ts";
import { toastUtils, toastMessages } from "../utils/toast";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  setUserProfileFormVisibility: any;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  setUserProfileFormVisibility,
}) => {
  const navigate = useNavigate();
  const ctx = useContext(UserContext);
  const userDetails = ctx?.userDetails;
  const [user, setUser] = useState(userDetails?.name || "");
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Refs
  const desktopDropdownRef = useRef<HTMLDivElement>(null);   // desktop profile dropdown area
  const mobileProfileRef = useRef<HTMLDivElement>(null);      // mobile profile dropdown container
  const mobileMenuRef = useRef<HTMLDivElement>(null);         // mobile menu dropdown container

  const { userProfile } = useUserProfile();
  const { role } = useOperationsStore();
  const hasProfile = !!userProfile?.email;

  const tabs: TabItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "jobs", label: "Job Tracker", icon: Briefcase },
    { id: "optimizer", label: "Documents", icon: FileText },
  ];

  useEffect(() => {
    setUser(userDetails?.name || "");
  }, [userDetails]);

  // CLICK-OUTSIDE: keep dropdowns open when clicking inside them or on triggers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const clickedInsideDesktop =
        !!desktopDropdownRef.current &&
        desktopDropdownRef.current.contains(target);

      const clickedInsideMobileProfile =
        !!mobileProfileRef.current &&
        mobileProfileRef.current.contains(target);

      const clickedInsideMobileMenu =
        !!mobileMenuRef.current &&
        mobileMenuRef.current.contains(target);

      const clickedOnTrigger = !!target.closest("[data-nav-trigger]");

      if (
        !clickedInsideDesktop &&
        !clickedInsideMobileProfile &&
        !clickedInsideMobileMenu &&
        !clickedOnTrigger
      ) {
        setProfileDropDown(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchUser = () => {
    localStorage.removeItem("userAuth");
    toastUtils.success("Switching to operations view...");
    navigate("/manage");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser("");
    toastUtils.success(toastMessages.logoutSuccess);
    navigate("/login");
  };

  const handleLogin = () => navigate("/login");

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0].toUpperCase()}${parts[1][0].toUpperCase()}`;
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="./Logo.png"
                alt="FLASHFIRE"
                className="rounded-md w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                FLASHFIRE
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium -mt-0.5 tracking-wide uppercase">
                Workflow Optimization
              </p>
            </div>
          </Link>

          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center gap-4">
            {tabs.map(({ id, label, icon: Icon }) => (
              <Link
                key={id}
                to="/"
                onClick={() => onTabChange(id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden group ${
                  activeTab === id
                    ? "bg-gradient-to-r from-orange-500/10 to-red-500/10 text-gray border border-red-500/50 shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-4 h-4 relative z-10 ${
                    activeTab === id ? "text-gray" : "group-hover:text-gray"
                  }`}
                />
                <span
                  className={`hidden sm:block relative z-10 ${
                    activeTab === id ? "text-gray" : "group-hover:text-gray"
                  }`}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Buttons */}
            <div className="flex md:hidden items-center gap-2">
              <button
                data-nav-trigger
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setProfileDropDown(false);
                }}
                className="p-2 rounded-md border border-border/50 hover:bg-orange-50 transition-all duration-200"
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {user && (
                <button
                  data-nav-trigger
                  onClick={() => {
                    setProfileDropDown(!profileDropDown);
                    setMenuOpen(false);
                  }}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow hover:opacity-90 transition-all"
                >
                  {getInitials(user)}
                </button>
              )}
            </div>

            {/* Desktop Profile Section */}
            {user ? (
              <div className="relative hidden md:block" ref={desktopDropdownRef}>
                <button
                  data-nav-trigger
                  onClick={() => setProfileDropDown(!profileDropDown)}
                  className="relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 border border-border/50 hover:border-red-500/50 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <User className="w-5 h-5 text-gray" />
                  <div className="hidden md:block text-left relative z-10">
                    <p className="text-sm font-semibold text-foreground leading-none">
                      {user}
                    </p>
                    <p className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-1">
                      Account Settings
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 relative z-10 ${
                      profileDropDown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileDropDown && (
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 hidden md:block">
                    <Link to="/profile" target="_blank" rel="noopener noreferrer">
                      <div className="relative flex items-center gap-4 p-5 bg-gradient-to-br from-orange-50 to-red-50 border-b border-border hover:from-orange-100 hover:to-red-100 transition-all duration-300 group">
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-foreground truncate">
                            {user}
                          </p>
                          <p className="text-sm text-orange-600 font-medium flex items-center gap-1 mt-0.5">
                            View profile <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Email + Plan */}
                    <div className="p-5 space-y-5 bg-gradient-to-b from-transparent to-gray-50/50">
                      <div className="space-y-2 p-4 rounded-xl bg-white border border-border/50">
                        <div className="flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-orange-600" />
                          <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                            Email Address
                          </p>
                        </div>
                        <p className="text-sm text-foreground font-medium pl-6">
                          {userDetails?.email}
                        </p>
                      </div>

                      <div className="space-y-2 p-4 rounded-xl bg-white border border-border/50">
                        <div className="flex items-center gap-2.5">
                          <CreditCard className="w-4 h-4 text-orange-600" />
                          <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                            Current Plan
                          </p>
                        </div>
                        <div className="pl-6">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            {userDetails?.planType || "Free"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border p-3 bg-gray-50/50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Absolute Mobile Menu */}
      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-16 right-3 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fade-in md:hidden"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onTabChange(id);
                setMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-left transition-all ${
                activeTab === id
                  ? "bg-gradient-to-r from-orange-100 to-red-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Absolute Mobile Profile Dropdown */}
      {profileDropDown && (
        <div
          ref={mobileProfileRef}
          className="absolute top-16 right-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-fade-in p-5 space-y-5 md:hidden"
        >
          <Link to="/profile" target="_blank" rel="noopener noreferrer">
            <div className="relative flex items-center gap-4 p-5 bg-gradient-to-br from-orange-50 to-red-50 border-b border-border hover:from-orange-100 hover:to-red-100 transition-all duration-300 group">
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground truncate">
                  {user}
                </p>
                <p className="text-sm text-orange-600 font-medium flex items-center gap-1 mt-0.5">
                  View profile
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </p>
              </div>
            </div>
          </Link>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white border border-border/50">
              <div className="flex items-center gap-2.5 mb-1">
                <Mail className="w-4 h-4 text-orange-600" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </p>
              </div>
              <p className="text-sm text-gray-800 font-medium pl-6">
                {userDetails?.email}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-border/50">
              <div className="flex items-center gap-2.5 mb-1">
                <CreditCard className="w-4 h-4 text-orange-600" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Current Plan
                </p>
              </div>
              <div className="pl-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  {userDetails?.planType || "Free"}
                </span>
              </div>
            </div>

            {!hasProfile && (
              <button
                onClick={() => setUserProfileFormVisibility(true)}
                className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <Edit2Icon className="w-4 h-4" />
                Setup Profile
              </button>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
