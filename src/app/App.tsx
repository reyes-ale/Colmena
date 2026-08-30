import { BrowserRouter, Routes, Route } from "react-router";
import ColmenaLanding from "../imports/ColmenaLanding";
import ColmenaLogin from "../imports/ColmenaLogin";
import ColmenaRegistroCreativos from "../imports/ColmenaRegistroCreativos";
import ColmenaRegistroEmpresas from "../imports/ColmenaRegistroEmpresas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ColmenaLanding />} />
        <Route path="/login" element={<ColmenaLogin />} />
        <Route path="/registro-creativos" element={<ColmenaRegistroCreativos />} />
        <Route path="/registro-clientes" element={<ColmenaRegistroEmpresas />} />
      </Routes>
    </BrowserRouter>
  );
}
