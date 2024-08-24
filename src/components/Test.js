
import React, { useState, useEffect } from 'react';

function Test() {
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dick", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    })
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoaded(true);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Members:</h1>
          <ul>
            {data.man.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Test;
