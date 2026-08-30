import svgPaths from "./svg-4rl5z4izy8";
import imgColmenaLogoCeleste1 from "./c50312f4f923327a7b17ea18801af24597be428d.png";
import { SiteHeader, AUTH_NAV_LINKS } from "../shared/SiteHeader";
import { SiteFooter } from "../shared/SiteFooter";
import { RegisterPanel } from "../shared/RegisterPanel";
import { Link } from "react-router";

const DECOR_PATHS = [
  svgPaths.p107ff800, svgPaths.p36722300, svgPaths.pb5c5100, svgPaths.p33429c00, svgPaths.p3dcf3580,
  svgPaths.pc56dd00, svgPaths.p3a46f00, svgPaths.p338e1700, svgPaths.p2dba3c00, svgPaths.pc31dfd2,
  svgPaths.p199e0e80, svgPaths.p3b671280, svgPaths.p2812ec00, svgPaths.p391b7400, svgPaths.p2dad9d80,
  svgPaths.p4bd8440, svgPaths.p39e371b0, svgPaths.p14638100, svgPaths.p1ae99740, svgPaths.p3677a100,
  svgPaths.pca0e000, svgPaths.p2bb0e700, svgPaths.p7f67e00, svgPaths.p3cdbcb80, svgPaths.p3c5d6200,
  svgPaths.p2f9e2480, svgPaths.p22d35700, svgPaths.p1d662a80, svgPaths.p3dfd5360, svgPaths.pcfb1680,
  svgPaths.p29449200, svgPaths.p3348e500, svgPaths.p35619b80, svgPaths.p3d198580, svgPaths.p1fd43e80,
  svgPaths.p18c4fb80, svgPaths.p37aa3b00, svgPaths.p3db37ec0, svgPaths.p310f9100, svgPaths.p2d9cf960,
  svgPaths.p2ec5c740, svgPaths.p2b261c80, svgPaths.p16ca9800, svgPaths.p3a30bb40, svgPaths.p36d51700,
  svgPaths.p21d75ef0, svgPaths.p38fe500, svgPaths.p38ae5840, svgPaths.pb0b3400, svgPaths.p201cc280,
  svgPaths.p52e2180, svgPaths.p85c5120, svgPaths.p19d2700, svgPaths.p26d46500, svgPaths.p229fe280,
  svgPaths.p104e4f00, svgPaths.p3ddb5d00, svgPaths.p13405a00, svgPaths.p2d7816c0, svgPaths.p17f47a00,
  svgPaths.p96f9970, svgPaths.p1949300, svgPaths.p2ff4f700, svgPaths.p2e172700, svgPaths.p2c2bb800,
  svgPaths.p18871900, svgPaths.p2ded8a00, svgPaths.p17263000, svgPaths.p1daf7300, svgPaths.p28c78600,
  svgPaths.p2d955a00, svgPaths.p3a560b80, svgPaths.pfa11c00, svgPaths.p732c600, svgPaths.p678eb80,
];

function HeaderActions() {
  return (
    <Link to="/login" className="flex items-center justify-center rounded-[12px] border-2 border-black bg-transparent px-6 py-3" data-name="button">
      <p className="font-bold leading-normal text-[#0a142f] text-[15px] whitespace-nowrap">Inicia Sesión</p>
    </Link>
  );
}

export default function ColmenaRegistroCreativos() {
  return (
    <div className="flex w-full max-w-full flex-col items-start overflow-x-hidden bg-white" data-name="colmena-registro-creativos">
      <SiteHeader navLinks={AUTH_NAV_LINKS} actions={<HeaderActions />} />
      <RegisterPanel
        decorPaths={DECOR_PATHS}
        decorViewBox="0 0 1898.5 1219"
        decorFill="#00566D"
        logoImg={imgColmenaLogoCeleste1}
        logoImgAlt="Colmena"
        title="Regístrate"
        subtitle="Muestra tu talento y haz crecer tu experiencia."
        nameLabel="Nombre completo"
        namePlaceholder="Nombre ejemplo"
      />
      <SiteFooter />
    </div>
  );
}
