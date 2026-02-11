import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './components/Home'
import Tree from './components/Tree'
import Navbar from './components/Navbar/Navbar'
import AboutMe from './components/AboutMe/AboutMe'
import Projects from './components/Projects/Projects'

function App() {
  return (
    <div className="App" id ="App">
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index element={<AboutMe />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/tree" element={<Tree />} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
