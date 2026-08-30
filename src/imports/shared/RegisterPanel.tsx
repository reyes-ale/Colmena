import { useState } from "react";
import { Link } from "react-router";
import { FormField } from "./FormField";

function ClientTypeToggle({ value, onChange }: { value: "empresa" | "persona"; onChange: (v: "empresa" | "persona") => void }) {
  const options: Array<{ key: "empresa" | "persona"; label: string }> = [
    { key: "empresa", label: "Soy Empresa" },
    { key: "persona", label: "Soy Persona Particular" },
  ];
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row" role="group" aria-label="Tipo de cliente">
      {options.map(({ key, label }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={`flex flex-1 items-center justify-center rounded-[12px] border-2 px-5 py-3 transition-colors ${
              active ? "border-[#0a142f] bg-black" : "border-[#0a142f] bg-transparent"
            }`}
          >
            <p className={`font-bold leading-normal text-[15px] whitespace-nowrap ${active ? "text-white" : "text-[#0a142f]"}`}>{label}</p>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Shared teal registration panel used by both Registro-Clientes and
 * Registro-Creativos — the two pages are visually identical, they only
 * differ in copy and in the decorative pattern exported per Figma page.
 */
export function RegisterPanel({
  decorPaths,
  decorViewBox,
  decorFill,
  logoImg,
  logoImgAlt,
  title,
  subtitle,
  nameLabel,
  namePlaceholder,
  showClientTypeToggle = false,
}: {
  decorPaths: string[];
  decorViewBox: string;
  decorFill: string;
  logoImg: string;
  logoImgAlt: string;
  title: string;
  subtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  showClientTypeToggle?: boolean;
}) {
  const [clientType, setClientType] = useState<"empresa" | "persona">("empresa");
  const effectiveNameLabel = showClientTypeToggle && clientType === "persona" ? "Nombre completo" : nameLabel;
  const effectiveNamePlaceholder = showClientTypeToggle && clientType === "persona" ? "Nombre ejemplo" : namePlaceholder;

  return (
    <div className="relative w-full shrink-0 overflow-hidden bg-[#0d718c]" data-name="Login">
      <svg className="absolute inset-0 size-full" fill="none" preserveAspectRatio="xMidYMid slice" viewBox={decorViewBox}>
        <g>
          {decorPaths.map((d, i) => (
            <path key={i} d={d} fill={decorFill} fillOpacity="0.56" />
          ))}
        </g>
      </svg>

      <div className="relative mx-auto flex w-full max-w-[1300px] flex-col items-center gap-12 px-4 py-16 sm:px-8 md:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-16 lg:py-24">
        <div className="relative flex w-full max-w-[480px] flex-col items-center gap-8 text-center lg:items-start lg:text-left">
          <div className="relative h-[70px] w-[260px] sm:h-[90px] sm:w-[330px]" data-name="colmena-logo-celeste 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt={logoImgAlt} className="absolute h-[318.47%] left-[-12.58%] max-w-none top-[-109.69%] w-[123.05%]" src={logoImg} />
            </div>
          </div>
          <p className="font-normal leading-normal text-white text-[18px] sm:text-[24px]">Conectamos talento creativo con oportunidades.</p>
        </div>

        <div className="relative flex w-full max-w-[560px] flex-col items-center gap-6 rounded-[24px] bg-[#7ec0d3] p-8 text-center sm:p-10 lg:max-w-[600px]">
          <p className="font-extrabold leading-normal text-[#0a142f] text-[28px] sm:text-[32px] lg:text-[40px]">{title}</p>
          <p className="max-w-[420px] font-normal leading-normal text-[16px] text-[rgba(0,0,0,0.69)] sm:text-[20px]">{subtitle}</p>

          {showClientTypeToggle && <ClientTypeToggle value={clientType} onChange={setClientType} />}

          <form className="flex w-full flex-col items-stretch gap-5 text-left" onSubmit={(e) => e.preventDefault()}>
            <FormField label={effectiveNameLabel} name="name" placeholder={effectiveNamePlaceholder} autoComplete="name" />
            <FormField label="Teléfono" type="tel" name="phone" placeholder="XXXXXXXX" autoComplete="tel" />
            <FormField label="Correo electrónico" type="email" name="email" placeholder="ejemplo@gmail.com" autoComplete="email" />
            <FormField label="Contraseña" type="password" name="password" placeholder="***********" autoComplete="new-password" />
            <FormField label="Confirmar contraseña" type="password" name="confirmPassword" placeholder="***********" autoComplete="new-password" />

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-[12px] border-2 border-[#0a142f] bg-black px-7 py-3.5"
              data-name="button"
            >
              <p className="font-bold leading-normal text-white text-[15px] whitespace-nowrap">Registrarse</p>
            </button>
          </form>

          <p className="text-[16px] text-[#1e1e1e] sm:text-[18px]">
            <span className="font-medium text-[#1e1e1e]">¿Ya tienes cuenta? </span>
            <Link to="/login" className="font-extrabold underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
