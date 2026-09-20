import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveInspection from './pages/LiveInspection';
import StandardProduct from './pages/StandardProduct';
import InspectionHistory from './pages/InspectionHistory';
import Analytics from './pages/Analytics';
import Inspection from './pages/Inspection';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="live"      element={<LiveInspection />} />
          <Route path="standard"  element={<StandardProduct />} />
          <Route path="history"   element={<InspectionHistory />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="inspection" element={<Inspection />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}