import React, { useEffect, useState } from 'react';
import { ExploreDropdown } from './components/ExploreDropdown';
import { MobileDrawer } from './components/MobileDrawer';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationsMenu } from './notifications/NotificationsMenu';
import { NotificationCenter } from './notifications/NotificationCenter';
import { mockNotifications } from './utils/mockNotifications';
import { useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar?: () => void;
  sidebarOpen?: boolean;
  "data-id"?: string;
}

export function Header({
  toggleSidebar,
  sidebarOpen,
  'data-id': dataId
}: HeaderProps) {
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, login } = useAuth();

  // Count unread notifications
  const unreadCount = mockNotifications.filter(notif => !notif.read).length;

  // Sticky header behavior
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNotificationsMenu = () => {
    setShowNotificationsMenu(!showNotificationsMenu);
    if (showNotificationCenter) setShowNotificationCenter(false);
  };

  const openNotificationCenter = () => {
    setShowNotificationCenter(true);
    setShowNotificationsMenu(false);
  };

  const closeNotificationCenter = () => setShowNotificationCenter(false);

  const handleSignIn = () => login();
  const handleSignUp = () => console.log('Sign up clicked');

  useEffect(() => {
    if (!user) {
      setShowNotificationsMenu(false);
      setShowNotificationCenter(false);
    }
  }, [user]);

  return (
    <>
      <header
        className={`flex items-center w-full transition-all duration-300 text-white ${
          isSticky
            ? 'fixed top-0 left-0 right-0 z-40 shadow-lg backdrop-blur-sm'
            : 'relative'
        }`}
        style={{
          background: isSticky
            ? 'linear-gradient(135deg, #FB5535 0%, #1A2E6E 50%, #030F35 100%)'
            : 'linear-gradient(135deg, #FB5535 0%, #1A2E6E 50%, #030F35 100%)',
        }}
        data-id={dataId}
      >
        {/* Logo Section */}
        <Link
          to="/"
          className={`bg-[#030F3] py-2 px-4 flex items-center transition-all duration-300 ${
            isSticky ? 'h-12' : 'h-16'
          }`}
        >
          <img
            src="/dq_logo8.png"
            alt="DQ"
            className={`transition-all duration-300 ${isSticky ? 'h-10' : 'h-12'}`}
          />
        </Link>

        {/* Main Navigation */}
        <div
          className={`flex-1 flex justify-between items-center bg-transparent px-4 transition-all duration-300 ${
            isSticky ? 'h-12' : 'h-16'
          }`}
        >
          {/* Left Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <ExploreDropdown isCompact={isSticky} />
            <Link
              to={'/discover-dq'}
              className={`hover:text-[#FB5535] transition-colors duration-200 cursor-pointer ${
                isSticky ? 'text-sm' : ''
              }`}
            >
              Explore DQ
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center ml-auto relative">
            {user ? (
              <ProfileDropdown
                onViewNotifications={toggleNotificationsMenu}
                unreadNotifications={unreadCount}
              />
            ) : (
              <>
                {/* Desktop CTAs */}
                <div className="hidden lg:flex items-center space-x-3">
                  <button
                    className={`px-4 py-2 text-white border border-white/40 rounded-md hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                      isSticky ? 'text-sm px-3 py-1.5' : ''
                    }`}
                  >
                    Join a Workspace
                  </button>
                  <button
                    className={`px-4 py-2 bg-white text-[#030F35] font-medium rounded-md hover:bg-white/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                      isSticky ? 'text-sm px-3 py-1.5' : ''
                    }`}
                  >
                    Request Support
                  </button>
                  <button
                    className={`px-4 py-2 text-white border border-white/40 rounded-md hover:bg-white hover:text-[#030F35] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                      isSticky ? 'text-sm px-3 py-1.5' : ''
                    }`}
                    onClick={handleSignIn}
                  >
                    Sign In
                  </button>
                </div>

                {/* Tablet Button */}
                <div className="hidden md:flex lg:hidden items-center">
                  <button
                    className={`px-3 py-2 bg-white text-[#030F35] rounded-md hover:bg-white/90 transition-all duration-200 font-medium ${
                      isSticky ? 'text-sm px-2 py-1.5' : 'text-sm'
                    }`}
                  >
                    Request Support
                  </button>
                </div>
              </>
            )}

            {/* Mobile Drawer */}
            <MobileDrawer
              isCompact={isSticky}
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
              isSignedIn={!!user}
            />
          </div>
        </div>
      </header>

      {/* Spacer for sticky header */}
      {isSticky && <div className="h-12"></div>}

      {/* Notifications */}
      {showNotificationsMenu && user && (
        <NotificationsMenu
          onViewAll={openNotificationCenter}
          onClose={() => setShowNotificationsMenu(false)}
        />
      )}

      {showNotificationCenter && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeNotificationCenter}
          ></div>
          <div className="relative bg-white shadow-xl rounded-lg max-w-2xl w-full max-h-[90vh] m-4 transform transition-all duration-300">
            <NotificationCenter onBack={closeNotificationCenter} />
          </div>
        </div>
      )}
    </>
  );
}