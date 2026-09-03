import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, Bell, ChevronDown, type LucideIcon } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import type { UsuarioProfile } from "../../lib/types";
import imgColmenaLogoNormal1 from "../../imports/ColmenaLanding/41ac45f8c7521b60c25adadf954c316d83f63029.png";

/* ------------------------------------------------------------------ */
/* Avatar — foto (si ya la subieron) o un hexágono con la inicial.      */
/* ------------------------------------------------------------------ */

export function Avatar({ nombre, fotoUrl, size = 56 }: { nombre: string; fotoUrl?: string | null; size?: number }) {
  const initial = nombre.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#ffb53e] bg-[#e2e8f0]"
      style={{ width: size, height: size }}
    >
      {fotoUrl ? (
        <img alt={nombre} src={fotoUrl} className="size-full object-cover" />
      ) : (
        <span className="font-extrabold text-[#0a142f]" style={{ fontSize: size * 0.4 }}>
          {initial}
        </span>
      )}
    </div>
  );
}

/** El logo-abeja de Colmena, recortado del sprite del sitio. */
export function BeeLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size * 0.85, height: size }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[464.55%] left-[-175.23%] max-w-none top-[-193.61%] w-[789.1%]" src={imgColmenaLogoNormal1} />
      </div>
    </div>
  );
}

/** Fila de abejas voladoras conectadas por una línea punteada — el detalle
 * decorativo de la cabecera "Bienvenido de nuevo". */
export function FlyingBees() {
  return (
    <div className="relative hidden h-[80px] w-[220px] shrink-0 sm:block">
      <svg className="absolute inset-0 size-full" viewBox="0 0 220 80" fill="none">
        <path d="M4 70 C 50 20, 70 70, 110 40 S 170 15, 214 8" stroke="#ffb53e" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" />
      </svg>
      <div className="absolute left-0 top-[46px]">
        <BeeLogo size={34} />
      </div>
      <div className="absolute left-[92px] top-[16px]">
        <BeeLogo size={30} />
      </div>
      <div className="absolute right-0 top-0">
        <BeeLogo size={38} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar + layout                                                     */
/* ------------------------------------------------------------------ */

export interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

function SidebarContent({ profile, navItems, onNavigate }: { profile: UsuarioProfile; navItems: NavItem[]; onNavigate?: () => void }) {
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col justify-between p-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 pb-2 pt-2 text-center">
          <Avatar nombre={profile.nombre} fotoUrl={profile.foto_url} size={72} />
          <p className="font-bold text-[#0a142f] text-[15px]">{profile.nombre}</p>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ key, label, icon: Icon, end }) => {
            const target = `/dashboard/${key}`;
            const active = end ? location.pathname === target : location.pathname.startsWith(target);
            return (
              <Link
                key={key}
                to={target}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-medium transition-colors ${
                  active ? "bg-black text-white" : "text-[#475569] hover:bg-[#f3f4f6]"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={() => {
          signOut();
          navigate("/login");
        }}
        className="flex items-center justify-center rounded-[12px] bg-black px-5 py-3"
      >
        <p className="font-bold leading-normal text-white text-[14px] whitespace-nowrap">Cerrar Sesión</p>
      </button>
    </div>
  );
}

function TopBar({
  profile,
  homePath,
  configPath,
  onToggleSidebar,
}: {
  profile: UsuarioProfile;
  homePath: string;
  configPath: string;
  onToggleSidebar: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between border-b border-[#e2e8f0] bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#e2e8f0] lg:hidden"
        >
          <Menu size={18} />
        </button>
        <Link to={homePath} className="flex items-center gap-2">
          <div className="relative h-[30px] w-[26px] shrink-0">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="Colmena" className="absolute h-[464.55%] left-[-175.23%] max-w-none top-[-193.61%] w-[789.1%]" src={imgColmenaLogoNormal1} />
            </div>
          </div>
          <span className="font-extrabold text-[#0a142f] text-[18px]">Colmena</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" aria-label="Notificaciones" className="flex h-9 w-9 items-center justify-center rounded-[10px] hover:bg-[#f3f4f6]">
          <Bell size={18} className="text-[#475569]" />
        </button>
        <Link to={configPath} className="flex items-center gap-2">
          <Avatar nombre={profile.nombre} fotoUrl={profile.foto_url} size={32} />
          <span className="hidden text-[14px] font-medium text-[#0a142f] sm:block">{profile.nombre}</span>
          <ChevronDown size={16} className="hidden text-[#475569] sm:block" />
        </Link>
      </div>
    </div>
  );
}

/** Sidebar + top bar reutilizable para cualquier dashboard (Creativo o Cliente). */
export function DashboardLayout({
  profile,
  navItems,
  homePath,
  configPath,
  children,
}: {
  profile: UsuarioProfile;
  navItems: NavItem[];
  homePath: string;
  configPath: string;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setSidebarOpen(false), [location.pathname]);

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc]" data-name="dashboard-layout">
      <aside className="hidden w-[260px] shrink-0 border-r border-[#e2e8f0] bg-white lg:block">
        <SidebarContent profile={profile} navItems={navItems} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl">
            <SidebarContent profile={profile} navItems={navItems} onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen w-full flex-1 flex-col">
        <TopBar profile={profile} homePath={homePath} configPath={configPath} onToggleSidebar={() => setSidebarOpen(true)} />
        <div className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel genérico + estado vacío                                        */
/* ------------------------------------------------------------------ */

export function Panel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`flex w-full flex-col gap-4 rounded-[16px] border border-[#e2e8f0] bg-white p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="font-bold text-[#0a142f] text-[16px]">{title}</p>
        {action}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-1 rounded-[12px] border border-dashed border-[#e2e8f0] py-8 text-center">
      <p className="text-[14px] text-[#94a3b8]">{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Páginas "próximamente" para secciones aún sin construir               */
/* ------------------------------------------------------------------ */

export function ComingSoon({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-[#e2e8f0] bg-white px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-[14px] bg-[#fef3c7]">
        <Icon size={24} className="text-[#0a142f]" />
      </div>
      <p className="font-bold text-[#0a142f] text-[18px]">{title}</p>
      <p className="max-w-[360px] text-[14px] text-[#64748b]">Esta sección todavía no está disponible — la vamos a ir habilitando en las próximas etapas.</p>
    </div>
  );
}
