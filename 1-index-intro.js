import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit'


const root = ReactDOM.createRoot(document.getElementById('root'));
const store = configureStore({
  reducer: {
    state: (state = 0, action) => {
      switch (action.type) {
        case 'incrementar':
          return state +1
        
        case 'decrementar': 
          return state-1
        
        case 'set':
          return action.payload

        default:
          return state

      }
    },
  }
})
console.log(store.getState());
store.dispatch({type: 'lala'})
console.log(store.getState());
store.dispatch({ type: 'incrementar' })
console.log(store.getState());
store.dispatch({ type: 'decrementar'})
console.log(store.getState());
store.dispatch({ type: 'set', payload:15})
console.log(store.getState());

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();