import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/Main";
import HistoryPage from "./pages/History";
import SearchImage from "./pages/SearchImage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/search" element={<SearchImage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/HistoryPage" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
