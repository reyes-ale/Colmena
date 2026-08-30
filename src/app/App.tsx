import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "../lib/AuthContext";
import ColmenaLanding from "../imports/ColmenaLanding";
import ColmenaLogin from "../imports/ColmenaLogin";
import ColmenaRegistroCreativos from "../imports/ColmenaRegistroCreativos";
import ColmenaRegistroEmpresas from "../imports/ColmenaRegistroEmpresas";
import Dashboard from "../pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ColmenaLanding />} />
          <Route path="/login" element={<ColmenaLogin />} />
          <Route path="/registro-creativos" element={<ColmenaRegistroCreativos />} />
          <Route path="/registro-clientes" element={<ColmenaRegistroEmpresas />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
