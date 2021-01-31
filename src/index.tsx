import React from 'react';
import ReactDOM from 'react-dom';

import '@vkontakte/vkui/dist/vkui.css';
import './index.sass';

import bridge from '@vkontakte/vk-bridge'


import { Provider } from 'react-redux';
import store from './store/store';

import App from './App';

import eruda from 'eruda'
eruda.init()

bridge.send('VKWebAppInit')
bridge.subscribe(e => {
  if(e.detail.type === 'VKWebAppUpdateConfig')
    document.body.setAttribute('scheme', e.detail.data.scheme)
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)