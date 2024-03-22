new Sortable(document.getElementById('sortable-list'), {
    animation: 250, // Set animation duration (in milliseconds)
    swapThreshold: 1,
    ghostClass: 'highlight-bg',
});

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

let easyWords;
let mediumWords;
let hardWords;

const easyBtn = document.getElementById('easyLevel');
const midBtn = document.getElementById('midLevel');
const hardBtn = document.getElementById('hardLevel');

const introGame = document.getElementById('introGame');
const playGame = document.getElementById('playGame');


const container = document.getElementById('sortable-list');
const submitBtn = document.getElementById('submitButton');
const letterList = document.getElementById('sortable-list').childNodes;
const scoreText = document.getElementById('countdown');

let dict;
let score = 0;

let originalWord
let scrabbledWord

// Function to fetch words data
function fetchWordsData() {
    fetch('./dict.json')
        .then((response) => response.json())
        .then((data) => {
            easyWords = data.easy;
            mediumWords = data.medium;
            hardWords = data.hard;
        })
        .catch((error) => {
            console.error('Error fetching JSON:', error);
        });
}

window.onload = fetchWordsData;

function startGame() {
    originalWord = getRandomElementFromArray(dict).toUpperCase();
    fetchWordDefinition(originalWord);
    scrabbledWord = scrabbleWord(originalWord).toUpperCase();
    splitStringAndCreateElements(scrabbledWord, container);
}


function scrabbleWord(word) {
    let shuffledWord = word;

    while (shuffledWord === word) {
        let letters = word.split('');

        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }

        shuffledWord = letters.join('');
    }

    return shuffledWord;
}

function getRandomElementFromArray(arr) {
    if (arr.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
}


fetchWordDefinition(originalWord);

function splitStringAndCreateElements(str, parentElement) {
    const letters = str.split('');

    letters.forEach((letter) => {
        const letterElement = document.createElement('li');
        letterElement.textContent = letter;

        parentElement.appendChild(letterElement);
    });
}





function getTextFromUl() {
    const ulId = 'sortable-list';
    const ulElement = document.getElementById(ulId);
    if (!ulElement) {
        console.error('UL element not found');
        return '';
    }

    let textString = '';

    ulElement.querySelectorAll('li').forEach((li) => {
        textString += li.textContent.trim();
    });

    textString = textString.trim();

    console.log(textString);
    console.log(originalWord);

    const timeline3 = gsap.timeline({
        onComplete: () => {
            timeline3.reverse();
        },
    });

    timeline3.to(submitBtn, {
        scale: 0.9,
        duration: 0.1,
        ease: 'expo.Out',
    });

    timeline3.play();

    if (textString == originalWord) {
        const timeline = gsap.timeline({
            onComplete: () => {
                getNewWord();
                // Reverse the animation after a delay

                gsap.delayedCall(0.25, () => {
                    timeline.reverse();
                });
            },
        });

        timeline.to(letterList, {
            backgroundColor: '#29CC52',
            y: -30,
            duration: 0.25,
            stagger: 0.05,
            ease: 'expo.Out',
        });

        timeline.play();
    } else {
        const timeline2 = gsap.timeline({
            onComplete: () => {
                // Reverse the animation after a delay

                gsap.delayedCall(0.25, () => {
                    timeline2.reverse();
                });
            },
        });

        timeline2.to(letterList, {
            backgroundColor: '#BB2532',
            duration: 0.25,
            stagger: 0.05,
            ease: 'expo.Out',
        });

        timeline2.play();
    }
}



letterList.forEach((item) => {
    item.addEventListener('pointerenter', () => {
        gsap.to(item, {
            color: '#2832F6',
            backgroundColor: '#e5e5f7',

            duration: 0.25,
            ease: 'expo.Out',
        });
    });

    item.addEventListener('pointerleave', () => {
        gsap.to(item, {
            backgroundColor: '#2832F6',
            color: '#e5e5f7',
            duration: 0.25,
            ease: 'expo.Out',
        });
    });
});

function fetchWordDefinition(originalWord) {
    const word = originalWord;
    const clueP = document.getElementById('clueP');

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((response) => response.json())
        .then((data) => {
            // Check if the API returned a valid response
            if (data.title && data.title === 'No Definitions Found') {
                console.log('No definitions found for the word.');
            } else {
                // Get the first definition from the API response
                const firstDefinition =
                    data[0]?.meanings[0]?.definitions[0]?.definition;
                console.log('Definition:', firstDefinition);
                clueP.textContent = firstDefinition;
            }
        })
        .catch((error) => {
            console.error('Error fetching definition:', error);
        });
}

function getNewWord() {
    const timeline4 = gsap.timeline({
        onComplete: () => {
            // Reverse the animation after a delay
            container.innerHTML = '';
            splitStringAndCreateElements(scrabbledWord, container);
            fetchWordDefinition(originalWord);
            gsap.fromTo(
                letterList,
                {
                    // backgroundColor: "e5e5f7",
                    scale: 0,
                    duration: 0.25,
                    stagger: 0.05,
                    ease: 'expo.Out',
                    delay: 1.5,
                },
                { scale: 1, duration: 0.25, stagger: 0.05, ease: 'expo.out' }
            );
        },
    });

    timeline4.to(letterList, {
        // backgroundColor: "e5e5f7",
        scale: 0,
        duration: 0.25,
        stagger: 0.05,
        ease: 'expo.Out',
        delay: 1.5,
    });

    timeline4.play();

    originalWord = getRandomElementFromArray(dict).toUpperCase();
    scrabbledWord = scrabbleWord(originalWord).toUpperCase();


    scoreText.textContent = `Score: ${(score += 1)}`;
}

function easyLevel() {
    introGame.style.display = 'none';
    playGame.style.display = 'flex';
    dict = easyWords;
    console.log(dict);
    startGame()
}

function midLevel() {
    introGame.style.display = 'none';
    playGame.style.display = 'flex';
    dict = mediumWords;
    console.log(dict);
    startGame()
}

function hardLevel() {
    introGame.style.display = 'none';
    playGame.style.display = 'flex';
    dict = hardWords;
    console.log(dict);
    startGame()
}


const lvlBtn = document.getElementById('chooseLever').childNodes

const timeline3 = gsap.timeline({
    onComplete: () => {
        timeline3.reverse();
    },
});

timeline3.to(lvlBtn, {
    scale: 0.9,
    duration: 0.1,
    ease: 'expo.Out',
});

timeline3.play();