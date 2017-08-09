import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

function main()
{
    ReactDOM.render(<App />, document.getElementById('main'));
    registerServiceWorker();
}

main();