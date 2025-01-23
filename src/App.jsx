import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import HistoricalData from './pages/HistoricalData';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Historical-data" element={<HistoricalData />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;