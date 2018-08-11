import React, { Component } from 'react'

const WEEK_SIZE = 7;
const WEEK_LAST_DAY = 6;
const MONTHES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class CalHeatmap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: props.start,
      end: props.end,
      data: props.data,
      squareSize: props.squareSize || 20,
      gutterSize: props.gutterSize || 1,
      weekDayColor: props.weekDayColor || '#dddddd',
      weekDays: { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' },
      dayColor: props.dayColor || this.dayColor,
      dayNumberColor: (d) => '#dddddd',
      reversed: props.end < props.start,
    };
    this.state.fontSize = this.state.squareSize / 4;
    this.state.normalizedData = this.normalizeData();
  }

  dayColor = (d, count) => {
    const color = {
      0: '#fafafa',
      1: '#ef9a9a',
      2: '#f44336',
      3: '#ba000d',
    }[count] || '#ba000d';  // rest of
    return color;
  }

  normalizeData() {
    const { data } = this.state;
    const normalized = new Proxy({}, {
      get: (target, name) => name in target ? target[name] : 0
    });
    data.forEach(d => {
      const current = new Date(d.timestamp * 1000).setHours(0, 0, 0, 0);
      // console.log(d.timestamp, new Date(d.timestamp * 1000));
      const delta = d.count || 1;
      normalized[current] += delta;
    });
    return normalized;
  }

  dateRange() {
    const { start, end } = this.state;
    const days = [];
    let d = new Date(start);
    d.setHours(0, 0, 0, 0);
    if (end >= start) {
      for (; d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
    } else {  // reverse
      for (; d >= end; d.setDate(d.getDate() - 1)) {
        days.push(new Date(d));
      }
    }
    return days;
  }

  renderMonthLabel(d, xOffset, yOffset) {
    const { squareSize, fontSize, dayNumberColor } = this.state;
    const showMonthLabel = (d.getDate() === 1);
    if (!showMonthLabel) {
      return null;
    }
    const showYear = (d.getMonth() === 0 || d.getMonth() === 5)
    return (
      <React.Fragment>
        <text
          x={xOffset}
          y={yOffset + fontSize}
          fontSize={fontSize + 5}
          fill={dayNumberColor(d)}
          dominantBaseline="hanging"
        >
          {MONTHES[d.getMonth()]}
        </text>
        { showYear &&
          <text
          x={xOffset}
          y={yOffset + squareSize - fontSize}
          fontSize={fontSize}
          fill={dayNumberColor(d)}
          dominantBaseline="hanging"
        >
          {d.getFullYear()}
        </text>
        }
      </React.Fragment>
    )
  }

  renderDays() {
    const { start, reversed, squareSize, fontSize, gutterSize, dayColor, dayNumberColor } = this.state;
    const squareWithGutterSize = squareSize + gutterSize;
    const firstDayOffset = start.getDay(); // day of the week for start date
    let index = reversed ? (WEEK_SIZE - 1) - firstDayOffset : firstDayOffset; // add offset for first day
    return this.dateRange().map((d) => {
      // calculate x and y offsets
      let xOffset = squareWithGutterSize * (index % WEEK_SIZE);
      xOffset = reversed ? (WEEK_SIZE - 1) * (squareSize + gutterSize) - xOffset : xOffset; // for reversed go from right to left
      const yOffset = squareWithGutterSize * parseInt(index / WEEK_SIZE, 10);
      const countForDay = this.state.normalizedData[d.getTime()]; // value for day      

      // check if it is last day of the week on the middle of the month
      // if ((d.getDay() === WEEK_LAST_DAY) && (0 < (d.getDate() - 15) < 8)) {
      //   console.log(MONTHES[d.getMonth()]);
      // }
      // // const showMonthLabel = ((d.getDay() === WEEK_LAST_DAY) && (d.getDate() >= 15) && (d.getDate() < 15 + WEEK_SIZE));
      // const showMonthLabel = ((d.getDay() === WEEK_LAST_DAY) && (d.getDate() <= WEEK_SIZE));
      // // check if first day of year
      // const showYearLabel = ((d.getDay() === WEEK_LAST_DAY) && (d.getMonth() === 0) && (d.getDate() <= 7));

      index++;
      return (
        <g key={index - 1}>
          <rect
            width={squareSize}
            height={squareSize}
            x={xOffset}
            y={yOffset}
            fill={dayColor(d, countForDay)}
          >
          </rect>
          <text
            x={xOffset + 1}
            y={yOffset + 1}
            fontSize={fontSize}
            fill={dayNumberColor(d)}
            dominantBaseline="hanging">
            {d.getDate()}
          </text>
          {this.renderMonthLabel(d, xOffset, yOffset)}
        </g>
      )
    })
  }

  render() {
    const { gutterSize, fontSize, weekDayColor, weekDays, squareSize } = this.state;
    const width = 7*(squareSize + gutterSize);
    return (
      <svg viewBox={`0 0 ${width} 800`}>
        {/* WeekDays */}
        {weekDays &&
          <g>
            {[...Array(WEEK_SIZE).keys()].map(i => (  // 7 days in a week
              <text key={i} x={1 + i * (squareSize + gutterSize)} y={0} fontSize={fontSize} fill={weekDayColor} dominantBaseline="hanging">
                {weekDays[i]}
              </text>
            ))}
          </g>
        }
        {/* Days Squares  */}
        <g transform={`translate(0,${fontSize + 2})`}>
          {this.renderDays()}
        </g>
      </svg>
    )
  }
}
