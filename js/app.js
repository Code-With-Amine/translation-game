import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase, ref, push, onValue} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
$(document).ready(function(){

        const appSetting = {
                databaseURL: 'https://translation-game-1eda5-default-rtdb.europe-west1.firebasedatabase.app/'
        } 

        const app = initializeApp(appSetting) // link firebase with my app in other words link the project with the url of the databse in databaseURL to this script
        const database = getDatabase(app)
        const SourceLanguagesInDatabase = ref(database, "souceLang") // I created a refrence to my databse in firebase called " souceLang "
        const TargetedLanguagesInDatabase = ref(database, "targetedLang") 


        const JSONwords = '{"translations":[{"sourceLanguage":"en","targetLanguage":"fr","phrases":{"hello":"bonjour","goodbye":"au revoir","thank you":"merci","cat":"chat","dog":"chien","house":"maison"}},{"sourceLanguage":"en","targetLanguage":"es","phrases":{"hello":"hola","goodbye":"adiós","thank you":"gracias","cat":"gato","dog":"perro","house":"casa"}},{"sourceLanguage":"en","targetLanguage":"ar","phrases":{"hello":"مرحبا","goodbye":"وداعا","thank you":"شكرا","cat":"قطة","dog":"كلب","house":"منزل"}},{"sourceLanguage":"fr","targetLanguage":"en","phrases":{"bonjour":"hello","au revoir":"goodbye","merci":"thank you","chat":"cat","chien":"dog","maison":"house"}},{"sourceLanguage":"fr","targetLanguage":"es","phrases":{"bonjour":"hola","au revoir":"adiós","merci":"gracias","chat":"gato","chien":"perro","maison":"casa"}},{"sourceLanguage":"fr","targetLanguage":"ar","phrases":{"bonjour":"مرحبا","au revoir":"وداعا","merci":"شكرا","chat":"قطة","chien":"كلب","maison":"منزل"}},{"sourceLanguage":"ar","targetLanguage":"en","phrases":{"مرحبا":"hello","وداعا":"goodbye","شكرا":"thank you","قطة":"cat","كلب":"dog","منزل":"house"}},{"sourceLanguage":"ar","targetLanguage":"es","phrases":{"مرحبا":"hola","وداعا":"adiós","شكرا":"gracias","قطة":"gato","كلب":"perro","منزل":"casa"}},{"sourceLanguage":"ar","targetLanguage":"fr","phrases":{"مرحبا":"bonjour","وداعا":"au revoir","شكرا":"merci","قطة":"chat","كلب":"chien","منزل":"maison"}}]}'
        const words = JSON.parse(JSONwords);
        let SourceLang = $('#SourceLang'); // retrive the select list for the source language
        let TargetLang = $('#TargetLang'); // retrive the select list for the source language

        let translatedWords = words.translations // extract the arry which exsists in the object of words

        let isRepeated = 0; // variable to store repeated words

        for(let i of translatedWords){ // loop for each source lange and add it to the select list
            if(isRepeated !== i.sourceLanguage){ // check if that lang is already inserted or not
                SourceLang.append(`<option value="${i.sourceLanguage}">${i.sourceLanguage}</option>`);
                isRepeated = i.sourceLanguage
            }
        }
        isRepeated = [];
        // set the langauges into the target language select list
        for(let i of translatedWords){
            if(!isRepeated.includes(i.targetLanguage)){ // check if that lang is already inserted or not
                TargetLang.append(`<option value="${i.targetLanguage}">${i.targetLanguage}</option>`);
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
    let score = 0;
    let attempts = 3;
    let resultState = $('#result-state');
    let interval;

function startTheGame(source, target){
    attempts = 3;// reinitalize the attampts
    $('.placeholder > input').val('') //clear the input
    resultState.css('display','none')

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

function lost(reason, lostReason){

    resultState.css('display','block')
    if(attempts == 1){
        $('.placeholder > input').val('') //clear the input
        resultState.html(`${lostReason} <span style="font-size:1.5rem; color:green;">${phraseInTargetLang}</span>` )
        clearInterval(interval);
        $('#nextBtn').prop('disabled', false)
        $('#checkAnser').prop('disabled', true)// disable the check button
        score--;

    }else{
            attempts--
            resultState.fadeIn('fast')
            resultState.text(`${reason} you have ${attempts} attempts left`)


            setTimeout(function(){
                resultState.fadeOut(6000);
                SetGameTime()// set another timeLine for the game

            },6000) // after 6 secondes hide the result state message
    }
}


function correctAnswer(){
    $('.placeholder > input').val('') //clear the input
    resultState.css('display','block')
    resultState.text('Well done your translation to the phrase is correct')
            clearInterval(interval);
        $('#nextBtn').prop('disabled', false)
        $('#checkAnser').prop('disabled', true)// disable the check button
        score++
}

// Go to the next word when the user clicks on the next button
$('#nextBtn').off('click').on('click', () => startTheGame(userSourceLang, userTargetLang));

}) 
