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
      <Route path='/' element={<div>xxxhome</div>} />
      <Route path='/history' element={<HistoryPage/>} />
    </Routes>
  );
};

export default App;
