import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Bot,
  Search,
  Bell,
  Users,
  SlidersHorizontal,
  CreditCard,
  ShieldCheck,
  Home,
  Flag,
  GitCompare,
  FlaskConical,
  Gauge,
  Settings2,
  Power,
  LineChart,
  HeartPulse,
  ScrollText,
  Settings,
  BookOpen,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

export const nexusNavItems: NavItem[] = [
  { href: "/nexus/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/nexus/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/nexus/reports", label: "Reports", icon: FileText },
  { href: "/nexus/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/nexus/search", label: "Search", icon: Search },
  { href: "/nexus/notifications", label: "Notifications", icon: Bell },
  { href: "/nexus/users", label: "User Management", icon: Users },
  { href: "/nexus/settings", label: "Settings", icon: Settings2 },
  { href: "/nexus/billing", label: "Billing", icon: CreditCard },
  { href: "/nexus/admin", label: "Admin Console", icon: ShieldCheck },
];

export const evaluationNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/how-openfeature-works", label: "How OpenFeature Works", icon: BookOpen },
  { href: "/flags", label: "Feature Flag Dashboard", icon: Flag },
  { href: "/vendor-comparison", label: "Vendor Comparison", icon: GitCompare },
  { href: "/experiments", label: "Experimentation Lab", icon: FlaskConical },
  { href: "/rollout-simulator", label: "Rollout Simulator", icon: Gauge },
  { href: "/dynamic-config", label: "Dynamic Configuration Lab", icon: SlidersHorizontal },
  { href: "/kill-switches", label: "Kill Switch Control Center", icon: Power },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/provider-health", label: "Provider Health", icon: HeartPulse },
  { href: "/audit-log", label: "Audit Log", icon: ScrollText },
  { href: "/settings", label: "Settings", icon: Settings },
];
