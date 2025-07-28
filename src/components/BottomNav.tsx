import React, { useState } from "react";

interface BottomNavProps {
  currentScreen: 'dashboard' | 'log' | 'insights' | 'history' | 'calendar' | 'profile' | 'pregnancy';
  onScreenChange: (screen: 'dashboard' | 'log' | 'insights' | 'history' | 'calendar' | 'profile' | 'pregnancy') => void;
}

export function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainNavItems = [
    {
      id: 'dashboard' as const,
      label: 'Home',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#FF2E74]' : 'text-[#867B9F]'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
    },
    {
      id: 'log' as const,
      label: 'Log Symptoms',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#FF2E74]' : 'text-[#867B9F]'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
    },
  ];

  const menuItems = [
    {
      id: 'history' as const,
      label: 'History',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#FF2E74]' : 'text-[#867B9F]'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"/>
        </svg>
      ),
    },
    {
      id: 'calendar' as const,
      label: 'Calendar',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#FF2E74]' : 'text-[#867B9F]'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
    },
    {
      id: 'insights' as const,
      label: 'Insights',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#FF2E74]' : 'text-[#867B9F]'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      ),
    },
    {
      id: 'pregnancy' as const,
      label: 'Pregnancy Planner',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#FF2E74]' : 'text-[#867B9F]'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a5 5 0 0 1 5 5c0 1.38-.56 2.63-1.47 3.54C17.5 12.36 20 15.28 20 19H4c0-3.72 2.5-6.64 4.47-8.46A4.978 4.978 0 0 1 7 7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3c0 .83.34 1.58.88 2.12l.12.12.12-.12A2.978 2.978 0 0 0 15 7a3 3 0 0 0-3-3zm0 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#FF2E74]' : 'text-[#867B9F]'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        </svg>
      ),
    },
  ];

  const handleMenuClick = (screen: any) => {
    onScreenChange(screen);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Main Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5EAE3] px-6 py-2 safe-area-pb">
        <div className="flex justify-center items-center space-x-12">
          {/* Home */}
          {mainNavItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`
                  flex flex-col items-center py-2 px-4 rounded-xl transition-colors
                  ${isActive ? 'bg-[#F5EAE3]' : 'hover:bg-[#F5EAE3]/50'}
                `}
              >
                {item.icon(isActive)}
                <span className={`
                  text-xs font-medium mt-1
                  ${isActive ? 'text-[#FF2E74]' : 'text-[#867B9F]'}
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Hamburger menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center py-2 px-4 rounded-xl transition-colors hover:bg-[#F5EAE3]/50"
          >
            <svg className="w-6 h-6 text-[#867B9F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
            <span className="text-xs font-medium mt-1 text-[#867B9F]">Menu</span>
          </button>
        </div>
      </div>

      {/* Hamburger Menu Overlay */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F5EAE3]">
              <h2 className="text-lg font-semibold text-[#2C2C2C]">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-[#FF2E74] font-bold text-xl hover:text-[#D92663] transition-colors"
              >
                ×
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-6 space-y-4">
              {menuItems.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      w-full flex items-center space-x-4 p-4 rounded-2xl transition-colors
                      ${isActive ? 'bg-[#FF2E74] text-white' : 'bg-[#F5EAE3] text-[#2C2C2C] hover:bg-[#E8D5CE]'}
                    `}
                  >
                    {item.icon(isActive)}
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#F5EAE3]">
              <div className="text-center text-sm text-[#867B9F] space-y-1">
                <div>Klara Flow v1.0</div>
                <div>Developed by <span className="font-semibold text-[#FF2E74]">Klara AI</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
