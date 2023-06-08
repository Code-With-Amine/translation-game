import words from './jsonData.json' assert { type: 'json' };

$(document).ready(function() {
  let userSelectedSourceLang;
  let userSelectedTargetLang;
  let userSelectedCategory;
  let phraseInTargetLang;
  let randPhrase;
  let score = 0;
  let repeatedPhrases = [];
  let rightAnswers = 0;
  let wrongAnswers = 0;
  let attempts = 3;
  let interval;
  let resultState = $('#result-state');
  let showResult = $('.showResult');
  let showHint = $('.showHint');
  const modal = $("#myModal");
  let SourceLang = $('#SourceLang');
  let TargetLang = $('#TargetLang');
  let category = $('#category')

  let translatedWords = words.translations;

  let codeToLanguage = {
    'en': 'English',
    'ar': 'Arabic',
    'fr': 'French',
    'es': 'Spanish'
  };

  let isRepeated = [];

  for (let i of translatedWords) {
    if (!isRepeated.includes(i.sourceLanguage)) {
      const langName = i.sourceLanguage;
      SourceLang.append(`<option value="${i.sourceLanguage}">${codeToLanguage[langName]}</option>`);
      isRepeated.push(i.sourceLanguage);
    }
  }

  isRepeated = [];

  for (let i of translatedWords) {
    if (!isRepeated.includes(i.targetLanguage)) {
      const langName = i.targetLanguage;
      TargetLang.append(`<option value="${i.targetLanguage}">${codeToLanguage[langName]}</option>`);
      isRepeated.push(i.targetLanguage);
    }
  }

  // create the category list options
  isRepeated = [];
  for (let i of translatedWords) {
      if (!isRepeated.includes(i.category)) {
          category.append(`<option value="${i.category}">${i.category}</option>`);
          isRepeated.push(i.category);
      }
}


  SourceLang.on('change', function() {
    userSelectedSourceLang = SourceLang.val();
    localStorage.setItem('sourceLang', userSelectedSourceLang);
    window.location.href = "selectTargetLang.html";
  });

  TargetLang.on('change', function() {
    userSelectedTargetLang = TargetLang.val();
    localStorage.setItem('targetLang', userSelectedTargetLang);
    window.location.href = "category.html";
  });

  category.on('change', function() {
    userSelectedCategory = category.val();
    localStorage.setItem('category', userSelectedCategory);
    window.location.href = "userInfo.html";
  });

  startTheGame(localStorage.getItem('sourceLang'), localStorage.getItem('targetLang'), localStorage.getItem('category'));

  function startTheGame(source, target, category) {
    let randIndex;
    let convertSourceLangToArray;
    attempts = 3;
    $('.placeholder > input').val('');
    showResult.css('display', 'none');
    showHint.css('display', 'none');

    $('#nextBtn').prop('disabled', true);
    $('#checkAnswer').prop('disabled', false);

    for (let i of translatedWords) {
      if (i.sourceLanguage === source && i.targetLanguage === target && i.category === category) {
        // prevent the phrase from been repeated
        do{
            if(isGameOver(convertSourceLangToArray, repeatedPhrases)){//check if the game is over or not
                  clearInterval(interval);
                  $('#nextBtn').prop('disabled', true);
                  $('#checkAnswer').prop('disabled', true);
                  $('#result').click();
                  showResult.show();
                  showResult.text('The Game has ended You did well :)')
                  break;
            }else
              {
                convertSourceLangToArray = Object.keys(i.phrases);
                randIndex = Math.floor(Math.random() * convertSourceLangToArray.length);
                randPhrase = convertSourceLangToArray[randIndex];
              }

      }while(repeatedPhrases.includes(randPhrase))
        $('.showSourceLangWord > p').text(randPhrase);
        phraseInTargetLang = i.phrases[randPhrase];
        repeatedPhrases.push(randPhrase);
        setGameTime();
      }
    }
  }


  function setGameTime() {
    let time = 60;
    let timing = $('#timer');
    timing.css('color', 'black');

    clearInterval(interval);

    interval = setInterval(() => {
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
        wrongTranslation('Unfortunately, the time has ended and you did not answer', 'Unfortunately, you lost. The correct phrase is');
      }
    }, 1000);
  }


  function checkAnswer() {
    const userAnswer = $('.placeholder > input').val().toLowerCase();
    if (userAnswer === phraseInTargetLang) {
      correctAnswer();
    } else {
      wrongTranslation('Your answer is wrong', "It seems that you couldn't find the correct word");
    }
  }


  function wrongTranslation(reason, lostReason) {
    showResult.css('display', '');
    if (attempts === 1) {
      clearInterval(interval);
      $('.placeholder > input').val('');
      resultState.html(`${lostReason} <span style="font-size:1.5rem; color:green;">${phraseInTargetLang}</span>`);
      showHint.css('display', '');
      $('#nextBtn').prop('disabled', false);
      $('#checkAnswer').prop('disabled', true);
      wrongAnswers++;
    } else {
      attempts--;
      showResult.fadeIn('fast');
      resultState.text(`${reason} You have ${attempts} attempts left`);

      setTimeout(function() {
        showResult.fadeOut(4000);
        showHint.fadeOut(4000);
        setGameTime();
      }, 5000);
    }

    showHint.css('display', '');
    const similarityPercentage = calculateSimilarityPercentage($('.placeholder > input').val().toLowerCase(), phraseInTargetLang);
    $('.showHint > p').text(`You were ${similarityPercentage}% close to the phrase`);
  }


  function correctAnswer() {
    $('.placeholder > input').val('');
    showResult.css('display', '');
    resultState.html('<span style="color:green;font-size:1.5rem"><img src="images/wrightAnswer.png" class="icon"> Well done! Your translation of the phrase is correct</span>');
    clearInterval(interval);
    $('#nextBtn').prop('disabled', false);
    $('#checkAnswer').prop('disabled', true);
    rightAnswers++;
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
    return similarity.toFixed(2);
  }


  //check if the game over
  function isGameOver(phrases, shownPhrases){
    try{
          let over;
          for(let i of phrases){ // loop through the actulle array that contains the phrases
            for(let j of shownPhrases){ // loop through the array which contains the phrases which already appeared to the user
              if(i === j){ // if you found the phrase in both arrays means the game may be over
                over = true;
                break;
              }else{
                over = false
              }
            }
            if(over === false ){ // if one phrase isn't exsists in the array it means that the game isn't over yet
              break;
            }
          }
          return over;
        }catch(err){
          return false
        }
  }


  function CalculateScore(Answers, totalQuestions){
      return Math.round((Answers / totalQuestions)* 100 , 2);
  }

  $('#checkAnswer').on('click', checkAnswer);

  $('#nextBtn').on('click', () => startTheGame(localStorage.getItem('sourceLang'), localStorage.getItem('targetLang'), localStorage.getItem('category')));

  $('#result').on('click', function() {
    modal.show();
    const totalQuestions = rightAnswers + wrongAnswers
    score = CalculateScore(rightAnswers, totalQuestions)
    $('.modal-content > h2').html(`<i class="fa-solid fa-user"></i> ${localStorage.getItem('userFirstName')}  ${localStorage.getItem('userLastName')}`)
    $('.modal-content > p').text(`You answered ${rightAnswers} out of ${totalQuestions}`); // show how many answer are true out of the totalQuestions
    $('.modal-content > #score').text(`Score: ${score}%`)
    
  });

  $(window).on("click", function(event) {
    if (event.target == modal[0]) {
      closeModal();
    }
  });


  function closeModal() {
    modal.hide();
  }
});