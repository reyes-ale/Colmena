import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import svgPaths from "./svg-37onh1gkby";
import imgColmenaLogoNormal1 from "./41ac45f8c7521b60c25adadf954c316d83f63029.png";
import imgHero from "./ff6b986044aead2c3600accf26c924668bf06d48.png";
import imgImage1 from "./53abd0fca351b1e693fe01c8b2d0df5281759313.png";
import imgImage17 from "./3f82927c9d3f8c62c37682ae00e34d79f30f25a1.png";
import imgFinalCta from "./e992e2284d2277119fe0049c41edcec79d520a48.png";
import imgColmenaLogoAmarillo1 from "./b8c094e83e9356f8b663fb6d35b6e0f860fba372.png";

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Cómo Funciona", href: "#como-funciona" },
  { label: "Para Clientes", href: "#clientes" },
  { label: "Para Creativos", href: "#creativos" },
  { label: "Planes Colmena", href: "#planes" },
];

function NavLinks({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-8 gap-y-4 font-medium text-[#0f172a] text-[15px] ${className}`}>
      {NAV_LINKS.map(({ label, href }) => (
        <a key={label} href={href} onClick={onNavigate} className="cursor-pointer text-left leading-normal">
          {label}
        </a>
      ))}
    </div>
  );
}

function LoginButton() {
  return (
    <Link to="/login" className="flex shrink-0 items-center justify-center rounded-[12px] border-2 border-black bg-transparent px-6 py-3" data-name="button">
      <p className="font-bold leading-normal text-[#0a142f] text-[15px] whitespace-nowrap">Inicia Sesión</p>
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full shrink-0 border-b border-[#e2e8f0] bg-white" data-name="Header">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-20 lg:py-6">
        <div className="relative h-[52px] w-[44px] shrink-0 lg:h-[65px] lg:w-[55px]">
          <div className="flex-none rotate-[-0.29deg]">
            <div className="relative h-[52px] w-[44px] lg:h-[64px] lg:w-[55px]" data-name="colmena-logo-normal 1">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="Colmena" className="absolute h-[464.55%] left-[-175.23%] max-w-none top-[-193.61%] w-[789.1%]" src={imgColmenaLogoNormal1} />
              </div>
            </div>
          </div>
        </div>

        <NavLinks className="hidden lg:flex" />

        <div className="hidden shrink-0 lg:block">
          <LoginButton />
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#e2e8f0] lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-6 border-t border-[#e2e8f0] bg-white px-4 py-6 sm:px-6 lg:hidden">
          <NavLinks className="flex-col items-start gap-4" onNavigate={() => setMenuOpen(false)} />
          <LoginButton />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

function EyebrowBadge({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`inline-flex items-start rounded-[100px] px-3.5 py-1.5 ${className}`} data-name="eyebrow-badge">
      <p className="whitespace-normal font-bold leading-normal text-[#0a142f] text-[11px] uppercase sm:text-[12px]">{children}</p>
    </div>
  );
}

function HeroContentStack() {
  return (
    <div className="relative flex w-full flex-col items-start gap-6" data-name="Hero-Content-Stack">
      <EyebrowBadge className="bg-[#3cb9e5]">CONECTANDO EL FUTURO CREATIVO DE HONDURAS</EyebrowBadge>
      <p className="font-extrabold leading-[1.15] text-black text-[28px] sm:text-[42px] lg:text-[56px]">
        Transforma tu negocio con
        <br className="hidden sm:inline" /> el mejor talento creativo.
      </p>
      <p className="max-w-[720px] font-normal leading-[1.6] text-black text-[16px] sm:text-[18px]">
        Conectamos creativos hondureños con clientes —empresas, emprendimientos y personas— que necesitan soluciones profesionales y con garantía de calidad.
      </p>
    </div>
  );
}

function ButtonSoyCliente() {
  return (
    <Link to="/registro-clientes" className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#ffb53e] px-7 sm:w-auto" data-name="button">
      <p className="font-bold leading-normal text-[#0a142f] text-[15px] whitespace-nowrap">Soy Cliente (Contratar)</p>
    </Link>
  );
}

function ButtonSoyCreativo() {
  return (
    <Link to="/registro-creativos" className="flex h-12 w-full items-center justify-center rounded-[12px] border-2 border-[#0a142f] bg-black px-7 sm:w-auto" data-name="button">
      <p className="font-bold leading-normal text-white text-[15px] whitespace-nowrap">Soy Creativo (Unirme)</p>
    </Link>
  );
}

function HeroCtAs() {
  return (
    <div className="relative flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-start" data-name="Hero-CTAs">
      <ButtonSoyCliente />
      <ButtonSoyCreativo />
    </div>
  );
}

function Hero() {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-start gap-8 overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-20 lg:py-28" data-name="Hero">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgHero} />
        <div className="absolute inset-0 bg-[rgba(203,233,244,0.87)]" />
      </div>
      <HeroContentStack />
      <HeroCtAs />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats bar                                                           */
/* ------------------------------------------------------------------ */

function StatsBar() {
  return (
    <div className="flex w-full shrink-0 flex-col items-center justify-between gap-6 bg-white px-4 py-8 sm:px-6 lg:flex-row lg:px-20 lg:py-10" data-name="Stats-Bar">
      <p className="text-center font-extrabold leading-normal text-[#f59e0b] text-[28px] sm:text-[36px] lg:text-[48px]">Conecta. Crea. Crece.</p>
      <div className="relative h-[36px] w-[166px] shrink-0 lg:h-[51px] lg:w-[237px]" data-name="colmena-logo-normal 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="Colmena" className="absolute h-[320.1%] left-0 max-w-none top-[-109.52%] w-full" src={imgColmenaLogoNormal1} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

/* Physical size of one hex cell — a real length (clamp of vw, not a bare
   "%"), so the shape scales with viewport width consistently on both
   axes. A "%" height computed from a "%" width breaks the moment a
   section's own width:height ratio isn't 1:1 (e.g. a short, ultra-wide
   desktop row), which is why the honeycomb rendered tiny before. */
const HEX_UNIT = "clamp(64px, 6.5vw, 190px)";

/* A single flat-top hexagon cell. x/y are the CENTER position (percent of
   the container), offset by dxFactor/dyFactor hex-units so cells tile
   into a true honeycomb regardless of container aspect ratio. */
function HexCell({ cx, cy, dx, dy, color, opacity = 1 }: { cx: number; cy: number; dx: number; dy: number; color: string; opacity?: number }) {
  const dyPx = (dy * 0.866 - 0.433).toFixed(4); // dy in hex-heights → hex-widths, minus half a cell to center it
  const dxPx = (dx - 0.5).toFixed(4); // minus half a cell to center it
  return (
    <svg
      className="absolute"
      style={{
        left: `calc(${cx}% + (${dxPx}) * ${HEX_UNIT})`,
        top: `calc(${cy}% + (${dyPx}) * ${HEX_UNIT})`,
        width: HEX_UNIT,
        aspectRatio: "100 / 86.6",
      }}
      viewBox="0 0 100 86.6"
      fill="none"
    >
      <polygon points="25,0 75,0 100,43.3 75,86.6 25,86.6 0,43.3" fill={color} fillOpacity={opacity} />
    </svg>
  );
}

/* A tidy 7-cell honeycomb "flower" — one center cell plus its six true
   hex neighbors, via axial hex-grid math — instead of a loose scattered
   patch. dxFactor/dyFactor are in units of hexW/hexH from the center. */
const HONEYCOMB_FLOWER: Array<{ dxFactor: number; dyFactor: number; color: string; opacity?: number }> = [
  { dxFactor: 0, dyFactor: 0, color: "#d97706" },
  { dxFactor: 0.75, dyFactor: 0.5, color: "#f59e0b" },
  { dxFactor: 0.75, dyFactor: -0.5, color: "#ffd081" },
  { dxFactor: 0, dyFactor: -1, color: "#f59e0b" },
  { dxFactor: -0.75, dyFactor: -0.5, color: "#ffe8c2" },
  { dxFactor: -0.75, dyFactor: 0.5, color: "#f59e0b" },
  { dxFactor: 0, dyFactor: 1, color: "#ffd081" },
];

function HexFlower({ centerX, centerY, mirror = false }: { centerX: number; centerY: number; mirror?: boolean }) {
  return (
    <>
      {HONEYCOMB_FLOWER.map(({ dxFactor, dyFactor, color, opacity }, i) => (
        <HexCell key={i} cx={centerX} cy={centerY} dx={mirror ? -dxFactor : dxFactor} dy={dyFactor} color={color} opacity={opacity} />
      ))}
    </>
  );
}

function HowItWorksDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-80 sm:opacity-100">
      <HexFlower centerX={7} centerY={13} />
      <HexFlower centerX={93} centerY={13} mirror />
    </div>
  );
}

function HeadingGroup({ eyebrow, eyebrowClassName, title, subtitle }: { eyebrow: string; eyebrowClassName: string; title: string; subtitle: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-4" data-name="Heading-Group">
      <EyebrowBadge className={eyebrowClassName}>{eyebrow}</EyebrowBadge>
      <p className="w-full text-center font-extrabold leading-normal text-[#0a142f] text-[26px] sm:text-[32px] lg:text-[40px]">{title}</p>
      <p className="w-full max-w-[600px] text-center font-normal leading-normal text-[15px] text-[rgba(0,0,0,0.69)] sm:text-[16px]">{subtitle}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-5 rounded-[16px] bg-[#ffdfad] p-6 sm:p-8" data-name={`Step-Card-${number}`}>
      <p className="font-extrabold leading-normal text-[#3c3c3c] text-[30px] sm:text-[36px]">{number}</p>
      <p className="font-bold leading-normal text-black text-[20px] sm:text-[24px]">{title}</p>
      <p className="font-normal leading-[1.6] text-black text-[15px]">{description}</p>
    </div>
  );
}

function StepsRow() {
  return (
    <div className="flex w-full flex-col items-stretch gap-6 sm:flex-row" data-name="Steps-Row">
      <StepCard number="01" title="Publica tu necesidad" description="Sube un proyecto detallando lo que necesitas: desde un logotipo hasta una campaña de redes sociales." />
      <StepCard number="02" title="Conecta con talento" description="Recibe propuestas de creativos talentosos, listos para dar vida a tu proyecto con calidad profesional." />
      <StepCard number="03" title="Recibe soluciones" description="Colabora de forma segura a través de nuestra plataforma y obtén resultados profesionales listos para implementar." />
    </div>
  );
}

function HowItWorks() {
  return (
    <div id="como-funciona" className="relative flex w-full shrink-0 flex-col items-center gap-10 overflow-hidden bg-[#ffb53e] px-4 py-16 sm:px-6 lg:gap-16 lg:px-20 lg:py-24" data-name="How-It-Works">
      <HowItWorksDecor />
      <div className="relative w-full max-w-[900px]">
        <HeadingGroup
          eyebrow="PROCESO ÁGIL Y SEGURO"
          eyebrowClassName="bg-[#ffd081]"
          title="¿Cómo funciona Colmena?"
          subtitle="Diseñamos un flujo intuitivo para garantizar que tanto clientes como creativos obtengan el máximo valor en cada colaboración."
        />
      </div>
      <div className="relative w-full">
        <StepsRow />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Benefits — Clientes                                                 */
/* ------------------------------------------------------------------ */

function Check() {
  return (
    <svg className="block size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
      <path d={svgPaths.p27200700} stroke="#0A142F" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function BulletItem({ icon, label, badgeClassName }: { icon: React.ReactNode; label: string; badgeClassName: string }) {
  return (
    <div className="flex items-center gap-4" data-name="Frame">
      <div className={`flex size-7 shrink-0 items-center justify-center rounded-[14px] ${badgeClassName}`}>{icon}</div>
      <p className="font-bold leading-normal text-[#0a142f] text-[16px] sm:text-[20px]">{label}</p>
    </div>
  );
}

function BenefitsMipymes() {
  return (
    <div id="clientes" className="relative w-full shrink-0 overflow-hidden bg-white" data-name="Benefits-Mipymes">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute right-[4%] top-[6%] hidden size-[130px] sm:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#CBE9F4" fillOpacity="0.81" r="145.5" />
        </svg>
        <svg className="absolute left-[4%] top-[10%] hidden size-[90px] lg:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#FFDFAD" r="145.5" />
        </svg>
        <svg className="absolute bottom-[8%] right-[6%] hidden size-[130px] sm:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#CBE9F4" fillOpacity="0.55" r="145.5" />
        </svg>
        <svg className="absolute left-[3%] bottom-[16%] hidden size-[60px] lg:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#3cb9e5" fillOpacity="0.35" r="145.5" />
        </svg>
        <svg className="absolute right-[30%] top-[4%] hidden size-[46px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#ffb53e" fillOpacity="0.6" r="145.5" />
        </svg>
        <svg className="absolute right-[3%] top-[40%] hidden size-[54px] lg:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#FFDFAD" fillOpacity="0.9" r="145.5" />
        </svg>
        <svg className="absolute left-[28%] bottom-[5%] hidden size-[64px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#CBE9F4" fillOpacity="0.7" r="145.5" />
        </svg>
        <svg className="absolute left-[16%] top-[3%] hidden size-[40px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#ffb53e" fillOpacity="0.45" r="145.5" />
        </svg>
        <svg className="absolute left-[46%] bottom-[3%] hidden size-[36px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#3cb9e5" fillOpacity="0.5" r="145.5" />
        </svg>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center gap-10 px-4 py-14 sm:px-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-20 lg:py-24">
        <div className="flex w-full flex-col items-start gap-8 lg:max-w-[520px] lg:justify-self-start">
          <EyebrowBadge className="bg-[#fef3c7]">SOLUCIONES PARA CLIENTES</EyebrowBadge>
          <p className="font-extrabold leading-normal text-[#0a142f] text-[26px] sm:text-[32px] lg:text-[40px]">Impulsa tu negocio con ideas frescas y profesionales</p>
          <p className="font-normal leading-[1.6] text-[#475569] text-[16px] sm:text-[20px]">
            Entendemos que los clientes necesitan crecer sin comprometer su presupuesto.{" "}
            <span className="font-bold">Colmena</span> te da acceso directo al nuevo ecosistema de creativos en Honduras.
          </p>

          <div className="flex w-full flex-col items-start gap-4">
            <BulletItem icon={<Check />} label="Talento de Calidad" badgeClassName="bg-[#fef3c7]" />
            <BulletItem icon={<Check />} label="Precios Accesibles" badgeClassName="bg-[#fef3c7]" />
            <BulletItem icon={<Check />} label="Proceso Seguro" badgeClassName="bg-[#fef3c7]" />
          </div>

          <Link to="/registro-clientes" className="flex w-full items-center justify-center rounded-[12px] bg-black px-7 py-3.5 sm:w-auto" data-name="button">
            <p className="font-bold leading-normal text-[#f8fafc] text-[15px] whitespace-nowrap">Quiero contratar talento</p>
          </Link>
        </div>

        <div className="relative flex w-full max-w-[500px] items-center justify-center lg:max-w-none">
          <img alt="Ilustración de negocios en Colmena" className="relative w-full max-w-[640px] object-contain" src={imgImage1} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Benefits — Creativos                                                */
/* ------------------------------------------------------------------ */

function Star() {
  return (
    <svg className="block size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
      <g clipPath="url(#star-clip)">
        <path d={svgPaths.p2145d0f0} stroke="#0A142F" strokeLinecap="round" strokeWidth="2" />
      </g>
      <defs>
        <clipPath id="star-clip">
          <rect fill="white" height="14" width="14" />
        </clipPath>
      </defs>
    </svg>
  );
}

function BenefitsStudents() {
  return (
    <div id="creativos" className="relative w-full shrink-0 overflow-hidden bg-white" data-name="Benefits-Students">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute left-[3%] top-[6%] hidden size-[130px] sm:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#FFDFAD" r="145.5" />
        </svg>
        <svg className="absolute bottom-[8%] right-[4%] hidden size-[130px] sm:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#FFDFAD" r="145.5" />
        </svg>
        <svg className="absolute bottom-[10%] left-[10%] hidden size-[100px] lg:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#CBE9F4" fillOpacity="0.7" r="145.5" />
        </svg>
        <svg className="absolute right-[6%] top-[8%] hidden size-[70px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#FFDFAD" r="145.5" />
        </svg>
        <svg className="absolute left-[26%] top-[6%] hidden size-[50px] lg:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#ffb53e" fillOpacity="0.55" r="145.5" />
        </svg>
        <svg className="absolute right-[3%] bottom-[30%] hidden size-[58px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#3cb9e5" fillOpacity="0.4" r="145.5" />
        </svg>
        <svg className="absolute left-[18%] top-[38%] hidden size-[40px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#ffb53e" fillOpacity="0.45" r="145.5" />
        </svg>
        <svg className="absolute right-[24%] bottom-[6%] hidden size-[46px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#3cb9e5" fillOpacity="0.4" r="145.5" />
        </svg>
        <svg className="absolute left-[4%] top-[36%] hidden size-[64px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#CBE9F4" fillOpacity="0.75" r="145.5" />
        </svg>
        <svg className="absolute right-[32%] bottom-[6%] hidden size-[46px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#FFDFAD" fillOpacity="0.9" r="145.5" />
        </svg>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center gap-10 px-4 py-14 text-center sm:px-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-20 lg:py-24 lg:text-right">
        <div className="relative flex w-full max-w-[500px] items-center justify-center lg:max-w-none">
          <img alt="Creativos hondureños trabajando con Colmena" className="relative w-full max-w-[640px] object-contain" src={imgImage17} />
        </div>

        <div className="flex w-full flex-col items-center gap-6 lg:max-w-[520px] lg:items-end lg:justify-self-end">
          <EyebrowBadge className="bg-[rgba(203,233,244,0.81)]">OPORTUNIDADES PARA CREATIVOS</EyebrowBadge>
          <p className="font-extrabold leading-normal text-[#0a142f] text-[26px] sm:text-[32px] lg:text-[40px]">Impulsa tu carrera creativa con proyectos reales</p>
          <p className="font-normal leading-[1.6] text-[#475569] text-[16px] sm:text-[20px]">
            No dejes que la falta de experiencia te detenga.{" "}
            <span className="font-bold">Colmena</span> te permite aplicar tus habilidades creativas en proyectos comerciales reales y construir tu portafolio.
          </p>

          <div className="flex w-full flex-col items-center gap-4 lg:items-end">
            <BulletItem icon={<Star />} label="Portafolio Real" badgeClassName="bg-[rgba(203,233,244,0.81)]" />
            <BulletItem icon={<Star />} label="Ingresos Adicionales" badgeClassName="bg-[rgba(203,233,244,0.81)]" />
            <BulletItem icon={<Star />} label="Networking Efectivo" badgeClassName="bg-[rgba(203,233,244,0.81)]" />
          </div>

          <Link to="/registro-creativos" className="flex w-full items-center justify-center rounded-[12px] bg-black px-7 py-3.5 sm:w-auto" data-name="button">
            <p className="font-bold leading-normal text-[#f8fafc] text-[15px] whitespace-nowrap">Quiero ofrecer mis servicios</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Planes / Categorías                                                 */
/* ------------------------------------------------------------------ */

function PlanButton({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex w-full items-center justify-center rounded-[12px] px-7 py-3.5 ${dark ? "bg-white" : "bg-black"}`} data-name="button">
      <p className={`font-bold leading-normal text-[15px] whitespace-nowrap ${dark ? "text-[#0a142f]" : "text-[#f8fafc]"}`}>Seleccionar</p>
    </div>
  );
}

function CategoryCard({
  bgClassName,
  planName,
  price,
  period,
  features,
  dark = false,
}: {
  bgClassName: string;
  planName: string;
  price: string;
  period: string;
  features: string[];
  dark?: boolean;
}) {
  return (
    <div className={`relative flex w-full flex-col items-start gap-5 rounded-[16px] border border-[#e2e8f0] p-6 ${bgClassName}`} data-name={`Category-Card-${planName}`}>
      <p className={`font-bold leading-normal text-[22px] sm:text-[23px] ${dark ? "text-white" : "text-[#0a142f]"}`}>{planName}</p>
      <p className={`flex flex-wrap items-baseline gap-1 leading-[1.5] ${dark ? "text-white" : "text-black"}`}>
        <span className="whitespace-nowrap font-extrabold text-[36px] sm:text-[48px] lg:text-[38px] 2xl:text-[48px]">{price}</span>
        <span className="font-extrabold text-[22px] sm:text-[28px] lg:text-[22px] 2xl:text-[28px]">{period}</span>
      </p>
      <ul className={`list-disc space-y-1 pl-5 font-normal text-[14px] ${dark ? "text-white/80" : "text-[rgba(0,0,0,0.71)]"}`}>
        {features.map((f) => (
          <li key={f} className="leading-[1.5]">
            {f}
          </li>
        ))}
      </ul>
      <PlanButton dark={dark} />
    </div>
  );
}

function CategoryGroupLabel({
  className,
  textClassName = "text-[#0a142f]",
  children,
}: {
  className: string;
  textClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex w-full max-w-[420px] items-center justify-center overflow-hidden rounded-[100px] px-3.5 py-2 ${className}`} data-name="category-label">
      <p className={`font-bold leading-normal ${textClassName} text-[14px] uppercase whitespace-nowrap sm:text-[16px]`}>{children}</p>
    </div>
  );
}

function CreativeCategories() {
  return (
    <div id="planes" className="relative w-full shrink-0 overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-20 lg:py-24" data-name="Creative-Categories">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute left-[3%] top-[4%] hidden size-[130px] sm:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#FFDFAD" r="145.5" />
        </svg>
        <svg className="absolute right-[4%] bottom-[6%] hidden size-[110px] lg:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#CBE9F4" fillOpacity="0.81" r="145.5" />
        </svg>
        <svg className="absolute right-[10%] top-[4%] hidden size-[54px] lg:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#ffb53e" fillOpacity="0.5" r="145.5" />
        </svg>
        <svg className="absolute left-[12%] bottom-[6%] hidden size-[64px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#3cb9e5" fillOpacity="0.35" r="145.5" />
        </svg>
        <svg className="absolute left-[30%] top-[3%] hidden size-[38px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#3cb9e5" fillOpacity="0.4" r="145.5" />
        </svg>
        <svg className="absolute right-[26%] bottom-[3%] hidden size-[42px] xl:block" fill="none" viewBox="0 0 291 291">
          <circle cx="145.5" cy="145.5" fill="#FFDFAD" fillOpacity="0.9" r="145.5" />
        </svg>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center gap-10 lg:gap-14">
        <HeadingGroup
          eyebrow="Funcionalidades pro"
          eyebrowClassName="bg-[#ffb53e]"
          title="Planes Colmena"
          subtitle="Selecciona el plan que más se adhiera a tus necesidades."
        />

        <div className="flex w-full flex-wrap items-start justify-center gap-6">
          <div className="flex w-full flex-col items-center gap-6 lg:w-[calc(50%-12px)]">
            <CategoryGroupLabel className="bg-[#ffb53e]">Para Creativos</CategoryGroupLabel>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
              <CategoryCard
                bgClassName="bg-[#ffd081]"
                planName="Gratuito"
                price="L. 0"
                period="/mes"
                features={["Perfil y portafolio", "Envío de propuestas", "Mensajería directa", "3 proyectos al mes"]}
              />
              <CategoryCard
                bgClassName="bg-[rgba(251,170,35,0.87)]"
                planName="Colmena Plus"
                price="L. 200"
                period="/mes"
                features={["Proyectos ilimitados", "Perfil destacado", "Estadísticas", "E-learning"]}
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-6 lg:w-[calc(50%-12px)]">
            <CategoryGroupLabel className="bg-[#3cb9e5]">Para Empresas</CategoryGroupLabel>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
              <CategoryCard
                bgClassName="bg-[rgba(203,233,244,0.81)]"
                planName="Gratuito"
                price="L. 0"
                period="/mes"
                features={["Publicar proyectos", "Recibir propuestas", "Mensajería directa", "3 proyectos al mes"]}
              />
              <CategoryCard
                bgClassName="bg-[rgba(60,185,229,0.6)]"
                planName="Colmena Business"
                price="L. 500"
                period="/mes"
                features={["Proyectos ilimitados", "Filtros avanzados", "Panel para empresas", "Soporte prioritario"]}
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-6 lg:w-[calc(50%-12px)]">
            <CategoryGroupLabel className="bg-[#0a142f]" textClassName="text-white">
              Para Clientes
            </CategoryGroupLabel>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
              <CategoryCard
                bgClassName="bg-[#e2e5eb]"
                planName="Gratuito"
                price="L. 0"
                period="/mes"
                features={["Publicar proyectos", "Recibir propuestas", "Mensajería directa", "3 proyectos al mes"]}
              />
              <CategoryCard
                dark
                bgClassName="bg-[#0a142f]"
                planName="Colmena Pro"
                price="L. 350"
                period="/mes"
                features={["Proyectos ilimitados", "Filtros especializados", "Soporte prioritario"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <div className="relative flex w-full shrink-0 flex-col items-center gap-8 overflow-hidden px-4 py-16 text-center sm:px-6 lg:px-20 lg:py-24" data-name="Final-CTA">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-cover size-full" src={imgFinalCta} />
        <div className="absolute inset-0 bg-[rgba(203,233,244,0.81)]" />
      </div>

      <div className="relative flex w-full flex-col items-center gap-4 text-black" data-name="Content-Stack">
        <p className="font-extrabold leading-normal text-[26px] sm:text-[32px] lg:text-[40px]">¿Listo para dar el siguiente paso?</p>
        <p className="w-full max-w-[600px] font-normal leading-normal text-[15px] sm:text-[16px]">
          Únete hoy a la comunidad que está transformando el panorama empresarial y profesional de Honduras. Registro 100% gratuito.
        </p>
      </div>

      <div className="relative flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row" data-name="CTA-Row">
        <Link to="/registro-clientes" className="flex items-center justify-center rounded-[12px] bg-[#ffb53e] px-7 py-3.5" data-name="button">
          <p className="font-bold leading-normal text-[#0a142f] text-[15px] whitespace-nowrap">Contratar Talento</p>
        </Link>
        <Link to="/registro-creativos" className="flex items-center justify-center rounded-[12px] border-2 border-[#0a142f] bg-black px-7 py-3.5" data-name="button">
          <p className="font-bold leading-normal text-white text-[15px] whitespace-nowrap">Registrarme como Creativo</p>
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

function LogoMark() {
  return (
    <div className="relative size-8 shrink-0 rounded-[8px] bg-[#ffb641]" data-name="Logo-Mark">
      <div className="absolute left-[7px] top-[3px] flex h-[25px] w-[19px] items-center justify-center">
        <div className="flex-none rotate-[-0.08deg]">
          <div className="relative h-[25px] w-[19px]" data-name="colmena-logo-amarillo 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[447.73%] left-[-207.32%] max-w-none top-[-184.87%] w-[864.02%]" src={imgColmenaLogoAmarillo1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col items-start gap-4" data-name="Frame">
      <p className="font-bold uppercase text-[#f59e0b]">{title}</p>
      {links.map((l) => (
        <p key={l} className="font-normal text-[#f8fafc] opacity-80">
          {l}
        </p>
      ))}
    </div>
  );
}

function Heart() {
  return (
    <svg className="block size-4 shrink-0" fill="none" viewBox="0 0 16 16">
      <path d={svgPaths.p3692f680} stroke="#F59E0B" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function Footer() {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-10 bg-black px-4 py-12 sm:px-6 lg:gap-14 lg:px-20 lg:py-20" data-name="Footer">
      <div className="flex w-full flex-col items-start gap-10 lg:flex-row lg:items-start lg:justify-between" data-name="Top-Area">
        <div className="flex w-full max-w-[360px] flex-col items-start gap-4" data-name="Brand-Block">
          <div className="flex items-center gap-3" data-name="Brand">
            <LogoMark />
            <p className="font-extrabold leading-normal text-[#f8fafc] text-[20px] whitespace-nowrap">Colmena</p>
          </div>
          <p className="font-normal leading-[1.6] text-[14px] text-white opacity-70">
            La plataforma líder en Honduras que empodera a los creativos mientras soluciona las necesidades estratégicas de sus clientes.
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-x-16 gap-y-8 text-[14px] leading-normal sm:w-auto" data-name="Links-Row">
          <FooterLinkGroup title="Plataforma" links={["Cómo Funciona", "Para Clientes", "Para Creativos"]} />
          <FooterLinkGroup title="Soporte" links={["Centro de Ayuda", "Políticas de Seguridad", "Términos de Servicio", "Contacto"]} />
        </div>
      </div>

      <div className="h-px w-full bg-[#f8fafc] opacity-10" data-name="Line" />

      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between" data-name="Bottom-Area">
        <p className="font-normal leading-normal text-[#f8fafc] text-[14px] opacity-60">© 2026 Colmena. Todos los derechos reservados.</p>
        <div className="flex items-center gap-2" data-name="Honduran-Pride">
          <Heart />
          <p className="font-bold leading-normal text-[#f8fafc] text-[13px] whitespace-nowrap">Hecho en Honduras</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function ColmenaLanding() {
  return (
    <div className="flex w-full max-w-full flex-col items-start overflow-x-hidden bg-white" data-name="colmena-landing">
      <Header />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <BenefitsMipymes />
      <BenefitsStudents />
      <CreativeCategories />
      <FinalCta />
      <Footer />
    </div>
  );
}
