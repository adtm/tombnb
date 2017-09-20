const Day = require('../models/day');

function timeToString(time) {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}

let dayArray = [];
for (let i = -15; i < 85; i++) {
  const time = day.timestamp + i * 24 * 60 * 60 * 1000;
  const strTime = this.timeToString(time);
  dayArray.push(strTime);
}


// loadItems(day) {
//   setTimeout(() => {
//     for (let i = -15; i < 85; i++) {
//       const time = day.timestamp + i * 24 * 60 * 60 * 1000;
//       const strTime = this.timeToString(time);
//       if (!this.state.items[strTime]) {
//         this.state.items[strTime] = [];
//         const numItems = Math.floor(Math.random() * 5);
//         for (let j = 0; j < numItems; j++) {
//           this.state.items[strTime].push({
//             name: 'Item for ' + strTime,
//             height: Math.max(50, Math.floor(Math.random() * 150))
//           });
//         }
//       }
//     }
//     //console.log(this.state.items);
//     const newItems = {};
//     Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
//     this.setState({
//       items: newItems
//     });
//   }, 1000);
//   // console.log(`Load Items for ${day.year}-${day.month}`);
// }
