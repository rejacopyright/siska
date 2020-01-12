import React from 'react';
import ReactDOM from 'react-dom';
import Auth from './api/auth';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Auth />, document.getElementById('app'));
serviceWorker.register();
