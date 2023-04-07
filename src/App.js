
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL=process.env.REACT_APP_API_URL

function App() {
  useEffect(() => {
    (async() => {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`)
     console.log(res)
    })()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button className='btn btn-primary'>123</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
