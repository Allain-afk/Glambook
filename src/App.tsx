import { useState, useEffect } from 'react';
import GlamBookDashboard from './components/GlamBookDashboard';
import LandingPage from './components/LandingPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Add manifest link to head
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Add meta tags for PWA
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    metaThemeColor.content = '#030213';
    document.head.appendChild(metaThemeColor);

    const metaAppleMobileWebAppCapable = document.createElement('meta');
    metaAppleMobileWebAppCapable.name = 'apple-mobile-web-app-capable';
    metaAppleMobileWebAppCapable.content = 'yes';
    document.head.appendChild(metaAppleMobileWebAppCapable);

    const metaAppleMobileWebAppStatusBarStyle = document.createElement('meta');
    metaAppleMobileWebAppStatusBarStyle.name = 'apple-mobile-web-app-status-bar-style';
    metaAppleMobileWebAppStatusBarStyle.content = 'black-translucent';
    document.head.appendChild(metaAppleMobileWebAppStatusBarStyle);

    const metaAppleMobileWebAppTitle = document.createElement('meta');
    metaAppleMobileWebAppTitle.name = 'apple-mobile-web-app-title';
    metaAppleMobileWebAppTitle.content = 'GlamBook';
    document.head.appendChild(metaAppleMobileWebAppTitle);

    // Add viewport meta tag for mobile optimization
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');

    return () => {
      // Cleanup
      document.head.removeChild(manifestLink);
      document.head.removeChild(metaThemeColor);
      document.head.removeChild(metaAppleMobileWebAppCapable);
      document.head.removeChild(metaAppleMobileWebAppStatusBarStyle);
      document.head.removeChild(metaAppleMobileWebAppTitle);
    };
  }, []);

  const handleEnterDashboard = () => {
    setShowDashboard(true);
  };

  const handleBackToLanding = () => {
    setShowDashboard(false);
  };

  return (
    <div className="size-full">
      {showDashboard ? (
        <GlamBookDashboard onBackToLanding={handleBackToLanding} />
      ) : (
        <LandingPage onEnterDashboard={handleEnterDashboard} />
      )}
      <Toaster />
    </div>
  );
}