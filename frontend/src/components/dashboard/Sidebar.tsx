import {
    Cloud,
    ShoppingCart,
    BarChart3,
    Bell,
    Activity,
    MapPin,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCity } from "@/contexts/CityContext";
import { useState } from "react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    alertCount?: number;
}

const CitySelector = () => {
    const { selectedCity, setSelectedCity, availableCities } = useCity();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative px-3 mb-2">
            <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/25 mb-2 block px-1">
                Location
            </label>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-left min-w-0">
                        <p className="font-semibold text-sm text-white/90 truncate leading-tight">{selectedCity.name}</p>
                        <p className="text-[10px] text-white/30 truncate">{selectedCity.state}</p>
                    </div>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-white/20 transition-transform duration-300 shrink-0", open && "rotate-180")} />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-3 right-3 top-full mt-2 z-50 rounded-xl border border-white/[0.08] bg-[hsl(220,13%,10%)] shadow-2xl shadow-black/50 max-h-72 overflow-y-auto backdrop-blur-xl">
                        {availableCities.map((city) => (
                            <button
                                key={city.name}
                                onClick={() => {
                                    setSelectedCity(city);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-white/[0.04] transition-all duration-200 text-left",
                                    selectedCity.name === city.name && "bg-emerald-500/10"
                                )}
                            >
                                <MapPin className={cn("w-3.5 h-3.5 shrink-0", selectedCity.name === city.name ? "text-emerald-400" : "text-white/20")} />
                                <div className="min-w-0 flex-1">
                                    <p className={cn("font-medium truncate text-sm", selectedCity.name === city.name ? "text-emerald-400" : "text-white/70")}>{city.name}</p>
                                    <p className="text-[10px] text-white/25 truncate">{city.state}</p>
                                </div>
                                {selectedCity.name === city.name && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export const Sidebar = ({ activeTab, setActiveTab, alertCount = 0 }: SidebarProps) => {
    const menuItems = [
        { id: "sensors", label: "Sensors", icon: <Activity className="w-[18px] h-[18px]" /> },
        { id: "weather", label: "Weather", icon: <Cloud className="w-[18px] h-[18px]" /> },
        { id: "market", label: "Market", icon: <ShoppingCart className="w-[18px] h-[18px]" /> },
        { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-[18px] h-[18px]" /> },
        { id: "alerts", label: "Alerts", icon: <Bell className="w-[18px] h-[18px]" /> },
    ];

    return (
        <div className="hidden md:flex flex-col w-60 border-r border-white/[0.06] h-[calc(100vh-4rem)] sticky top-16 bg-[hsl(220,14%,5%)]">
            <div className="p-4 space-y-1 flex-1">
                {/* City Selector */}
                <CitySelector />

                <div className="h-px bg-white/[0.04] mx-3 my-3" />

                <div className="px-3 mb-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/25 px-1">
                        Dashboard
                    </label>
                </div>

                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-300 relative mx-auto",
                            activeTab === item.id
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                        )}
                    >
                        {activeTab === item.id && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-emerald-400" />
                        )}
                        {item.icon}
                        {item.label}
                        {item.id === 'alerts' && alertCount > 0 && (
                            <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-red-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* Bottom branding */}
            <div className="p-4 border-t border-white/[0.04]">
                <p className="text-[10px] text-white/15 text-center tracking-wider">
                    Group 4 CSSE A · v1.0
                </p>
            </div>
        </div>
    );
};

// Mobile Navigation
export const MobileNav = ({ activeTab, setActiveTab, alertCount = 0 }: SidebarProps) => {
    const menuItems = [
        { id: "sensors", label: "Sensors", icon: <Activity className="w-5 h-5" /> },
        { id: "weather", label: "Weather", icon: <Cloud className="w-5 h-5" /> },
        { id: "market", label: "Market", icon: <ShoppingCart className="w-5 h-5" /> },
        { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
        { id: "alerts", label: "Alerts", icon: <Bell className="w-5 h-5" /> },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[hsl(220,14%,5%)]/95 backdrop-blur-xl border-t border-white/[0.06] z-50 px-2 py-2">
            <div className="flex justify-between items-center">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative",
                            activeTab === item.id
                                ? "text-emerald-400"
                                : "text-white/30 hover:text-white/60"
                        )}
                    >
                        <div className="relative">
                            {item.icon}
                            {item.id === 'alerts' && alertCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                            )}
                        </div>
                        <span className="text-[9px] font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
