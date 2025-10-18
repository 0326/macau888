import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import HistoryPage from "./pages/History";
import HomePage from "./pages/Home";
import ChartPage from "./pages/Chart";
import "./App.less";

const App = () => {
  const [count, setCount] = useState(0);
  const hash = location.hash;

  useEffect(() => {}, []);

  const render = () => {
    switch (hash) {
      case "#chart":
        return <ChartPage />;
      case "#history":
        return <HistoryPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Routes>
      <Route path="*" element={render()} />
    </Routes>
  );
};

export default App;
