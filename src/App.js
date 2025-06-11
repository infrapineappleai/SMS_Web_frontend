import React from 'react';
import Panel from './Main/Panel';
import './App.css';

const App = () => {
  console.log('App rendered');
  return (
    <div className="student">
      <Panel />
    </div>
  );
};

export default App;