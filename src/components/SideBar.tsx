import { NavLink } from "react-router-dom"
import { Building, FileBox, Container, Repeat, ChevronLeft, ChevronRight, Package, ShoppingCart } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const SectionHeader = ({ title, isCollapsed }: { title: string; isCollapsed: boolean }) => {
    if (isCollapsed) return null

    return (
        <div className="px-3 mb-3 mt-6 first:mt-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        </div>
    )
}

const MenuItem = ({
    icon: Icon,
    text,
    to,
    isCollapsed,
}: {
    icon: LucideIcon
    text: string
    to: string
    isCollapsed: boolean
}) => (
    <li className="mb-1">
        <NavLink to={to} title={isCollapsed ? text : undefined}>
            {({ isActive }) => (
                <div
                    className={`flex items-center ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"} rounded-lg transition-all duration-200 group relative ${isActive
                            ? "border border-slate-200 bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                >
                    <Icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"} transition-transform group-hover:scale-110`} />
                    {!isCollapsed && <span className="text-sm font-medium">{text}</span>}

                    {/* visual active indicator (no nested link) */}
                    {isActive && !isCollapsed && (
                        <span aria-hidden="true" className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full" />
                    )}
                </div>
            )}
        </NavLink>
    </li>
)

const SideMenu = ({ isVisible, onToggle }: { isVisible: boolean; onToggle: () => void }) => {
    const menuSections = [
        {
            title: "Operaciones",
            items: [{ text: "Órdenes de Compra", icon: ShoppingCart, to: "/sales" }],
        },
        {
            title: "Gestión de Inventario",
            items: [
                { text: "Productos", icon: Package, to: "/products" },
                { text: "Categorías", icon: FileBox, to: "/categories" },
                { text: "Inventario", icon: Container, to: "/inventory" },
                { text: "Movimientos", icon: Repeat, to: "/movements" },
            ],
        },
        {
            title: "Configuración",
            items: [{ text: "Locaciones", icon: Building, to: "/locations" }],
        },
    ]

    return (
        <div className="flex h-screen bg-background font-sans">
            <aside
                className={`${isVisible ? "w-64" : "w-16"
                    } bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out shadow-sm`}
            >
                <div
                    className={`flex items-center ${isVisible ? "justify-between px-4" : "justify-center px-2"
                        } py-6 border-b border-border`}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl flex items-center justify-center w-10 h-10 shadow-lg">
                            <span className="text-primary-foreground font-bold text-lg">M</span>
                        </div>
                        {isVisible && (
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-foreground tracking-tight">MASTERPLAY</span>
                                <span className="text-xs text-muted-foreground">Sistema de Inventario</span>
                            </div>
                        )}
                    </div>
                    {isVisible && (
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-lg hover:bg-accent transition-colors duration-200"
                            title="Contraer menú"
                        >
                            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {!isVisible && (
                    <div className="px-2 py-4 border-b border-border">
                        <button
                            onClick={onToggle}
                            className="w-full p-2 rounded-lg hover:bg-accent transition-colors duration-200"
                            title="Expandir menú"
                        >
                            <ChevronRight className="h-4 w-4 text-muted-foreground mx-auto" />
                        </button>
                    </div>
                )}

                <nav className="flex-1 px-2 py-4 overflow-y-auto">
                    {menuSections.map((section, sectionIndex) => (
                        <div key={section.title}>
                            <SectionHeader title={section.title} isCollapsed={!isVisible} />
                            <ul className="space-y-1">
                                {section.items.map((item) => (
                                    <MenuItem key={item.text} icon={item.icon} text={item.text} to={item.to} isCollapsed={!isVisible} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                {isVisible && (
                    <div className="px-4 py-4 border-t border-border">
                        <div className="text-xs text-muted-foreground text-center">
                            <p className="font-medium">Versión 1.0.0</p>
                            <p>© 2024 MasterPlay</p>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    )
}

export default SideMenu
