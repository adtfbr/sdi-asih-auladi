"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function ConditionalLayout({ children, settings }: { children: React.ReactNode, settings?: any }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar settings={settings} />}
      <main className="flex-1 flex flex-col">{children}</main>
      {!isDashboard && <Footer settings={settings} />}
    </>
  );
}
