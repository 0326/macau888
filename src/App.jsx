import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import HistoryPage from './pages/History';
import './App.less';

const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
  }, [])

  return (
    <Routes>
      <Route path='/macau888' element={<div>首页666</div>} />
      <Route path='*' element={<HistoryPage/>} />
    </Routes>
  );
};

export default App;
