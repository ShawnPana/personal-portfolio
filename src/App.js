import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './components/Home'
import Tree from './components/Tree'

function App() {
  return (
    <div className="App" id ="App">
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="/tree" element={<Tree />} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;