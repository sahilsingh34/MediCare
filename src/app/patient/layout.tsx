"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  Home, 
  Stethoscope, 
  Calendar, 
  Clock, 
  Heart, 
  User, 
  Settings, 
  HelpCircle,
  Bell,
  HeartPulse,
  Crown,
  Search
} from "lucide-react";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  const navItems = [
    { name: "Home", href: "/patient/home", icon: Home },
    { name: "Doctors", href: "/patient/doctors", icon: Stethoscope },
    { name: "Appointments", href: "/patient/appointments", icon: Calendar },
    { name: "My Bookings", href: "/patient/bookings", icon: Clock },
    { name: "Favorites", href: "/patient/favorites", icon: Heart },
    { name: "Profile", href: "/patient/profile", icon: User },
    { name: "Settings", href: "/patient/settings", icon: Settings },
    { name: "Help & Support", href: "/patient/support", icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-100 bg-white h-full">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-md">
            <HeartPulse size={18} />
          </div>
          <span className="text-lg font-bold text-gray-900">MediCare</span>
          <span className="text-[10px] text-gray-500 mt-1 ml-1">Patient Portal</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-primary" : "text-gray-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>



        {/* User Profile Summary */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-3">
          <UserButton />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{user?.firstName || 'Patient'}</span>
            <span className="text-xs text-gray-500 cursor-pointer">View Profile</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Good morning, {user?.firstName || 'Priya'}! 👋</h1>
            <p className="text-sm text-gray-500">Book appointments with trusted doctors and take care of your health.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search doctors, specialties..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
            
            <button className="relative p-2 rounded-full border border-gray-100 hover:bg-gray-50 text-gray-600 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>

      {/* Mobile Navigation (Bottom) */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        {[navItems[0], navItems[1], navItems[2], navItems[5]].map((item) => (
          <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1">
            <item.icon size={20} className={pathname === item.href ? "text-primary" : "text-gray-400"} />
            <span className={`text-[10px] font-medium ${pathname === item.href ? "text-primary" : "text-gray-500"}`}>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
