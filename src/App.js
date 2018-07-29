import React, { Component } from 'react';
import './App.css';
import CalHeatmap from './CalHeatmap'

class App extends Component {
  render() {
    // const start =new Date(2018, 0, 11);
    // const end =  new Date();
    const start = new Date();
    const end = new Date(2018, 0, 11);
    return (
      <div className="App">
        <CalHeatmap start={start} end={end}/>
      </div>
    );
  }
}

export default App;
