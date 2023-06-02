import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase, ref, push} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
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
        //window.location.href = "game.html";
       })

    })