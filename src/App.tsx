import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EstimationTool from './pages/EstimationTool';
import MaterialTakeoff from './pages/MaterialTakeoff';
import HRManagement from './pages/HRManagement';
import FinancialManagement from './pages/FinancialManagement';
import CRMContracts from './pages/CRMContracts';
import MaterialsLegal from './pages/MaterialsLegal';
import PriceManagement from './pages/PriceManagement';
import CalculationHistory from './pages/CalculationHistory';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="estimating" element={<EstimationTool />} />
          <Route path="takeoff" element={<MaterialTakeoff />} />
          <Route path="hr" element={<HRManagement />} />
          <Route path="finance" element={<FinancialManagement />} />
          <Route path="crm" element={<CRMContracts />} />
          <Route path="materials" element={<MaterialsLegal />} />
          <Route path="history" element={<CalculationHistory />} />
          <Route path="management" element={<PriceManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
