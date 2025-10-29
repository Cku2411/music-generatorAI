"use client";
import { Home, Music } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import Link from "next/link";

const MENU_ITEMS = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create",
    url: "/create",
    icon: Music,
  },
];

const MenuItems = () => {
  const path = usePathname();

  const items = useMemo(
    () =>
      MENU_ITEMS.map((item) => ({
        ...item,
        active: path === item.url,
      })),
    [path],
  );

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.active}>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};

export default MenuItems;
