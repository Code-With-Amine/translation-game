import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import words from './jsonData.json' assert { type: 'json' };

$(document).ready(function(){
        const appSetting = {
                databaseURL: 'https://translation-game-1eda5-default-rtdb.europe-west1.firebasedatabase.app/'
        } 

        const app = initializeApp(appSetting) // link firebase with my app in other words link the project with the url of the databse in databaseURL to this script
        const database = getDatabase(app)
        const SourceLanguagesInDatabase = ref(database, "souceLang") // I created a refrence to my databse in firebase called " souceLang "
        const TargetedLanguagesInDatabase = ref(database, "targetedLang") 

        let SourceLang = $('#SourceLang'); // retrive the select list for the source language
        let TargetLang = $('#TargetLang'); // retrive the select list for the source language

        let translatedWords = words.translations // extract the arry which exsists in the object of words
        let codeToLanguage = {
          'en':'English',
          'ar':'Arabic',
          'fr':'French',
          'es':'Spanish'
        } // object to convert the language code to the language Name
        let isRepeated = 0; // variable to store repeated words

        for(let i of translatedWords){ // loop for each source lange and add it to the select list
            if(isRepeated !== i.sourceLanguage){ // check if that lang is already inserted or not
              const langName = i.sourceLanguage
                SourceLang.append(`<option value="${i.sourceLanguage}">${codeToLanguage[langName]}</option>`);
                isRepeated = i.sourceLanguage
            }
        }
        isRepeated = [];
        // set the langauges into the target language select list
        for(let i of translatedWords){
            if(!isRepeated.includes(i.targetLanguage)){ // check if that lang is already inserted or not
              const langName = i.targetLanguage
                TargetLang.append(`<option value="${i.targetLanguage}">${codeToLanguage[langName]}</option>`);
                isRepeated.push(i.targetLanguage)
            }
        }

        // ckeck if the user has chose a lange in the source languages
        SourceLang.on('change',function(){
             push(SourceLanguagesInDatabase, SourceLang.val() ); // store the source language that the user have chosen in my data base in the souceLang refrence
             window.location.href = "selectTargetLang.html"; 
        })

       // ckeck if the user has chose a lange in the targeted languages
       TargetLang.on('change',function(){
        push(TargetedLanguagesInDatabase, TargetLang.val());
        window.location.href = "game.html";
       })

       // Let's retrive the scource language and targeted language
       let userSourceLang;
       let userTargetLang;
       
       function getSourceLang(callback) {
        onValue(SourceLanguagesInDatabase, function(snapshot) {
          let sourceLangArr = Object.values(snapshot.val());
              userSourceLang = sourceLangArr[(sourceLangArr.length) - 1];
              callback(userSourceLang);
        });
      }

      function getTargetLang(callback) {
       onValue(TargetedLanguagesInDatabase, function(snapshot){
        let targetLangArr = Object.values(snapshot.val());
        userTargetLang = targetLangArr[(targetLangArr.length) - 1]
        callback(userTargetLang);
       })
    };

        getSourceLang(function(userSourceLang){});

        getTargetLang(function(userTargetLang) { // the purpose of this function is to get the values of userTargetLang, userSourceLang after they have been loaded

        startTheGame(userSourceLang, userTargetLang)
        
    });

    let phraseInTargetLang;
    let randPhrase;
    let rightAnswers = 0;
    let WrongAnswers = 0;
    let attempts = 3;
    let interval;
    let resultState = $('#result-state');
    let showrsult = $('.showResult');
    let showHint = $('.showHint');

    const modal = $("#myModal");


function startTheGame(source, target){
    attempts = 3;// reinitalize the attampts
    $('.placeholder > input').val('') //clear the input
    showrsult.css('display','none')
    showHint.css('display','none')

    $('#nextBtn').prop('disabled', true) // disable the next button
    $('#checkAnser').prop('disabled', false) // enable the check button

    // let's generate a random word in the source language
    for(let i of translatedWords){
        if(i.sourceLanguage === source && i.targetLanguage === target){ // loop throw all the item if you found the targetLanguage and sourceLanguage same onces as in the firebase database chose from it a random word 
            let convertSourceLangToArray = Object.keys(i.phrases); // convert the object to array
            let randIndex = Math.floor(Math.random() * convertSourceLangToArray.length)
            randPhrase = convertSourceLangToArray[randIndex]
            $('.showSourceLangWord > p').text(randPhrase)
            phraseInTargetLang = i.phrases[randPhrase] // Retrive the word in the targeted language
        }
    }

    // let's check the user input when the check button is clicked
    $('#checkAnser').off('click').on('click', CheckAnswer);
    SetGameTime()
}


function SetGameTime(){
    let time = 60;
    let timing = $('#timer')
    timing.css('color', 'black');

  // Clear the previous interval if it exists
    clearInterval(interval);

        interval = setInterval(() => { // set a timing of 1 mintue it passes and there is no answer the user will lose 1 point
        if (time < 10) {
          timing.html(`00:0${time}`);
          timing.css('color', 'red');
        } else {
          timing.html(`00:${time}`);
        }
      
        time--;
      
        if (time === 0) {
          clearInterval(interval);
          timing.html(`00:00`);
          lost('Unfortunately the time has ended and you did not answer', 'unfortunately you lost the correct phrase is')
        }
      }, 1000);
}


function CheckAnswer(){
    const userAnswer = $('.placeholder > input').val().toLowerCase() // make the user input case insansitive
    if(userAnswer === phraseInTargetLang){
        correctAnswer()
    }else{
        lost('You Answer is wrong', "It seems that you couldn't find the correct word")
    }
}

// this function is called whenever the answer is wrong
function lost(reason, lostReason){
    showrsult.css('display','')
    if(attempts == 1){
        $('.placeholder > input').val('') //clear the input
        resultState.html(`${lostReason} <span style="font-size:1.5rem; color:green;">${phraseInTargetLang}</span> ` )
        clearInterval(interval);
        showHint.fadeOut(5000)
        $('#nextBtn').prop('disabled', false)
        $('#checkAnser').prop('disabled', true)// disable the check button
        WrongAnswers++;

    }else{
            attempts--
            showrsult.fadeIn('fast')
            resultState.text(`${reason} you have ${attempts} attempts left`)


            setTimeout(function(){
                showrsult.fadeOut(4000);
                showHint.css('display','none')
                SetGameTime()// set another timeLine for the game

            },5000) // after 6 secondes hide the result state message
    }
    showHint.css('display','')
    const similarityPercentage = calculateSimilarityPercentage($('.placeholder > input').val().toLowerCase(), phraseInTargetLang)
    $('.showHint > p').text(`You were ${similarityPercentage}% close to the phrase`)
}


function correctAnswer(){
    $('.placeholder > input').val('') //clear the input
    showrsult.css('display','')
    resultState.html('<span style="color:green;font-size:1.5rem">Well done your translation to the phrase is correct</span> <img src="images/party-popper.png" class="icon">')
            clearInterval(interval);
        $('#nextBtn').prop('disabled', false)
        $('#checkAnser').prop('disabled', true)// disable the check button
        rightAnswers++
}


function calculateSimilarityPercentage(targetWord, userInput) {
    var maxLength = Math.max(targetWord.length, userInput.length);
    var correctCharacters = 0;
  
    for (var i = 0; i < targetWord.length; i++) {
      if (targetWord[i] === userInput[i]) {
        correctCharacters++;
      }
    }
  
    var similarity = (correctCharacters / maxLength) * 100;
    return similarity.toFixed(2); // Round to 2 decimal places
  }

// Go to the next word when the user clicks on the next button
$('#nextBtn').off('click').on('click', () => startTheGame(userSourceLang, userTargetLang));

// show the user score
$('#result').on('click',function(){
    modal.show(); // open the modal dialog
    $('.modal-content > p').text(`You answered ${rightAnswers} out of ${rightAnswers + WrongAnswers}`)
})

// Close the modal dialog when clicked outside
$(window).on("click", function (event) {
    if (event.target == modal[0]) {
      closeModal();
    }
  });

  // Close the modal dialog
  function closeModal() {
    modal.hide();
  }
}) 
