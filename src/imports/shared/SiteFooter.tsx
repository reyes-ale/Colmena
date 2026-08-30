import imgColmenaLogoAmarillo1 from "../ColmenaLanding/b8c094e83e9356f8b663fb6d35b6e0f860fba372.png";

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

function FooterLinkGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col items-start gap-4" data-name="Frame">
      <p className="font-bold uppercase text-[#f59e0b]">{title}</p>
      {links.map((l) => (
        <a key={l.label} href={l.href} className="font-normal text-[#f8fafc] opacity-80">
          {l.label}
        </a>
      ))}
    </div>
  );
}

function Heart() {
  return (
    <svg className="block size-4 shrink-0" fill="none" viewBox="0 0 16 16">
      <path
        d="M1.97827 4.25589C1.55788 4.86718 1.33281 5.5916 1.3328 6.33347C1.3328 7.86682 2.33288 9.00016 3.33295 10.0002L7.00524 13.5549C7.13126 13.696 7.28587 13.8086 7.4588 13.8854C7.63172 13.9621 7.81899 14.0012 8.00817 14C8.19736 13.9988 8.38412 13.9573 8.55605 13.8784C8.72799 13.7995 8.88116 13.6849 9.00539 13.5422L12.667 10.0002C13.6671 9.00016 14.6672 7.86015 14.6672 6.33347C14.6707 5.58997 14.4477 4.86302 14.0279 4.24939C13.608 3.63575 13.0112 3.16452 12.3169 2.89843C11.6226 2.63233 10.8637 2.58399 10.1412 2.75984C9.41877 2.93568 8.767 3.32738 8.27267 3.88278C8.23774 3.92012 8.19551 3.94989 8.14861 3.97025C8.1017 3.9906 8.05111 4.0011 7.99998 4.0011C7.94885 4.0011 7.89826 3.9906 7.85135 3.97025C7.80444 3.94989 7.76222 3.92012 7.72729 3.88278C7.2314 3.33096 6.57978 2.94253 5.85849 2.7688C5.1372 2.59506 4.38017 2.6442 3.68739 2.9097C2.99461 3.17521 2.39866 3.64461 1.97827 4.25589Z"
        stroke="#F59E0B"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

/** Shared footer used across the landing page and the auth pages. */
export function SiteFooter() {
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
          <FooterLinkGroup
            title="Plataforma"
            links={[
              { label: "Cómo Funciona", href: "/#como-funciona" },
              { label: "Para Clientes", href: "/#clientes" },
              { label: "Para Creativos", href: "/#creativos" },
            ]}
          />
          <FooterLinkGroup
            title="Soporte"
            links={[
              { label: "Centro de Ayuda", href: "#" },
              { label: "Políticas de Seguridad", href: "#" },
              { label: "Términos de Servicio", href: "#" },
              { label: "Contacto", href: "#" },
            ]}
          />
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
