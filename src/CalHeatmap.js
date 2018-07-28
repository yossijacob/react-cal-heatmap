import React, { Component } from 'react'

export default class CalHeatmap extends Component {
  dateRange() {
    const startDate = new Date();
    const endDate = new Date(2018, 0, 11);
    const days = [];
    const delta = endDate >= startDate ? 1 : -1;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + delta)) {
      days.push(new Date(d));
    }
    return days;
  }

  dayColor(day) {
    return 'whitesmoke'
  }

  renderDays() {
    const dayColor = '#dddddd'
    const squareSize = 20;
    const fontSize = squareSize / 4 ;
    const gutterSize = 1;
    const squareWithGutterSize = squareSize + gutterSize;
    return this.dateRange().map((d, idx) => {
      const xOffset = squareWithGutterSize * (idx % 7);
      const yOffset = squareWithGutterSize * parseInt(idx / 7, 10);
      return (
        <g>
          <rect
            width={squareSize}
            height={squareSize}
            x={xOffset}
            y={yOffset}
            fill={this.dayColor(d)}
          >
          </rect>
          <text x={xOffset+1} y={yOffset+1} font-size={fontSize} fill={dayColor} dominant-baseline="hanging">
            {d.getDate()}
          </text>
        </g>
      )
    })
  }

  render() {

    return (
      <svg viewBox="0 0 200 800">
        {this.renderDays()}
      </svg>
    )
  }
}
