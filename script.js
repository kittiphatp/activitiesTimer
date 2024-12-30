// container of node
const nodelist = document.querySelectorAll('.ctn');
let nodeArr = []
  for(let i = 0; i < nodelist.length; i++) {
    nodeArr.push(nodelist[i].childNodes[3].textContent)
}
// current node
let nodeCurrent

// buttons
const startController = document.querySelector('.start')
const stopController = document.querySelector('.stop')
const resetController = document.querySelector('.reset')

// current timer
let timerCurrent

// current date time
let dateCurrent

// interval timers
let intervalWorking,
  intervalBreak,
  intervalLearn,
  intervalSecondBreak,
  intervalBook,
  intervalMovie,
  intervalGame;

// alert sound
let alertSound

// current controller state
let controllerState

const stateArr = [
  {
    name: 'working',
    interval: intervalWorking,
    completedMsg: 'หมดเวลาทำงาน',
    defaultTimer: 60 * 25,
  },
  {
    name: 'learn',
    interval: intervalLearn,
    completedMsg: 'หมดเวลาเรียนรู้เพิ่มเติม',
    defaultTimer: 60 * 25,
  },
  {
    name: 'book',
    interval: intervalBook,
    completedMsg: 'หมดเวลาอ่านหนังสือ',
    defaultTimer: 60 * 25,
  },
  {
    name: 'movie',
    interval: intervalMovie,
    completedMsg: 'หมดเวลาดูหนัง',
    defaultTimer: 60 * 15,
  },
  {
    name: 'game',
    interval: intervalGame,
    completedMsg: 'หมดเวลาเล่นเกมส์',
    defaultTimer: 60 * 15,
  },
  {
    name: 'break',
    interval: intervalBreak,
    completedMsg: 'หมดเวลาพัก',
    defaultTimer: 60 * 5,
  }
];
let stateIndex = 0;
let stateSequence = [3, 5, 1, 5, 4, 5, 2, 5];

// function find current node
const FindCurrentNode = () => {
  const nodeIndexCurrent = nodeArr.indexOf(stateArr[stateSequence[stateIndex]].name)
  const nodeRemainTime = nodelist[nodeIndexCurrent].children[3]
  const nodeProgressBar = nodelist[nodeIndexCurrent].children[2].children[0]

  // return object
  return {
    nodeIndexCurrent: nodeIndexCurrent,
    nodeRemainTime: nodeRemainTime,
    nodeProgressBar: nodeProgressBar
  }
}

// function get current date time
const GetCurrentDateTime = () => {
  // 1. get current datetime
  const d = new Date();
  // 2. format datetime
  const dateString =
    d.getFullYear() +
    '/' +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + d.getDate()).slice(-2) +
    ' ' +
    ('0' + d.getHours()).slice(-2) +
    ':' +
    ('0' + d.getMinutes()).slice(-2) +
    ':' +
    ('0' + d.getSeconds()).slice(-2);
  
  // 3. return data
  return dateString
}

// function count down
const CountDown = () => {
  // 1. find current node
  nodeCurrent = FindCurrentNode()
  // x. debug
  // console.log(nodeCurrent)
  // 2. update remainin time with default 
  nodeCurrent.nodeRemainTime.innerHTML = `${stateArr[stateSequence[stateIndex]].defaultTimer} sec (${Math.floor(stateArr[stateSequence[stateIndex]].defaultTimer / 60)} mins)`
  // 3. update progress bar background color with width 100%
  nodeCurrent.nodeProgressBar.style.background = '#000080'
  // 4. highlight current node
  highlightState();
  // 5. setup timer
  timerCurrent = timerCurrent === undefined || timerCurrent === 0 ? stateArr[stateSequence[stateIndex]].defaultTimer : timerCurrent
  // 6. get current datetime
  dateCurrent = GetCurrentDateTime()
  // 7. case: manually break >> update stop column in the current row of table
  const tbodyRef = document.querySelector('table').getElementsByTagName('tbody')[0];
  if(tbodyRef.children.length > 0) {
    const cell1Start = tbodyRef.children[0].children[0].innerText;
    const cell3Activity = tbodyRef.children[0].children[3].innerText;
    if(cell3Activity === 'manually break'){
      tbodyRef.children[0].children[1].innerText = dateCurrent
      tbodyRef.children[0].children[2].innerText = Math.floor((new Date(dateCurrent) - new Date(cell1Start)) / 60000)
  }}
  // 8. insert row table
  const row = tbodyRef.insertRow(0)
  let cell1 = row.insertCell(0)
  let cell2 = row.insertCell(1)
  let cell3 = row.insertCell(2)
  let cell4 = row.insertCell(3)
  cell1.innerHTML = `${dateCurrent}`
  cell2.innerHTML = ``
  cell3.innerHTML = ``
  cell4.innerHTML = `${stateArr[stateSequence[stateIndex]].name}`
  // 9. run timer
  stateArr[stateSequence[stateIndex]].interval = setInterval(() => {
    // 9.1. check timer timeout with true
    if(timerCurrent > 0) { 
      // 9.1.1. decrease timer 1 
      timerCurrent -= 1
      // 9.1.2. update remainin time
      nodeCurrent.nodeRemainTime.innerHTML = `${timerCurrent} sec (${Math.floor(timerCurrent / 60)} mins)`
      // 9.1.3. update progress bar width
      nodeCurrent.nodeProgressBar.style.width = `${(timerCurrent * 100) / stateArr[stateSequence[stateIndex]].defaultTimer}%`
    } 
    // 9.2. check timer timeout with false
    else {
      // 9.2.1. get current datetime
      dateCurrent = GetCurrentDateTime()
      // 9.2.2. update stop column in the current row of table
      const tbodyRef = document.querySelector('table').getElementsByTagName('tbody')[0];
      const cell1Start = tbodyRef.children[0].children[0].innerText;
      tbodyRef.children[0].children[1].innerText = dateCurrent
      tbodyRef.children[0].children[2].innerText = Math.floor((new Date(dateCurrent) - new Date(cell1Start)) / 60000)
      // 9.2.3. highlight row if activity row is break
      if(tbodyRef.children[0].children[3].innerText === 'break') {
        tbodyRef.children[0].style.background = '#CCCCFF'
      }
      // 9.2.4. clear interval time
      clearInterval(stateArr[stateSequence[stateIndex]].interval)
      // 9.2.5. setup timer to undefined
      timerCurrent === undefined
      // 9.2.6. setup sound
      const cell3Activity = tbodyRef.children[0].children[3].innerText;
      cell3Activity === 'break' 
        ? alertSound = new Audio('./assets/sounds/alertBreak.mp3')
        : alertSound = new Audio('./assets/sounds/alertCompleted.mp3')
      // 9.2.6. play alert sound
      alertSound.play()
      // 9.2.7. show alert message
      alert(stateArr[stateSequence[stateIndex]].completedMsg)
      // 9.2.8. stop alert sound
      alertSound.pause()
      // 9.2.9. get next index of state
      stateIndex === stateSequence.length - 1 ? stateIndex = 0 : stateIndex += 1
      // 9.2.10. update controller state to stop
      controllerState = 'stop'
      // 9.2.11. click start button
      startController.click()
    }
  }, 1000)
};

// function highlight state
const highlightState = () => {
  for (let i = 0; i < nodelist.length; i++) {
    if (
      nodelist[i].childNodes[3].textContent ===
      stateArr[stateSequence[stateIndex]].name
    ) {
      nodelist[i].style.background = '#5AB2FF';
      nodelist[i].style.color = '#fff';
      nodelist[i].style.border = '3px solid #000080';
    } else {
      nodelist[i].style.background = '#fff';
      nodelist[i].style.color = '#000';
      nodelist[i].style.border = '1px solid #aaa';
    }
  }
}

// new controller
startController.addEventListener('click', () => {
  if(controllerState !== 'start'){
    controllerState = 'start'
    // 1. clear interval time
    clearInterval(stateArr[stateSequence[stateIndex]].interval)
    // 2. clear all background color of controllers
    startController.style.background = '#fff'
    startController.style.borderStyle = 'none'
    stopController.style.background = '#fff'
    stopController.style.borderStyle = 'none'
    resetController.style.background = '#fff'
    // 3. highlight background color of start
    startController.style.background = '#FFFF00'
    startController.style.border = '2px solid #ff0000'
    // 4. run timer
    CountDown();
  }
})

stopController.addEventListener('click', () => {
  if(controllerState !== 'stop'){
    controllerState = 'stop'
    // 1. clear interval time
    clearInterval(stateArr[stateSequence[stateIndex]].interval)
    // 2. clear all background color of controllers
    startController.style.background = '#fff'
    startController.style.borderStyle = 'none'
    stopController.style.background = '#fff'
    stopController.style.borderStyle = 'none'
    resetController.style.background = '#fff'
    // 3. highlight background color of stop
    stopController.style.background = '#FFFF00'
    stopController.style.border = '2px solid #ff0000'
    // 4. get current datetime
    dateCurrent = GetCurrentDateTime()  
    // 5. update stop column in the current row of table
    const tbodyRef = document.querySelector('table').getElementsByTagName('tbody')[0];
    const cell1Start = tbodyRef.children[0].children[0].innerText;
    tbodyRef.children[0].children[1].innerText = dateCurrent
    tbodyRef.children[0].children[2].innerText = Math.floor((new Date(dateCurrent) - new Date(cell1Start)) / 60000)
    // 6. insert row table of manually break
    const row = tbodyRef.insertRow(0)
    let cell1 = row.insertCell(0)
    let cell2 = row.insertCell(1)
    let cell3 = row.insertCell(2)
    let cell4 = row.insertCell(3)
    cell1.innerHTML = `${dateCurrent}`
    cell2.innerHTML = ``
    cell3.innerHTML = ``
    cell4.innerHTML = `manually break`
    // 7. highlight row if activity row is break
    if(tbodyRef.children[0].children[3].innerText === 'break') {
      tbodyRef.children[0].style.background = '#CCCCFF'
    }
    // 7. highlight row if activity row is break
    if(tbodyRef.children[0].children[3].innerText === 'manually break') {
      tbodyRef.children[0].style.background = '#fadbd8'
    }
  }
})

resetController.addEventListener('click', () => {
  // 1. refresh page
  window.location.reload()
})