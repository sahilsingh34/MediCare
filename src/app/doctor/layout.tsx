"use client";

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

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  const navItems = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/doctor/appointments", icon: CalendarCheck },
    { name: "Schedule", href: "/doctor/schedule", icon: Clock },
    { name: "Patients", href: "/doctor/patients", icon: Users },
    { name: "Profile", href: "/doctor/profile", icon: User },
    { name: "Settings", href: "/doctor/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 shadow-sm z-20">
        <div className="p-6 flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-md">
            <HeartPulse size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 leading-none">MediCare</span>
            <span className="text-[10px] text-gray-500 font-medium">Doctor Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-primary/5 text-primary" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-primary" : "text-gray-400"} />
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
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Welcome back,</p>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Dr. {user?.firstName || 'Arjun Sharma'} 👋
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-full border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">3</span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
               <UserButton />
               <div className="hidden md:flex flex-col">
                 <span className="text-sm font-semibold text-gray-900 leading-tight">Dr. {user?.firstName || 'Arjun Sharma'}</span>
                 <span className="text-xs text-gray-500">{user?.publicMetadata?.specialty as string || 'Cardiologist'}</span>
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
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
