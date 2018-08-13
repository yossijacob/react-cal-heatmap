# Reactjs-Heatmap-Calander

This is a small package to show a heat map calander, like the one Github uses for their contribuation calander.
It's orientation is vertical so it fits mobile devices well.

## Installation

```
yarn add reactjs-heatmap-calendar
```


## Example

```
import CalHeatmap from "reactjs-heatmap-calendar";

function App() {
  const start = new Date();
  const end = new Date(2016, 11, 20);
  const data = [
    { timestamp: 1532290177 },
    { timestamp: 1532252573 },
    { timestamp: 1531979209 },
    { timestamp: 1532546311 },
    { timestamp: 1532946380, count: 3 }
  ];
  return (
    <div>
      <CalHeatmap start={start} end={end} data={data} />
    </div>
  );
}
```

[![Edit reactjs-heatmap-calendar](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/4x4nx2k65x)
