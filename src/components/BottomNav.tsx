interface BottomNavProps {
  currentScreen: 'dashboard' | 'log' | 'insights' | 'history' | 'calendar' | 'profile';
  onScreenChange: (screen: 'dashboard' | 'log' | 'insights' | 'history' | 'calendar' | 'profile') => void;
}

export function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const navItems = [
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
      label: 'Log',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#FF2E74]' : 'text-[#867B9F]'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
    },
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
      id: 'profile' as const,
      label: 'Profile',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-[#FF2E74]' : 'text-[#867B9F]'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5EAE3] px-6 py-2 safe-area-pb">
      <div className="flex justify-around">
        {navItems.map((item) => {
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
      </div>
    </div>
  );
}
