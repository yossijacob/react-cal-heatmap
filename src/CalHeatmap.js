import React, { Component } from 'react'
import { start } from 'pretty-error';

export default class CalHeatmap extends Component {
  dateRange(startDate, endDate) {
    const days = [];
    if (endDate >= startDate) {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
    } else {  // reverse
      for (let d = new Date(startDate); d >= endDate; d.setDate(d.getDate() - 1)) {
        days.push(new Date(d));
      }
    }
    return days;
  }

  dayColor(day) {
    return this.DAY_COLOR || 'whitesmoke'
  }

  dayNumberColor(day) {
    return this.DAY_NUMBER_COLOR || '#dddddd'
  }

  squareSize() {
    return this.SQUARE_SIZE || 20
  }

  renderDays() {
    const start = new Date();
    const end = new Date(2018, 0, 11);
    // const start =new Date(2018, 0, 11);
    // const end =  new Date();
    const reversed = end < start;
    const squareSize = this.squareSize();
    const fontSize = squareSize / 4;
    const gutterSize = 1;
    const squareWithGutterSize = squareSize + gutterSize;
    const firstDayOffset = start.getDay(); // day of the week for start date
    let index = reversed ? 6 - firstDayOffset : firstDayOffset;
    return this.dateRange(start, end).map((d) => {
      let xOffset = squareWithGutterSize * (index % 7);
      xOffset = reversed ? 6 * (squareSize + gutterSize) - xOffset : xOffset; // for reversed go from right to left
      const yOffset = squareWithGutterSize * parseInt(index / 7, 10);
      index++;
      return (
        <g key={index-1}>
          <rect
            width={squareSize}
            height={squareSize}
            x={xOffset}
            y={yOffset}
            fill={this.dayColor(d)}
          >
          </rect>
          <text
            x={xOffset + 1}
            y={yOffset + 1}
            fontSize={fontSize}
            fill={this.dayNumberColor(d)}
            dominantBaseline="hanging">
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
