import { Bell, Search } from "lucide-react";

function Header() {
  return (
    <header className="h-16 bg-[#f7f4ef] border-b border-gray-200 px-10 flex items-center justify-between">

      {/* Buscador */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Buscar"
          className="pl-11 pr-4 py-3 text-sm bg-purple-100/50 rounded-lg border-0 outline-none w-72"
        />
      </div>

      {/* Nombre */}
      <h1 className="font-bold text-[#7b5b99] text-lg">
        Entre letras
      </h1>

      {/* Perfil */}
      <div className="flex items-center gap-5">
        <Bell size={18} className="text-gray-600" />

        <div className="w-9 h-9 rounded-full bg-purple-200 border border-purple-300 flex items-center justify-center text-purple-700 text-xs font-bold">
          AD
        </div>
      </div>

    </header>
  );
}

export default Header;