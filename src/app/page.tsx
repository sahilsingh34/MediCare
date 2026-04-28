"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  HeartPulse, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Users, 
  Search, 
  Star,
  Activity,
  Smile,
  CheckCircle2
} from "lucide-react";
import { SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const role = user?.publicMetadata?.role as string;
      if (role === 'doctor') {
        router.push("/doctor/dashboard");
      } else {
        router.push("/patient/home");
      }
    }
  }, [isSignedIn, isLoaded, user, router]);

  if (isLoaded && isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Redirecting to your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <HeartPulse size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">MediCare</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
              <Link href="#" className="text-primary font-semibold">Home</Link>
              <Link href="#features" className="hover:text-primary transition-colors">How It Works</Link>
              <Link href="#about" className="hover:text-primary transition-colors">About Us</Link>
              <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <>
                  <Link href="/patient/home" className="text-sm font-medium text-primary hover:text-primary-hover">
                    Go to Portal
                  </Link>
                  <UserButton />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                      Log in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary/20">
                      Sign up
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 lg:mb-0"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-medium mb-6">
                <Star size={16} className="fill-primary" />
                <span>Trusted by 10,000+ Patients</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Health, <br />
                Our <span className="text-primary">Priority</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                Book appointments with trusted doctors, manage your schedule, and get the best care for you and your family in just a few clicks.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isSignedIn ? (
                  <Link href="/patient/home" className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
                    Book Appointment
                    <Calendar size={20} />
                  </Link>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
                      Book Appointment
                      <Calendar size={20} />
                    </button>
                  </SignUpButton>
                )}

                {isSignedIn ? (
                  <Link href="/patient/doctors" className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 shadow-sm">
                    Find Doctors
                    <Search size={20} />
                  </Link>
                ) : (
                  <SignUpButton mode="modal">
                    <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 shadow-sm">
                      Find Doctors
                      <Search size={20} />
                    </button>
                  </SignUpButton>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-6 mt-12 pt-12 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Verified Doctors</h4>
                    <p className="text-sm text-gray-500">Trusted professionals</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Easy Booking</h4>
                    <p className="text-sm text-gray-500">In just a few clicks</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[3/4] bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000" 
                  alt="Doctor with patient" 
                  className="object-cover w-full h-full"
                />
                
                {/* Floating Card */}
                <div className="absolute bottom-6 left-6 right-6 premium-card p-4 flex items-center gap-4 animate-bounce-slow">
                  <div className="flex -space-x-3">
                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1594824436998-d40df9f00028?auto=format&fit=crop&w=100&q=80" alt="Doctor" />
                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80" alt="Doctor" />
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs font-bold">+5</div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-gray-900">Book Appointment</h5>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      4.9/5 (2,500+ reviews)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/50 to-purple-100/50 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MediCare?</h2>
            <p className="text-gray-600">We make healthcare accessible, convenient, and reliable for everyone.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Trusted Doctors", desc: "Connect with verified and experienced doctors across multiple specialties.", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Calendar, title: "Flexible Scheduling", desc: "Choose your preferred date and time that fits your schedule seamlessly.", color: "text-green-500", bg: "bg-green-50" },
              { icon: Clock, title: "Instant Confirmation", desc: "Get instant appointment confirmation and reminders for your bookings.", color: "text-purple-500", bg: "bg-purple-50" },
              { icon: Activity, title: "Comprehensive Care", desc: "From consultations to follow-ups, we provide complete care for you.", color: "text-rose-500", bg: "bg-rose-50" },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="premium-card p-6 border border-gray-50"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="premium-card bg-white p-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {[
              { icon: Smile, stat: "10K+", label: "Happy Patients", color: "text-blue-500" },
              { icon: ShieldCheck, stat: "500+", label: "Expert Doctors", color: "text-green-500" },
              { icon: Calendar, stat: "15K+", label: "Appointments", color: "text-primary" },
              { icon: Star, stat: "4.9/5", label: "Patient Rating", color: "text-rose-500" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center px-4">
                <stat.icon size={32} className={`${stat.color} mb-4`} />
                <h4 className="text-3xl font-bold text-gray-900 mb-1">{stat.stat}</h4>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-md">
                  <HeartPulse size={18} />
                </div>
                <span className="text-xl font-bold text-gray-900">MediCare</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">Providing reliable and premium healthcare services directly to your fingertips.</p>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors cursor-pointer text-xs font-bold">In</div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors cursor-pointer text-xs font-bold">Tw</div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors cursor-pointer text-xs font-bold">Fb</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-primary transition-colors">Find Doctors</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Book Appointment</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Specialties</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Clinic Locations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/doctor/register" className="text-primary font-bold hover:underline">Join as Doctor</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>1800-MEDICARE</li>
                <li>support@medicare.com</li>
                <li>New Delhi, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} MediCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
