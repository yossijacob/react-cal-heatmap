import React, { Component } from 'react'

const WEEK_SIZE = 7;

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
      0:'#fafafa',
      1:'#c6e48b',
      2:'#7bc96f',
      3:'#239a3b',
    }[count] || '#196127';
    return color; 
  }

  normalizeData() {
    const {data} = this.state;
    const normalized = new Proxy({}, {
      get: (target, name) => name in target ? target[name] : 0
    });
    data.forEach(d => {
      const current = new Date(d.timestamp * 1000).setHours(0, 0, 0, 0);
      // console.log(d.timestamp, new Date(d.timestamp * 1000));
      const delta = d.count || 1;
      normalized[current] +=delta;
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

  renderDays() {
    const { start, reversed, squareSize, fontSize, gutterSize, dayColor, dayNumberColor } = this.state;
    const squareWithGutterSize = squareSize + gutterSize;
    const firstDayOffset = start.getDay(); // day of the week for start date
    let index = reversed ? (WEEK_SIZE-1) - firstDayOffset : firstDayOffset;
    return this.dateRange().map((d) => {
      let xOffset = squareWithGutterSize * (index % WEEK_SIZE);
      xOffset = reversed ? (WEEK_SIZE-1) * (squareSize + gutterSize) - xOffset : xOffset; // for reversed go from right to left
      const yOffset = squareWithGutterSize * parseInt(index / WEEK_SIZE, 10);
      const countForDay = this.state.normalizedData[d.getTime()]; // value for day
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
        </g>
      )
    })
  }

  render() {
    const { gutterSize, fontSize, weekDayColor, weekDays, squareSize } = this.state;
    return (
      <svg viewBox="0 0 200 800">
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

// const dateRange = (startDate, endDate) => {
//   const days = [];
//   if (endDate >= startDate) {
//     for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
//       days.push(new Date(d));
//     }
//   } else {  // reverse
//     for (let d = new Date(startDate); d >= endDate; d.setDate(d.getDate() - 1)) {
//       days.push(new Date(d));
//     }
//   }
//   return days;
// }

// const renderDays = (start, end, squareSize, gutterSize, dayColor, dayNumberColor, fontSize) => {
//   const reversed = end < start;
//   const squareWithGutterSize = squareSize + gutterSize;
//   const firstDayOffset = start.getDay(); // day of the week for start date
//   let index = reversed ? 6 - firstDayOffset : firstDayOffset;
//   return dateRange(start, end).map((d) => {
//     let xOffset = squareWithGutterSize * (index % 7);
//     xOffset = reversed ? 6 * (squareSize + gutterSize) - xOffset : xOffset; // for reversed go from right to left
//     const yOffset = squareWithGutterSize * parseInt(index / 7, 10);
//     index++;
//     return (
//       <g key={index - 1}>
//         <rect
//           width={squareSize}
//           height={squareSize}
//           x={xOffset}
//           y={yOffset}
//           fill={dayColor(d)}
//         >
//         </rect>
//         <text
//           x={xOffset + 1}
//           y={yOffset + 1}
//           fontSize={fontSize}
//           fill={dayNumberColor(d)}
//           dominantBaseline="hanging">
//           {d.getDate()}
//         </text>
//       </g>
//     )
//   })
// }

// export default ({
//   start,
//   end,
//   squareSize = 20,
//   gutterSize = 1,
//   dayColor = (d) => 'whitesmoke',
//   dayNumberColor = (d) => '#dddddd',
//   weekDaysColor = '#dddddd',
//   weekDays = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' }
// }) => {
//   const fontSize = squareSize / 4;
//   return (
//     <svg viewBox="0 0 200 800">

//       {/* WeekDays */}
//       {weekDays &&
//         <g>
//           {[...Array(7).keys()].map(i => (  // 7 days in a week
//             <text x={1 + i * (squareSize + gutterSize)} y={0} fontSize={fontSize} fill={weekDaysColor} dominantBaseline="hanging">
//               {weekDays[i]}
//             </text>
//           ))}
//         </g>
//       }

//       {/* Days Squares  */}
//       <g transform={`translate(0,${fontSize + 2})`}>
//         {renderDays(start, end, squareSize, gutterSize, dayColor, dayNumberColor, fontSize)}
//       </g>
//     </svg>
//   )
// }
