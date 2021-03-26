
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

function typed(event){
    let char = event.which || event.keyCode;
    let str = String.fromCharCode(char);
    console.log(`${str}?${letterNodes[current].innerHTML}`);
    if(str===letterNodes[current].innerHTML || letterNodes[current].innerHTML === " "){
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
    alert(`Your typing speed is ${wpm}`);
    window.location.reload();
}

//changes the current time you can take to complete the typing
function changeCurrentTime(event){
    currentTimer = parseInt(event.target.innerHTML);
}