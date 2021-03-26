
let timerRunning = false;

let words = [];
let chars = [];

let totalChars = 0;
let correct = 0;

let current = 1;
let letterNodes;

let currentTimer = 15;
let startTime;
let endTime;

let darkMode = true;
$(document).ready(()=>{
    initialise();
    document.getElementById("firstTimer").focus();
})

async function initialise(){
    /**
     * Get words from the website below through promises
     */
    const response = await fetch("https://random-word-api.herokuapp.com/word?number=200");

    if(!response.ok){
        throw new Error(response.statusText);
    }

    let wordJSON = await response.json();
    wordJSON.forEach(word => words.push(word));

    // words = [...randomWords(200)];

    /**
     * Append the words to the div element in the HTML document
     */
    let elementText = document.getElementById("words");
    for(let word of words){
        for(let char of word.split("")){
            totalChars++;
            $("<span>").text(char).appendTo("#words");
            chars.push(char);
            // elementText.innerHTML += char;
        }
        totalChars++;
        chars.push(" ");
        $("<span>").text(" ").appendTo("#words");
    }

    /**
     * Assigning each span element as a letter to letters array for easy
     * access, almost as a way of binding
     */
    letterNodes = document.getElementById("words").childNodes;
}   

/**
 * In case of typed
 */
function typed(event){
    let char = event.which || event.keyCode;
    //the character which is typed is recorded
    let str = String.fromCharCode(char);
    //the character is then converted to a String from the char code
    
    if(currentTimer===0){
        document.getElementById("firstTimer").focus();
        currentTimer=15;
    }

    if(str===letterNodes[current].innerHTML || letterNodes[current].innerHTML === " "){
    //if the current letter matches the character typed the score is appended
    //if the current word is the first letter then timer is started
        if(current==1){
            startTimer();
        }
        letterNodes[current].style.color = "green";
        correct++;
    }
    else{
        letterNodes[current].style.color = "red";
    }
    totalChars++;
    current++;
    checkToEndTimer();
    //checks if timer has ended everytime they type a character
    //room for error here and thus room for improvement
}

//starts the timer for the typing
function startTimer(){
    startTime = new Date();
}

//checks if the time is up
//if time is up the game ends
function checkToEndTimer(){
    //if startTime hasn't been initalised method does nothing
    if(startTime!==undefined){
        let now = new Date();
        console.log(now.getTime()-startTime.getTime());
        if(now.getTime()-startTime.getTime()>=currentTimer*1000){
            end();
        }
    }
}

function end(){
    const wpm = (60/currentTimer)*(correct/5);
    alert(`Your typing speed is ${wpm} words per minute.`);
    window.location.reload();
}

//changes the current time you can take to complete the typing
function changeCurrentTime(event){
    currentTimer = parseInt(event.target.innerHTML);
}

/**
 * function to toggle dark mode 
 * and light mode
 */
function changeDisplayMode(){

    //changes the display mode of the entire document
    document.querySelector("body").classList.toggle("dark-theme");
    document.querySelector("body").classList.toggle("light-theme");
    darkMode = !darkMode;

    //shifts the focus to the darkmode button
    currentTimer = 0;

    //changes the src of the picture
    document.getElementById("display-mode-picture")
    .src = darkMode ? 
    "/icons/sun_52px.png": "/icons/night_100px.png";
}