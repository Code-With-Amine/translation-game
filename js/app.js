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


        const JSONwords = '{"translations":[{"sourceLanguage":"en","targetLanguage":"fr","phrases":{"hello":"bonjour","goodbye":"au revoir","thank you":"merci","cat":"chat","dog":"chien","house":"maison","apple":"pomme","car":"voiture","book":"livre","music":"musique","friend":"ami","sun":"soleil","tree":"arbre","flower":"fleur","love":"amour","food":"nourriture"}},{"sourceLanguage":"en","targetLanguage":"es","phrases":{"hello":"hola","goodbye":"adiós","thank you":"gracias","cat":"gato","dog":"perro","house":"casa","apple":"manzana","car":"coche","book":"libro","music":"música","friend":"amigo","sun":"sol","tree":"árbol","flower":"flor","love":"amor","food":"comida"}},{"sourceLanguage":"en","targetLanguage":"ar","phrases":{"hello":"مرحبا","goodbye":"وداعا","thank you":"شكرا","cat":"قطة","dog":"كلب","house":"منزل","apple":"تفاحة","car":"سيارة","book":"كتاب","music":"موسيقى","friend":"صديق","sun":"شمس","tree":"شجرة","flower":"زهرة","love":"حب","food":"طعام"}},{"sourceLanguage":"fr","targetLanguage":"en","phrases":{"bonjour":"hello","au revoir":"goodbye","merci":"thank you","chat":"cat","chien":"dog","maison":"house","pomme":"apple","voiture":"car","livre":"book","musique":"music","ami":"friend","soleil":"sun","arbre":"tree","fleur":"flower","amour":"love","nourriture":"food"}},{"sourceLanguage":"fr","targetLanguage":"es","phrases":{"bonjour":"hola","au revoir":"adiós","merci":"gracias","chat":"gato","chien":"perro","maison":"casa","pomme":"manzana","voiture":"coche","livre":"libro","musique":"música","ami":"amigo","soleil":"sol","arbre":"árbol","fleur":"flor","amour":"amor","nourriture":"comida"}},{"sourceLanguage":"fr","targetLanguage":"ar","phrases":{"bonjour":"مرحبا","au revoir":"وداعا","merci":"شكرا","chat":"قطة","chien":"كلب","maison":"منزل","pomme":"تفاحة","voiture":"سيارة","livre":"كتاب","musique":"موسيقى","ami":"صديق","soleil":"شمس","arbre":"شجرة","fleur":"زهرة","amour":"حب","nourriture":"طعام"}},{"sourceLanguage":"ar","targetLanguage":"en","phrases":{"مرحبا":"hello","وداعا":"goodbye","شكرا":"thank you","قطة":"cat","كلب":"dog","منزل":"house","تفاحة":"apple","سيارة":"car","كتاب":"book","موسيقى":"music","صديق":"friend","شمس":"sun","شجرة":"tree","زهرة":"flower","حب":"love","طعام":"food"}},{"sourceLanguage":"ar","targetLanguage":"es","phrases":{"مرحبا":"hola","وداعا":"adiós","شكرا":"gracias","قطة":"gato","كلب":"perro","منزل":"casa","تفاحة":"manzana","سيارة":"coche","كتاب":"libro","موسيقى":"música","صديق":"amigo","شمس":"sol","شجرة":"árbol","زهرة":"flor","حب":"amor","طعام":"comida"}},{"sourceLanguage":"ar","targetLanguage":"fr","phrases":{"مرحبا":"bonjour","وداعا":"au revoir","شكرا":"merci","قطة":"chat","كلب":"chien","منزل":"maison","تفاحة":"pomme","سيارة":"voiture","كتاب":"livre","موسيقى":"musique","صديق":"ami","شمس":"soleil","شجرة":"arbre","زهرة":"fleur","حب":"amour","طعام":"nourriture"}}]}'
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
