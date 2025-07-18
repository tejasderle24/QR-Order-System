import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from 'react-router-dom';
import { Label } from './ui/label';
import {
  LayoutDashboard,
  Users,
  TicketCheck,
  PencilRuler,
  WalletCards,
  CircleUser,
  QrCode
} from 'lucide-react';

const SideBarOptions = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    title: "manage Menu",
    icon: Users,
    path: "/menu"
  },
  {
    title: "Manage Order",
    icon: TicketCheck,
    path: "/orders"
  },
  {
    title: "Generate QR Codes",
    icon: QrCode,
    path: "/qr-codes"
  },
  {
    title: " Manage Tables",
    icon: WalletCards,
    path: "/tables"
  },
  {
    title: "Terms and Conditions",
    icon: CircleUser,
    path: "/terms-and-conditions"
  },
];

function AppSidebar() {

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className="w-64 h-screen border-r bg-white shadow-sm">
      <SidebarHeader className="p-4 border-b flex items-center ">
        <Label className="text-2xl font-bold  text-primary">Admin Panel</Label>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    asChild 
                    className={`p-3 my-1 rounded-lg transition-colors duration-200 ${
                      currentPath.includes(item.path) 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Link
                      to={item.path}
                      className="flex items-center gap-3 w-full"
                    >
                      <item.icon className="h-7 w-7" />
                      <span className="text-base font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Asha Films
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar; 