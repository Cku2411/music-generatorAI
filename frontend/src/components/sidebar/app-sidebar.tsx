"use server";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import MenuItems from "./sidebar-menu-items";
import Credits from "./credits";
import { UserButton } from "@daveyplate/better-auth-ui";
import { User } from "lucide-react";
import Upgrade from "./upgrade";

// Menu items.

export async function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary mt-4 mb-12 flex flex-col items-start px-2 text-3xl font-black tracking-wide">
            <p>Music</p>
            <p className="text-lg">Generator</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="mb-2 flex w-full items-center justify-center gap-1 text-xs">
          <Credits />
          <Upgrade />
        </div>
        <UserButton
          variant={"outline"}
          additionalLinks={[
            {
              label: "Customer Portal",
              href: "/customer-portal",
              icon: <User />,
            },
          ]}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
