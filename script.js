// container of node
const nodelist = document.querySelectorAll('.ctn');
let nodeArr = []
  for(let i = 0; i < nodelist.length; i++) {
    nodeArr.push(nodelist[i].childNodes[3].textContent)
}
// current node
let nodeCurrent

// controllers
const rountinesCkbox = document.querySelector('#ck-routines')
rountinesCkbox.checked = false
const tggCkbox = document.querySelector('#tgg-check')
tggCkbox.checked = false
const startController = document.querySelector('.start')
const stopController = document.querySelector('.stop')
const meetingController = document.querySelector('.meeting')
const resetController = document.querySelector('.reset')

// bar count up
const barRoutines = document.querySelector('#bar-routines')
const barCountUp = document.querySelector('#bar-countup')

// current timer
let timerCurrent

// current date time
let dateCurrent

// interval timers
let intervalWorking,
    intervalLearn,
    intervalBook,
    intervalMovie,
    intervalGame,
    intervalBreak,
    intervalManuallyBreak,
    intervalRoutines

// alert sound
let alertSound
const alertRoutine = new Audio('./assets/sounds/alertRoutine.wav')

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
let stateSequence = [2, 5, 3, 5, 1, 5, 4, 5];

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
    if(cell3Activity === 'manually break' || cell3Activity === 'meeting'){
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
      // 9.2.1. clear interval time
      clearInterval(stateArr[stateSequence[stateIndex]].interval)
      // 9.2.2. setup timer to undefined
      timerCurrent = undefined
      // 9.2.3. setup sound
      const tbodyRef = document.querySelector('table').getElementsByTagName('tbody')[0];
      const cell3Activity = tbodyRef.children[0].children[3].innerText;
      cell3Activity === 'break' 
        ? alertSound = new Audio('./assets/sounds/alertBreak.mp3')
        : alertSound = new Audio('./assets/sounds/alertCompleted.mp3')
      // 9.2.4. play alert sound
      alertSound.play()
      // 9.2.5. show alert message
      alert(stateArr[stateSequence[stateIndex]].completedMsg)
      // 9.2.6. get current datetime
      dateCurrent = GetCurrentDateTime()
      // 9.2.7. update stop column in the current row of table
      const cell1Start = tbodyRef.children[0].children[0].innerText;
      tbodyRef.children[0].children[1].innerText = dateCurrent
      tbodyRef.children[0].children[2].innerText = Math.floor((new Date(dateCurrent) - new Date(cell1Start)) / 60000)
      // 9.2.8. highlight row if activity row is break
      if(tbodyRef.children[0].children[3].innerText === 'break') {
        tbodyRef.children[0].style.background = '#CCCCFF'
      }
      // 9.2.9. stop alert sound
      alertSound.pause()
      // 9.2.10. get next index of state
      stateIndex === stateSequence.length - 1 ? stateIndex = 0 : stateIndex += 1
      // 9.2.11. update controller state to stop
      controllerState = 'stop'
      // 9.2.12. click start button
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

// function manually break or meeting
const ManuallyBreakOrMeeting = (stopType) => {
    if(controllerState !== stopType && controllerState !== undefined){
    controllerState = stopType // manually break or meeting
    // 1. clear interval time
        // 1.1. clear interval from sequence
        clearInterval(stateArr[stateSequence[stateIndex]].interval)
        // 1.2. clear interval from manually break or meeting
        clearInterval(intervalManuallyBreak)
    // 2. clear all background color of controllers
    startController.style.background = '#fff'
    startController.style.borderStyle = 'none'
    stopController.style.background = '#fff'
    stopController.style.borderStyle = 'none'
    meetingController.style.background = '#fff'
    meetingController.style.borderStyle = 'none'
    resetController.style.background = '#fff'
    // 3. highlight background color of stop
    if(stopType === 'manually break'){
      stopController.style.background = '#FFFF00'
      stopController.style.border = '2px solid #ff0000'
    } else if (stopType === 'meeting') {
      meetingController.style.background = '#FFFF00'
      meetingController.style.border = '2px solid #ff0000'
    }
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
    cell4.innerHTML = stopType
    // 7. highlight row if activity row is break
    if(tbodyRef.children[0].children[3].innerText === 'break') {
      tbodyRef.children[0].style.background = '#CCCCFF'
    }
    // 8. highlight row if activity row is manually break
    if(tbodyRef.children[0].children[3].innerText === 'manually break' || tbodyRef.children[0].children[3].innerText === 'meeting') {
      // 8.1. highlight with orange color
      tbodyRef.children[0].style.background = stopType === 'manually break' ? '#fadbd8' : '#ffff00'
      // 8.2. display bar count up
      barCountUp.style.display = 'flex'
      barCountUp.style.justifyContent = 'end'
      barCountUp.style.alignItems = 'center'
      barCountUp.style.backgroundColor = stopType === 'manually break' ? '#fadbd8' : '#ffff00'
      // 8.3. run count up
      let startCountup = 0
      let secCountup = 0
      let minCountup = 0
      let hrCountup = 0
      let dayCountup = 0
      let displayCountup = '00:00:00'
      intervalManuallyBreak = setInterval(() => {
        startCountup += 1
        // 00:00:00
        // set second
        secCountup = `${startCountup % 60 < 10 ? '0' : ''}${startCountup % 60}`
        // set minute
        minCountup = `${Math.floor((startCountup / 60) % 60) < 10 ? '0' : ''}${Math.floor((startCountup / 60) % 60)}`
        // set hour
        hrCountup = `${Math.floor(((startCountup / 60) / 60)) < 10 ? '0' : ''}${Math.floor((startCountup / 60) / 60)}`
        // set day
        dayCountup = Math.floor(((startCountup / 60) / 60) / 24)
        // format
        // displayCountup = `day: ${dayCountup} | hour: ${hrCountup} | minute: ${minCountup} | second: ${secCountup}`
        displayCountup = `${dayCountup}:${hrCountup}:${minCountup}:${secCountup}`
        // show on screen
        barCountUp.innerText = displayCountup
      }, 1000)
    }
  }
}
// function alert routine
const AlertRoutine = (currentRoutineId) => {
  // 1. highlight current routine
  document.querySelector(`#${currentRoutineId}`).style.backgroundColor = '#ffff00'
  // 2. run alert sound
  alertRoutine.play()
  // 3. clear highlight after 5 minutes
  setTimeout(() => document.querySelector(`#${currentRoutineId}`).style.removeProperty("background-color"), 5 * 60 * 1000)
}

// new controllers
rountinesCkbox.addEventListener('click', () => {  
  if(rountinesCkbox.checked){
    // 1. display routines bar
    barRoutines.style.display = 'flex'
    barRoutines.style.justifyContent = 'end'
    barRoutines.style.alignItems = 'center'
    barRoutines.style.gap = '10px'
    // 2. setup group of routines list
    let routinesDiv = document.createElement('div')
    routinesDiv.append('shoppee')
    routinesDiv.innerHTML = `
                              <div id='shoppee'><input type="checkbox" id="every-hr">shoppee (3hrs)</div>
                              <div id='lunchtime'>lunchtime</div>
                              <div id='dinnertime'>dinnertime</div>
    `
    // 3. add routines list in the bar
    barRoutines.innerHTML = routinesDiv.innerHTML
    // 4. listen checkbox input of shoppee
    const shoppeeCkbox = document.querySelector('#every-hr')
    shoppeeCkbox.addEventListener('click', () => {
      if(shoppeeCkbox.checked){
        // 4.1. change label to (1hr)
        document.querySelector('#shoppee').childNodes[1].textContent = 'shoppee (1hrs)'
      } else {
        // 4.1. change label to (3hr)
        document.querySelector('#shoppee').childNodes[1].textContent = 'shoppee (3hrs)'
      }
    })
    // 4. set variable now
    let now
     // 5. start interval routines timers
    intervalRoutines = setInterval(() => {
      now = new Date()
      currentTimeStr = `${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}:${('0' + now.getSeconds()).slice(-2)}`
      
      // switch check current time and alert
      switch(currentTimeStr) {
        // shoppee
        case '08:05:00':
          AlertRoutine('shoppee')
          break
        case '09:05:00':
          shoppeeCkbox.checked ? AlertRoutine('shoppee') : false
          break
        case '10:05:00':
          shoppeeCkbox.checked ? AlertRoutine('shoppee') : false
          break
        case '11:05:00':
          AlertRoutine('shoppee')
          break
        case '12:05:00':
          shoppeeCkbox.checked ? AlertRoutine('shoppee') : false
          break
        case '13:05:00':
          shoppeeCkbox.checked ? AlertRoutine('shoppee') : false
          break
        case '14:05:00':
          AlertRoutine('shoppee')
          break
        case '15:05:00':
          shoppeeCkbox.checked ? AlertRoutine('shoppee') : false
          break
        case '16:05:00':
          shoppeeCkbox.checked ? AlertRoutine('shoppee') : false
          break
        case '17:05:00':
          AlertRoutine('shoppee')
          break
        case '18:05:00':
          shoppeeCkbox.checked ? AlertRoutine('shoppee') : false
          break
        case '19:05:00':
          shoppeeCkbox.checked ? AlertRoutine('shoppee') : false
          break
        case '20:05:00':
          AlertRoutine('shoppee')
          break
        case '21:05:00':
          shoppeeCkbox.checked ? AlertRoutine('shoppee') : false
          break

        // lunch time
        case '12:00:00':
          AlertRoutine('lunchtime')
          break
  
        // dinner time
        case '17:58:00':
          AlertRoutine('dinnertime')
          break
        default:
          null
      }
    }, 1000)
  } else {
    // 1. off display
    barRoutines.style.display = 'none'
    // 2. clear routines list
    barRoutines.innerHTML = null
    // 3. clear interval time
    clearInterval(intervalRoutines)
  }
})

tggCkbox.addEventListener('click', () => {  
  if(tggCkbox.checked){
    // 1. update label
    document.querySelector('#tgg-label').innerText = 'Work'
    // 2. update state sequence
    stateSequence = [0, 5, 0, 5, 1, 5, 0, 5];
  } else {
    // 1. update label
    document.querySelector('#tgg-label').innerText = 'Leisure'
    // 2. update state sequence
    stateSequence = [2, 5, 3, 5, 1, 5, 4, 5];
  }
})

startController.addEventListener('click', () => {
  if(controllerState !== 'start'){
    controllerState = 'start'
    // 1. clear interval time
      // 1.1. clear interval from sequence
      clearInterval(stateArr[stateSequence[stateIndex]].interval)
      // 1.2. clear interval from manually break or meeting
      clearInterval(intervalManuallyBreak)
      // 1.3. reset bar count up value to null
      barCountUp.innerText = ''
      // 1.4. hide bar count up
      barCountUp.style.display = 'none'
    // 2. clear all background color of controllers
    startController.style.background = '#fff'
    startController.style.borderStyle = 'none'
    stopController.style.background = '#fff'
    stopController.style.borderStyle = 'none'
    meetingController.style.background = '#fff'
    meetingController.style.borderStyle = 'none'
    resetController.style.background = '#fff'
    // 3. highlight background color of start
    startController.style.background = '#FFFF00'
    startController.style.border = '2px solid #ff0000'
    // 4. run timer
    CountDown();
  }
})

stopController.addEventListener('click', () => {
  ManuallyBreakOrMeeting('manually break')
})

meetingController.addEventListener('click', () => {
  ManuallyBreakOrMeeting('meeting')
})

resetController.addEventListener('click', () => {
  // 1. refresh page
  window.location.reload()
})