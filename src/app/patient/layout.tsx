"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";
import { 
  Home, 
  Stethoscope, 
  Calendar, 
  Clock, 
  Heart, 
  User, 
  Settings, 
  HelpCircle,
  Crown,
  Search,
  LogOut,
  HeartPulse
} from "lucide-react";
import NotificationPopover from "@/components/NotificationPopover";

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
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <HeartPulse size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-gray-900 tracking-tight leading-none">MediCare</span>
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mt-1">Patient Elite</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
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



        <div className="px-4 mt-auto mb-4 space-y-4">
          <SignOutButton>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:translate-x-1">
              <LogOut size={18} className="text-gray-400 group-hover:text-red-500" />
              Logout
            </button>
          </SignOutButton>

          {/* User Profile Summary */}
          <div className="p-4 border-t border-gray-100 flex items-center gap-3">
            <UserButton />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-tight">{user?.firstName || 'Patient'}</span>
              <Link href="/patient/profile" className="text-[10px] font-bold text-primary/60 uppercase tracking-widest hover:underline">View Profile</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              <span className="hidden md:inline">Good morning, {user?.fullName || user?.firstName || 'Patient'}! 👋</span>
              <span className="md:hidden">MediCare</span>
            </h1>
            <p className="hidden md:block text-sm text-gray-500">Book appointments with trusted doctors and take care of your health.</p>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden lg:block">
              <input 
                type="text" 
                placeholder="Search doctors, specialties..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
            
            <NotificationPopover />

            <div className="md:hidden">
              <UserButton />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F8FAFC]">
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
