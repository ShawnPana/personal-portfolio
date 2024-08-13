import React, { useState } from 'react';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export default function SentimentAnalysis() {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleAnalyzeClick = () => {
        const analysisResult = sentiment.analyze(inputText);
        setResult(analysisResult);
    };

    return (
        <div>
            <h1>Sentiment Analysis</h1>
            <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter text for analysis"
            />
            <br />
            <button onClick={handleAnalyzeClick}>Analyze</button>
            {result && (
                <div>
                    <h2>Analysis Results:</h2>
                    <p>Score: {result.score}</p>
                    <p>Comparative: {result.comparative}</p>
                    <p>Tokens: {result.tokens.join(', ')}</p>
                    <p>Words: {result.words.join(', ')}</p>
                </div>
            )}
        </div>
    );
}
