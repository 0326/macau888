import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import HistoryPage from './pages/History';
import HomePage from './pages/Home';
import ChartPage from './pages/Chart';
import './App.less';

const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
  }, [])

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/macau888' element={<HomePage />} />
      <Route path='/macau888/chart' element={<ChartPage />} />
      <Route path='/macau888/history' element={<HistoryPage />} />
      <Route path='*' element={<HistoryPage/>} />
    </Routes>
  );
};

export default App;
