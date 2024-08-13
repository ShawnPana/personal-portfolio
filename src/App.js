import './App.css';
import { useEffect } from 'react'
import Home from './components/Home'
import Lanyard from './components/Mobile'
import SentimentAnalysis from './components/Sentiment';

function App() {
  return (
    <div>
      <Home />
      {/* <SentimentAnalysis /> */}
    </div>

  );
}

export default App;