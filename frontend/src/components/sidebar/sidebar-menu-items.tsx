import { Home, Music } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

type Props = {};

const MenuItems = (props: Props) => {
  const path = usePathname();

  let items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      active: false,
    },
    {
      title: "Create",
      url: "/create",
      icon: Music,
      active: false,
    },
  ];

  items = items.map((item) => ({
    ...item,
    active: path === item.url,
  }));

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.active}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};

export default MenuItems;
