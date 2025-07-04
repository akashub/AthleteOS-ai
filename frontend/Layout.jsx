
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "./Entities/User";
import { createPageUrl } from "./src/lib/utils.js";
import {
  Dumbbell,
  LayoutDashboard,
  Zap,
  Play,
  TrendingUp,
  User as UserIcon,
  FolderOpen
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "./Components/ui/sidebar.jsx";

const navigationItems = [
  // {
  //   title: "Dashboard",
  //   url: createPageUrl("Dashboard"),
  //   icon: LayoutDashboard,
  // },
  // {
  //   title: "Collections",
  //   url: createPageUrl("WorkoutCollections"),
  //   icon: FolderOpen,
  // },
  // {
  //   title: "AI Planner",
  //   url: createPageUrl("PlanGenerator"),
  //   icon: Zap,
  // },
  // {
  //   title: "Active Workout",
  //   url: createPageUrl("ActiveWorkout"),
  //   icon: Play,
  // },
  // {
  //   title: "Progress",
  //   url: createPageUrl("Progress"),
  //   icon: TrendingUp,
  // },
  // {
  //   title: "Profile",
  //   url: createPageUrl("Profile"),
  //   icon: UserIcon,
  // },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Collections", url: "/collections", icon: FolderOpen },
  { title: "AI Planner", url: "/plan-generator", icon: Zap },
  { title: "Active Workout", url: "/active-workout", icon: Play },
  { title: "Progress", url: "/progress", icon: TrendingUp },
  { title: "Profile", url: "/profile", icon: UserIcon },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const user = await User.me();
        // If profile is not complete and we are not on the profile page, redirect.
        if (!user.profile_complete && location.pathname !== createPageUrl('Profile')) {
          navigate(createPageUrl('Profile'));
        }
      } catch (error) {
        // User is not logged in, no action needed here.
        // The individual pages will handle lack of auth if they need to.
      }
    };

    checkUserProfile();
  }, [location.pathname, navigate]);

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary: 59 130 246;
            --primary-foreground: 255 255 255;
            --secondary: 15 23 42;
            --secondary-foreground: 255 255 255;
            --accent: 30 41 59;
            --accent-foreground: 255 255 255;
            --background: 255 255 255;
            --foreground: 2 8 23;
            --muted: 248 250 252;
            --muted-foreground: 100 116 139;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .gradient-primary {
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          }

          .gradient-secondary {
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          }

          .glass-effect {
            backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Sidebar className="border-r border-slate-200/60">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">AthleteOS.ai</h2>
                <p className="text-xs text-slate-500 font-medium">AI Workout Planner</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl h-12 ${
                          location.pathname === item.url
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <Link to={createPageUrl("Profile")} className="flex items-center gap-3 w-full hover:bg-slate-100 p-2 rounded-lg transition-colors">
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">My Profile</p>
                <p className="text-xs text-slate-500 truncate">Update your details</p>
              </div>
            </Link>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen bg-white">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">AthleteOS.ai</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
