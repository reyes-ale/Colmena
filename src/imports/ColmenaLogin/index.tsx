import { useState } from "react";
import { Link, useNavigate } from "react-router";
import svgPaths from "./svg-dp0sfwsurr";
import imgColmenaLogoAmarillo2 from "./b8c094e83e9356f8b663fb6d35b6e0f860fba372.png";
import { SiteHeader, AUTH_NAV_LINKS } from "../shared/SiteHeader";
import { SiteFooter } from "../shared/SiteFooter";
import { FormField } from "../shared/FormField";
import { signInUsuario } from "../../lib/auth";
import { useAuth } from "../../lib/AuthContext";

/* Decorative hexagon pattern that fills the orange panel behind the form. */
function LoginPattern() {
  const p = svgPaths;
  const paths = [
    p.p3d715b00, p.pfee1700, p.pd486e00, p.p3e549580, p.p36f96f00, p.p36e4c380, p.p2ed50600, p.p10b66d00,
    p.p245cfa80, p.p204db780, p.p14ef6870, p.p29c1d500, p.p19610c00, p.p3bda1a00, p.pb903980, p.pfff1080,
    p.p27c1a680, p.p23304400, p.p2deff6b0, p.p3b397a80, p.p38f28b00, p.pa4b6680, p.p10108400, p.p32706200,
    p.p21eaa980, p.p19d1ff30, p.p2390b80, p.p1b0aa600, p.p18f91d00, p.pb74e200, p.p2538e100, p.p389b3500,
    p.p2435b9f0, p.p3cf8c680, p.p1d7d7600, p.p196e1b00, p.p2c33e900, p.p3b69bb00, p.p23679100, p.p1e2c4680,
    p.p24f90800, p.p1968b80, p.p18dcab80, p.p63e8df0, p.p3299bf00, p.p21632c00, p.p248cd800, p.p152a7000,
    p.p67a5480, p.p30aff300, p.p117da700, p.p29f4cb00, p.p102c2af1, p.p1988f200, p.p38327d40, p.p3d521970,
    p.p7d90a00, p.p22cf1c00, p.p31d3c100, p.p1b5aad80, p.p16a01680, p.p32466480, p.p320ca900, p.p38b82800,
    p.p151af800, p.p2e6f8000, p.p1ddf0980, p.p31ed0f00, p.p29df91f0, p.p34e55250, p.p26914980, p.p8c3d7c0,
  ];
  return (
    <svg className="absolute inset-0 size-full" fill="none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1807 1090">
      <g>
        {paths.map((d, i) => (
          <path key={i} d={d} fill="#F59D11" fillOpacity="0.46" />
        ))}
      </g>
    </svg>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { setProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { profile, error: signInError } = await signInUsuario(email, password);
    setLoading(false);
    if (signInError || !profile) {
      setError(signInError?.message ?? "Correo o contraseña incorrectos.");
      return;
    }
    setProfile(profile);
    navigate("/dashboard");
  };

  return (
    <div className="relative flex w-full max-w-[560px] flex-col items-center gap-6 rounded-[24px] bg-[#ffd081] p-8 text-center sm:p-10 lg:max-w-[600px]" data-name="Login">
      <p className="font-extrabold leading-normal text-[#0a142f] text-[28px] sm:text-[32px] lg:text-[40px]">Inicia Sesión</p>
      <p className="max-w-[420px] font-normal leading-normal text-[16px] text-[rgba(0,0,0,0.69)] sm:text-[20px]">
        Accede a tu cuenta y encuentra tu lugar en la colmena.
      </p>

      <form className="flex w-full flex-col items-stretch gap-5 text-left" onSubmit={handleSubmit}>
        <FormField
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="ejemplo@gmail.com"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          required
        />
        <FormField
          label="Contraseña"
          type="password"
          name="password"
          placeholder="***********"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          required
        />

        {error && <p className="text-[14px] font-medium text-[#d4183d]">{error}</p>}

        <a href="#" className="self-end text-[14px] font-extrabold text-[#1e1e1e] underline">
          ¿Olvidaste tu contraseña?
        </a>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-[12px] border-2 border-[#0a142f] bg-black px-7 py-3.5 disabled:opacity-60"
          data-name="button"
        >
          <p className="font-bold leading-normal text-white text-[15px] whitespace-nowrap">{loading ? "Iniciando…" : "Iniciar sesión"}</p>
        </button>
      </form>

      <div className="mt-2 flex w-full flex-col items-center gap-4">
        <p className="text-[16px] text-[#1e1e1e] sm:text-[18px]">
          <span className="font-medium text-[#757575]">¿No tienes cuenta? </span>
          <span className="font-extrabold">Regístrate</span>
        </p>

        <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row" data-name="Hero-CTAs">
          <Link to="/registro-clientes" className="flex items-center justify-center rounded-[12px] border-2 border-black bg-transparent px-7 py-3.5" data-name="button">
            <p className="font-bold leading-normal text-[#0a142f] text-[15px] whitespace-nowrap">Soy Cliente</p>
          </Link>
          <Link to="/registro-creativos" className="flex items-center justify-center rounded-[12px] border-2 border-[#0a142f] bg-black px-7 py-3.5" data-name="button">
            <p className="font-bold leading-normal text-white text-[15px] whitespace-nowrap">Soy Creativo</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoginIntro() {
  return (
    <div className="relative flex w-full max-w-[480px] flex-col items-center gap-8 text-center lg:items-start lg:text-left">
      <div className="relative h-[80px] w-[290px] sm:h-[100px] sm:w-[360px]" data-name="colmena-logo-amarillo 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="Colmena" className="absolute h-[287.68%] left-[-8.52%] max-w-none top-[-96.9%] w-[116.39%]" src={imgColmenaLogoAmarillo2} />
        </div>
      </div>
      <p className="font-normal leading-normal text-[#0a142f] text-[18px] sm:text-[24px]">Conectamos talento creativo con oportunidades.</p>
    </div>
  );
}

function LoginPanel() {
  return (
    <div className="relative w-full shrink-0 overflow-hidden bg-[#ffb53e]" data-name="Login">
      <LoginPattern />
      <div className="relative mx-auto flex w-full max-w-[1300px] flex-col items-center gap-12 px-4 py-16 sm:px-8 md:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-16 lg:py-24">
        <LoginIntro />
        <LoginForm />
      </div>
    </div>
  );
}

function HeaderActions() {
  return (
    <>
      <Link to="/registro-clientes" className="flex items-center justify-center rounded-[12px] bg-black px-6 py-3" data-name="button">
        <p className="font-bold leading-normal text-[#f8fafc] text-[15px] whitespace-nowrap">Registrarme como Cliente</p>
      </Link>
      <Link to="/registro-creativos" className="flex items-center justify-center rounded-[12px] border-2 border-black bg-transparent px-6 py-3" data-name="button">
        <p className="font-bold leading-normal text-[#0a142f] text-[15px] whitespace-nowrap">Registrarme como Creativo</p>
      </Link>
    </>
  );
}

export default function ColmenaLogin() {
  return (
    <div className="flex w-full max-w-full flex-col items-start overflow-x-hidden bg-white" data-name="colmena-login">
      <SiteHeader navLinks={AUTH_NAV_LINKS} actions={<HeaderActions />} />
      <LoginPanel />
      <SiteFooter />
    </div>
  );
}
