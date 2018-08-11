import React, { Component } from 'react';
import './App.css';
import CalHeatmap from '../lib';

class App extends Component {
  render() {
    // const start =new Date(2018, 0, 11);
    // const end =  new Date();
    const start = new Date();
    const end = new Date(2016, 11, 20);
    const data = [
      { timestamp: 1532290177 },
      { timestamp: 1532252573 },
      { timestamp: 1531979209 },
      { timestamp: 1532546311 },
      { timestamp: 1532946380, count: 3 },
    ];

    const start1 = new Date();
    const end1 = new Date(2018, 6, 22);

    return (
      <div className="App">
        <h2>1st Calendar</h2>
        <CalHeatmap
          start={start1}
          end={end1}
          data={data}
        />
        <br />
        <h2>2nd Calendar</h2>
        <br />
        <CalHeatmap
          start={start}
          end={end}
          data={data}
        />
      </div>
    );
  }
}

export default App;

