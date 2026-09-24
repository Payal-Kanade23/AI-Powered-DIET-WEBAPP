import { FaCalendarDay, FaCamera, FaLeaf } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "./assets/green-logo-transparent-background_943194-17985.avif";

const links = [{ to: "/", label: "Home" }, { to: "/scan", label: "Scan", icon: FaCamera }, { to: "/daily", label: "Daily Goal", icon: FaCalendarDay }, { to: "/week", label: "Weekly Guide" }, { to: "/topic", label: "Learn" }];

export default function Navbar() {
  const { pathname } = useLocation();
  return <nav className="fixed inset-x-0 top-0 z-50 border-b border-green-950/10 bg-green-950 text-white shadow-sm"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 md:px-6"><Link to="/" className="flex shrink-0 items-center gap-2 font-bold"><img src={logo} alt="Diet app" className="h-10 w-10 rounded-full" /><span className="hidden sm:inline">NutriGuide</span><FaLeaf className="text-green-300" /></Link><div className="flex items-center gap-1 overflow-x-auto text-sm font-medium whitespace-nowrap">{links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className={`rounded-lg px-3 py-2 transition ${pathname === to ? "bg-white/15 text-white" : "text-green-100 hover:bg-white/10 hover:text-white"}`}>{Icon && <Icon className="inline mr-1.5" />}{label}</Link>)}</div></div></nav>;
}
