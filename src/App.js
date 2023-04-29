import React, {useState, useEffect, useRef, useReducer} from 'react';
import './App.scss';


//after calculating, use numberAmount func to find number of whole digits and decimal places
  //use this number to calculate the fontSize until a certain point (minimum font size)
    //if too small or large, use scientific notation
  //add fontSize func for when doing calculations, otherwise use reducer

//change toFixed num to var to take into account the input length
  //add scientific notation for very small and large numbers


//fix event listeners for keydown presses



//if the calcualtor is dragged off the 'table' it will fall off (useEffect hook, using mouse position as a state change?)
  //have this be a check for the mini game/scavenger hunt?

//background is a desk, with a paper on the right side of the calculator that displays the inputs like a history?

//cross browser support?

//add functionality to equal sign to repeat last operation
  //add another state of lastOperation
    //update last Operation by reverse searching through string until you find an operation,then return the operation and everything to the left of it
      //if whichButton was equal or enter, concat lastOperation to input and call handleEquals

//add history of operations?

//add 3 buttons for delete, minimize, and extend calculator
  //after deleting calculator, place big letters in center of screen saying "Oops now it's gone"
    //check if user has cookies enabled
      //if yes, call func that removes sessionStorage here
      //else put cookie alert again?
    //if a user refreshes the page, the calculator comes back but with letters on the side of the screen saying "refreshing doesn't work sorry"
    //if user navigates back to the home page, then back to the calculator app (navigation redirect)
      //letters on the screen saying "navigating back and forth ain't gonna cut it"
    //if user uses the history functionality in the browser to go back to the app
      //letters on the screen saying "oh you thought you were clever using the history functionality"
      //have a checklist that if user tries all 3 methods and tries to do another, bring up a button that resets everything that says "fine you can have it back"
  //after minimizing the calculator, create animation that sucks up calculator into the bottom of the screen?
    //need to keep track of element position before minimize to but it back where it was?
  //after extending the calculator,
    //add buttons (), sin, cos, tan, x^2 etc...
      //add factorial(!), sin, cos, tan, ln, log, e^, square root, cubed root, n root?, exponent(^), parentheses(creates opening and closing), pi, fraction (1/x), scienfitic notation (EE)
    //wont implemenet actual functionality so just add to input saying "will be added later" or something similar "forget about ittttt"
  

const initialDisplaySize = {fontSize: "40px"};

function reducer(state, action) {
  // console.log(state)
  switch (action.type) {
    case 'increaseSize':
      console.log(state.fontSize, 'do add 3')
      return {fontSize: (parseInt(state.fontSize.slice(0,-2)) + 3).toString() + 'px'};
    case 'decreaseSize':
      console.log(state.fontSize, 'do subtract 3')
      return {fontSize: (parseInt(state.fontSize.slice(0,-2)) - 3).toString() + 'px'};
    case 'reset':
        return {fontSize: '40px'};
    default:
      throw new Error();
  }
}


function App() {
  const [input, setInput] = useState(["0"]);
  // const [inputSize, setInputSize] = useState(0); 
  // const [whichButton, setWhichButton] = useState(""); use for checking if last operation was equals to run equals operation again
  const lastInputLength = useRef(1);
  const [state, dispatch] = useReducer(reducer, initialDisplaySize);
 
  useEffect(() => { //adds too many event listeners
    window.addEventListener('keydown', (e) => { //when user clicks different key other than those listed below, event listener doesnt work anymore as it needs a new render
      if (Number.isNaN(input[0])) return;
      // setWhichButton(e.key);
      let keycode = e.which;
      if(keycode >= 48 && keycode <= 57 && e.shiftKey === false) {
        handleNumberInput(e.key);
      }
      if (e.key === '+' && e.shiftKey === true) handleOperation('+');
      switch (e.key) {
        case '/':
          handleOperation('÷');
          break;
        case 'x':
          handleOperation('x');
          break;
        case '*':
          handleOperation('x');
          break;
        case '.':
          handleNumberInput('.');
          break;
        case '=':
          handleEquals();
          break;
        case 'Enter': //repeats last character inputted somehow
          handleEquals(); 
          break;
        case '-':
          handleOperation('-');
          break;
        case '+':
            handleOperation('+');
            break;
        case 'Backspace':
          handleBackSpace();
          break;
        default:
          break;
      }
      e.preventDefault();
    }, {once: true});
  });

  useEffect(() => {
    dragElement(document.getElementById("calculator"));
  }, []);
  
  useEffect(() => { 
    //if (typeof input[0] === 'number') add decimal place/integer size to both input lengths
    if (!(input.length >= 14 && input.length % 2 === 0)) { //this is if no calc was done yet
      if (input.length > 7) {
        if (input.length > lastInputLength.current) { 
          dispatch({type: 'decreaseSize'});
        } else {
          dispatch({type: 'increaseSize'});
        }
      }
      if (lastInputLength.current === 7) {
        dispatch({type: 'reset'});
      }
    }
    lastInputLength.current = input.length;
}, [input]);

  const handleNumberInput = (e) => {
    if (Number.isNaN(input[0])) return;
    let buttonValue = '';
    if (typeof e === 'string') {
      buttonValue = e;
    } else {
      buttonValue = e.target.value;
    }
    // setWhichButton(buttonValue);
    if(buttonValue === '.' && input.length >= 1) { 
        if(decimalCheck(input)) {
          setInput(input.concat(buttonValue));
        }
    } else if (input[0] === '0' && input.length === 1 && buttonValue !== '.') {
          setInput([buttonValue]);
        } else {
          setInput(input.concat(buttonValue))
      }
  }
  const handleClear = () => {
    setInput(['0']);
    dispatch({type: 'reset'});
  }
  const handleOperation = (e) => { 
    if (Number.isNaN(input[0])) return;
    let buttonValue = '';
    if (typeof e === 'string') {
      buttonValue = e;
    } else {
      buttonValue = e.target.value;
    }
    if (buttonValue === 'fraction') {
      if (input.includes('+') || input.includes('-') || input.includes('x') || input.includes('÷')) return;
      else {
        var fraction = 1 / parseFloat(input.join(''));
        setInput([+fraction.toFixed(8)]);
        //run numberAmount func
      }
      return;
    }
    // setWhichButton(buttonValue);
    var lastInput = input[input.length - 1];
    if ((input.length === 1 && input[0] === '-') || lastInput === '.') return;
    if (buttonValue === '-') {
      if (input.length === 1 && input[0] === '0') {
        setInput(['-']);
        return;
      }
      if (lastInput !== '.' && lastInput !== '-') {
        setInput(input.concat(buttonValue));
        return;
      } 
    }
    if (lastInput !== 'x' && lastInput !== '+' && lastInput !== '÷' && lastInput !== '-') { 
      setInput(input.concat(buttonValue));
    } else if (lastInput === '-') {
      return;
    } else {
      setInput(input.slice(0,-1).concat(buttonValue));
    } 
}
  const handleEquals = () => { //use past operation on current input (if implemented)
    if (Number.isNaN(input[0])) return;
    // if (whichButton === '=' || whichButton === 'Enter') {
  
    // } else 
    var lastInput = input[input.length - 1];
    if (input.length === 1 || (!input.includes('x') && !input.includes('+') && !input.includes('-') && !input.includes('÷'))) return; 
    if (lastInput === 'x' || lastInput === '+' || lastInput === '-' || lastInput === '÷' ) return;
    else setInput(calculate(input));
    //run font size function
  }
  const handleBackSpace = () => {
    console.log('backspace')
    if (typeof input[0] === 'number') {
      var tempInput = input[0].toString()
      setInput(tempInput.slice(0,-1));
    } else if (input[0] === '0' && input.length === 1) return;
        else setInput(input.slice(0,-1));
    if (input.length === 0) handleClear();
  }
  const minimize = () => {
    document.body.classList.add('minimize');

  }
  const maximize = () => {
    document.body.classList.remove('minimize');

  }
  return (
    <div id = 'container'>
      <div id = 'calculator'>
        <nav className =  'window-controls'>
          <div className =  'maximize'>Calculator</div>
          <div className =  'minimize'></div>
        </nav>
        <div id = 'calculatorheader'>
          <button>x</button>
          <button onClick={()=> minimize()}>-</button>
          <button onClick={() => maximize()}>+</button>
        </div>
          <div id = 'display' style={state}>{input}</div>
          <div className =  'btn-row'> 
            <button onClick = {()=> handleClear()} className =  'btn-ind-medium' id =  'clear'>Clear</button>
            <button value = {'fraction'} onClick = {e => handleOperation(e, 'value')} className =  'btn-ind-small' id = "fraction">1/x</button>       
            <button value = {'÷'} onClick = {e => handleOperation(e, 'value')} className =  'btn-ind-small btn-right' id = "divide">÷</button>       
          </div>
          <div className =  'btn-row'> 
            <button value = {'7'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small' id = "seven">7</button>
            <button value = {'8'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small' id = "eight">8</button>
            <button value = {'9'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small' id = "nine">9</button>
            <button value = {'x'} onClick = {e => handleOperation(e, 'value')} className =  'btn-ind-small btn-right' id = "multiply">x</button>
          </div>
          <div className =  'btn-row'> 
            <button value = {'4'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small' id = "four">4</button>
            <button value = {'5'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small' id = "five">5</button>
            <button value = {'6'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small' id = "six">6</button>
            <button value = {'-'} onClick = {e => handleOperation(e, 'value')} className =  'btn-ind-small btn-right' id = "subtract">-</button>
          </div>
          <div className =  'btn-row'> 
            <button value = {'1'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small' id = "one">1</button>
            <button value = {'2'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small' id = "two">2</button>
            <button value = {'3'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small' id = "three">3</button>
            <button value = {'+'} onClick = {e => handleOperation(e, 'value')} className =  'btn-ind-small btn-right' id = "add">+</button>
          </div>
          <div className =  'btn-row'>
            <button value = {'0'} onClick = {e => handleNumberInput(e, 'value')} className =   "btn-ind-small bottom" id = "zero">0</button>
            <button value = {'.'} onClick = {e => handleNumberInput(e, 'value')} className =  'btn-ind-small bottom' id = "decimal">.</button>
            <button onClick = {() => handleBackSpace()} className =   "btn-ind-small" id = "backSpace" >⌫</button>
            <button onClick = {()=> handleEquals()} className =  'btn-ind-small btn-right bottom' id = "equals">=</button>
            </div>
        </div>
      </div>

  );
}

const calculate = (input) => { 
  let inputCopy = [...input];
  const negativeCheck = (index) => {
    if (index === 0 || inputCopy[index - 1] === 'x' || inputCopy[index - 1] === '+' || inputCopy[index - 1] === '÷') {
      var negativeTemp = [];
      for (let i = index + 1; i < inputCopy.length; i++) {
        if (inputCopy[i] === 'x' || inputCopy[i] === '+' || inputCopy[i] === '-' || inputCopy[i] === '÷') break;
        negativeTemp.push(inputCopy[i]);
      }
      inputCopy.splice(index, negativeTemp.length + 1, parseFloat(negativeTemp.join('') * -1));
    }
  } 
  const combine = (operation, opIndex) => { 
    let tempLeftArray = [];
    let tempLeftJoin = '';
    let tempRightArray = [];
    let tempRightJoin = '';
    let countLeft = 0;
    let j = opIndex - 1; //index to left of operation
    while (j >= 0) {
      if (inputCopy[j] === 'x' || inputCopy[j] === '+' || inputCopy[j] === '-' || inputCopy[j] === '÷' ) {
            break;
      }
      tempLeftArray.unshift(inputCopy[j]);
      inputCopy.splice(j, 1);
      j--;
      countLeft++;
    }
    
    let k = opIndex - countLeft + 1; //index to right of operation
    while (k < inputCopy.length) {
      if (inputCopy[k] === 'x' || inputCopy[k] === '+' || inputCopy[k] === '-' || inputCopy[k] === '÷' ) {
        break;
      }
      tempRightArray.push(inputCopy[k]);
      inputCopy.splice(k, 1);
    } 
    tempLeftJoin = tempLeftArray.join(''); 
    tempRightJoin = tempRightArray.join('');
    switch (operation) {
      case 'x':
        inputCopy.splice(opIndex - countLeft, 1, (parseFloat(tempLeftJoin) * parseFloat(tempRightJoin)));
        break;
      case '÷':
        inputCopy.splice(opIndex - countLeft, 1, (parseFloat(tempLeftJoin) / parseFloat(tempRightJoin)));
        break;
      case '+':
        inputCopy.splice(opIndex - countLeft, 1, (parseFloat(tempLeftJoin) + parseFloat(tempRightJoin)));
        break;
      case '-':
        inputCopy.splice(opIndex - countLeft, 1, (parseFloat(tempLeftJoin) - parseFloat(tempRightJoin)));
        break;
      default:
        break;
      }
      return (countLeft);
  }
  for (let i = 0; i <inputCopy.length; i++) {
    if (inputCopy[i] === '-') negativeCheck(i);
  }

  for (let i = 0; i <inputCopy.length; i++) {
    if (inputCopy[i] === 'x' || inputCopy[i] === '÷') {
      i = i - combine(inputCopy[i], i);
    }
  }
  
  for (let i = 0; i < inputCopy.length; i++) {
    if (inputCopy[i] === '+' || inputCopy[i] === '-') {
      i = i - combine(inputCopy[i], i);
    }
  } 
  var decimalAmount = decimalPlaces(inputCopy[0]);
  console.log(decimalAmount)
  inputCopy[0] = +inputCopy[0].toFixed(8); //plus sign gets rid of trailing zeroes, rounds to 8th decimal place
  //run numberAmount func
  return inputCopy;
}
const decimalCheck = function(input) { 
  if (typeof input[0] === 'number') {
    if (!Number.isInteger(input[0])) { 
      for (let i = 1; i < input.length; i++) {
        if((input[i] === '+' || input[i] === '-' || input[i] === 'x' || input[i] === '÷')) {
          return true;
        }
      } return false;
    }
  }
  if(!input.includes('.')) {
    return true;
  }
  for (let i = input.lastIndexOf('.'); i < input.length; i++) {
    if((input[i] === '+' || input[i] === '-' || input[i] === 'x' || input[i] === '÷')) {
      return true;
    }
  }
}

const decimalPlaces = (n) => {
  var s = "" + (+n);
  var match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(s);
  if (!match) return 0;
  return Math.max(0, (match[1] === '0' ? 0 : (match[1] || '').length) - (match[2] || 0));
}
const formatByNumberAmount = (input) => {
  var decimalAmount = decimalPlaces(input); //shows number of decimal places
  var digitAmount = Math.log(input) * Math.LOG10E + 1 | 0; //shows number of digits
  if (digitAmount === 1 && input[0] < 1) { //a decimal number, check if scienfitic notation is needed?
    return +input[0].toFixed(8); //scientific notation starts at 1e16 for mac calc, 1e12 for android calc
  } //1e-16 for mac calc, 1e-5 or -8 for andorid, 
  else {
    return +input[0].toFixed(8 - digitAmount + 2); //change fontsize to show entire number up until certain point
  }
}

var minBoundX = 0; // -> Top Drag Position ( Minimum )
var minBoundY = 0;

var maxBoundX = 0; // -> Bottom Drag Position ( Maximum )
var maxBoundY = 0;
// var oldZIndex = 0; // -> Increase Z-Index while drag (needed if have multiple draggable elements)

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();

    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY; 

    // border(div container)
    minBoundX = e.target.parentNode.parentNode.offsetLeft - 150;
    minBoundY = e.target.parentNode.parentNode.offsetTop - 75;

    maxBoundX = minBoundX + e.target.parentNode.parentNode.clientWidth - e.target.clientWidth; 
    maxBoundY = minBoundY + e.target.parentNode.parentNode.offsetHeight - e.target.offsetHeight - 295; //295 is the height of the entire calculator

    // e.target.style.zIndex = 10; // -> Move element infront of others

    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.top =  Math.max(minBoundY, Math.min(elmnt.offsetTop - pos2, maxBoundY)) + "px";
    // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.left = Math.max(minBoundX, Math.min(elmnt.offsetLeft - pos1, maxBoundX)) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    // elmnt.style.zIndex = oldZIndex;
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
export default App;
