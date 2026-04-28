"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Clock, 
  Users, 
  User, 
  Settings, 
  LogOut,
  Bell,
  HeartPulse,
  Crown
} from "lucide-react";
import NotificationPopover from "@/components/NotificationPopover";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const navItems = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/doctor/appointments", icon: CalendarCheck },
    { name: "Schedule", href: "/doctor/schedule", icon: Clock },
    { name: "Patients", href: "/doctor/patients", icon: Users },
    { name: "Profile", href: "/doctor/profile", icon: User },
    { name: "Settings", href: "/doctor/settings", icon: Settings },
  ];

  const isRegisterPage = pathname === "/doctor/register";

  if (isRegisterPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm z-20">
        <div className="p-8 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <HeartPulse size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 tracking-tight leading-none">MediCare</span>
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mt-1">Doctor Elite</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (pathname !== item.href) setIsNavigating(true);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25 translate-x-1" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:translate-x-1"
                }`}
              >
                <item.icon size={18} className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-primary"} transition-colors`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto mb-4">
           <SignOutButton>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={18} className="text-gray-400" />
                Logout
              </button>
           </SignOutButton>
        </div>


      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div>
            <p className="hidden md:block text-sm text-gray-500 mb-0.5">Welcome back,</p>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="hidden md:inline">{user?.fullName || user?.firstName || 'Doctor'}</span>
              <span className="md:hidden">MediCare</span> 👋
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <NotificationPopover />
            
            <div className="flex items-center gap-3 md:pl-6 md:border-l md:border-gray-100">
               <UserButton />
               <div className="hidden md:flex flex-col">
                 <span className="text-sm font-semibold text-gray-900 leading-tight">{user?.fullName || user?.firstName || 'Doctor'}</span>
                 <span className="text-xs text-gray-500">{user?.publicMetadata?.specialty as string || 'Specialist'}</span>
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative bg-[#F8FAFC]">
          {isNavigating && (
            <div className="absolute top-0 left-0 right-0 h-1 z-50">
              <div className="h-full bg-primary shadow-[0_0_15px_rgba(79,70,229,0.5)] animate-progress-loading"></div>
            </div>
          )}
          <div className={`${isNavigating ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'} transition-all duration-400`}>
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Navigation (Bottom) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        {[navItems[0], navItems[1], navItems[2], navItems[4]].map((item) => (
          <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1">
            <item.icon size={20} className={pathname === item.href ? "text-primary" : "text-gray-400"} />
            <span className={`text-[10px] font-medium ${pathname === item.href ? "text-primary" : "text-gray-500"}`}>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
