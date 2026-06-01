import {
  LayoutDashboard,
  BookOpen,
  Tags,
  Building2,
  Percent,
  ShoppingBag,
  UserCheck,
  Image,
  PenTool
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Panel de control" },
  { icon: BookOpen, label: "Gestión de libros" },
  { icon: Tags, label: "Gestión de géneros" },
  { icon: Building2, label: "Gestión de editoriales" },
  { icon: PenTool, label: "Gestión de autores" },
  { icon: Percent, label: "Gestión de descuentos" },
  { icon: ShoppingBag, label: "Ver pedidos" },
  { icon: UserCheck, label: "Ver usuarios" },
  { icon: Image, label: "Gestión de imágenes" },
];

function Sidebar() {
  return (
    <aside className="w-56 bg-[#7b5b99] min-h-screen fixed left-0 top-0">

      {/* Logo */}
      <div className="p-5">
        <div className="bg-white p-2 rounded">
          <img
            src="/logo.png"
            alt="Entre Letras"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Navegación */}
      <nav className="mt-10 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/90 hover:bg-white/10 text-left"
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;