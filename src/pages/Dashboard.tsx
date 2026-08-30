import { Navigate, Link, useNavigate } from "react-router";
import { useAuth } from "../lib/AuthContext";
import type { UsuarioProfile } from "../lib/types";
import imgColmenaLogoNormal1 from "../imports/ColmenaLanding/41ac45f8c7521b60c25adadf954c316d83f63029.png";

function TopBar({ profile }: { profile: UsuarioProfile }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex w-full items-center justify-between border-b border-[#e2e8f0] px-4 py-4 sm:px-6 lg:px-20">
      <Link to="/" className="relative h-[44px] w-[38px] shrink-0" aria-label="Ir al inicio">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="Colmena" className="absolute h-[464.55%] left-[-175.23%] max-w-none top-[-193.61%] w-[789.1%]" src={imgColmenaLogoNormal1} />
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <p className="hidden text-[14px] text-[#475569] sm:block">
          {profile.nombre} · <span className="text-[#0a142f]">{profile.correo}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            signOut();
            navigate("/login");
          }}
          className="flex items-center justify-center rounded-[12px] border-2 border-black bg-transparent px-5 py-2.5"
        >
          <p className="font-bold leading-normal text-[#0a142f] text-[14px] whitespace-nowrap">Cerrar sesión</p>
        </button>
      </div>
    </div>
  );
}

function ProfileDebugCard({ profile }: { profile: UsuarioProfile }) {
  const rows: Array<[string, string]> = [
    ["id", String(profile.id)],
    ["nombre", profile.nombre],
    ["correo", profile.correo],
    ["rol", profile.rol],
    ["tipo_cliente", profile.tipo_cliente ?? "NULL"],
  ];
  return (
    <div className="w-full max-w-[520px] rounded-[16px] border border-[#e2e8f0] bg-white p-6">
      <p className="mb-4 font-bold text-[#0a142f] text-[16px]">Datos leídos de Supabase (tabla usuarios)</p>
      <dl className="flex flex-col gap-2 text-[14px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-dashed border-[#e2e8f0] pb-2">
            <dt className="text-[#64748b]">{k}</dt>
            <dd className="break-all text-right font-medium text-[#0a142f]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function DashboardShell({
  eyebrow,
  eyebrowClassName,
  title,
  subtitle,
  profile,
}: {
  eyebrow: string;
  eyebrowClassName: string;
  title: string;
  subtitle: string;
  profile: UsuarioProfile;
}) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8 px-4 py-12 sm:px-6 lg:px-20 lg:py-16">
      <div className="flex w-full max-w-[720px] flex-col items-center gap-4 text-center">
        <div className={`inline-flex items-start rounded-[100px] px-3.5 py-1.5 ${eyebrowClassName}`}>
          <p className="font-bold leading-normal text-[#0a142f] text-[12px] uppercase">{eyebrow}</p>
        </div>
        <p className="font-extrabold leading-normal text-[#0a142f] text-[28px] sm:text-[36px]">{title}</p>
        <p className="font-normal leading-normal text-[#475569] text-[16px] sm:text-[18px]">{subtitle}</p>
      </div>
      <ProfileDebugCard profile={profile} />
    </div>
  );
}

function DashboardClienteEmpresa({ profile }: { profile: UsuarioProfile }) {
  return (
    <DashboardShell
      eyebrow="Cliente · Empresa"
      eyebrowClassName="bg-[#3cb9e5]"
      title={`Bienvenido, ${profile.nombre}`}
      subtitle="Este es el panel de cliente empresa. Aquí vivirán tus proyectos, propuestas y contrataciones — próximamente."
      profile={profile}
    />
  );
}

function DashboardClientePersona({ profile }: { profile: UsuarioProfile }) {
  return (
    <DashboardShell
      eyebrow="Cliente · Persona natural"
      eyebrowClassName="bg-[#CBE9F4]"
      title={`Bienvenido, ${profile.nombre}`}
      subtitle="Este es tu panel de cliente. Aquí vivirán tus proyectos, propuestas y contrataciones — próximamente."
      profile={profile}
    />
  );
}

function DashboardCreativo({ profile }: { profile: UsuarioProfile }) {
  return (
    <DashboardShell
      eyebrow="Creativo"
      eyebrowClassName="bg-[#ffb53e]"
      title={`Bienvenido, ${profile.nombre}`}
      subtitle="Este es tu panel de creativo. Aquí vivirán tu portafolio, propuestas y proyectos — próximamente."
      profile={profile}
    />
  );
}

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <p className="text-[#475569]">Cargando…</p>
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-white" data-name="dashboard">
      <TopBar profile={profile} />
      {profile.rol === "creativo" ? (
        <DashboardCreativo profile={profile} />
      ) : profile.tipo_cliente === "empresa" ? (
        <DashboardClienteEmpresa profile={profile} />
      ) : (
        <DashboardClientePersona profile={profile} />
      )}
    </div>
  );
}
