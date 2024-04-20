let buttonElement = document.getElementById('button');
let textElement = document.getElementById('textBox');
let checkboxNsfw = document.getElementById('nsfw');
let checkboxReligion = document.getElementById('religion');
let checkboxPolitics = document.getElementById('politics');
let checkboxRacist = document.getElementById('racist');
let checkboxSexist = document.getElementById('sexist');

// Check if we allow explicit jokes
function optionalJokesCheck() {
  let apiUrl = `https://v2.jokeapi.dev/joke/Any?blacklistFlags=`;
  !checkboxNsfw.checked ? (apiUrl += 'nsfw,') : undefined;
  !checkboxReligion.checked ? (apiUrl += 'religious,') : undefined;
  !checkboxPolitics.checked ? (apiUrl += 'political,') : undefined;
  !checkboxRacist.checked ? (apiUrl += 'racist,') : undefined;
  !checkboxSexist.checked ? (apiUrl += 'sexist,') : undefined;
  // Remove comma from the end of the url
  apiUrl.endsWith(',') ? (apiUrl = apiUrl.slice(0, -1)) : undefined;
  return apiUrl;
}

// Get Joke from API
async function getJoke() {
  if (!window.speechSynthesis.speaking) {
    let joke = '';
    const apiUrl = optionalJokesCheck();
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      // Check if joke is a single type or two part type
      if (data.setup) {
        joke = `${data.setup} \n${data.delivery}`;
      } else joke = data.joke;
      write(joke), speak(joke);
    } catch (error) {
      //Catch Errors Here
      console.log('Error: ', error);
    }
  }
}

// Disable/Enable Button
function toggleButton() {
  buttonElement.disabled = !buttonElement.disabled;
}

// Write the joke out
function write(joke) {
  textElement.value = '';
  let i = 0;
  const type = () => {
    if (i < joke.length) {
      textElement.value += joke.charAt(i);
      i++;
      setTimeout(type, 50);
    }
  };
  type();
}

// Speak the joke out
function speak(joke) {
  // Disable Button on speech start
  toggleButton();
  let utterance = new SpeechSynthesisUtterance(joke);
  speechSynthesis.speak(utterance);
  // Enable Button on speech end
  utterance.onend = () => {
    toggleButton();
  };
}

// Event Listeners
buttonElement.addEventListener('click', getJoke);
