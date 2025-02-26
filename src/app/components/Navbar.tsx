"use client"
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { title: "Home", href: "/" },
    { title: "Library", href: "/library"}
  ];

  return (
    <nav className="text-black p-4 mb-8 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Nile Project Data
        </Link>
        <div className="space-x-4 flex items-center">
          {navItems.map(item => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={pathname === item.href ? "text-primary font-bold" : "hover:text-primary"}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

