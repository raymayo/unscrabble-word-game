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

let selectedElements = [];

let strikes = 0

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
    const availableElements = arr.filter(element => !selectedElements.includes(element));

    if (availableElements.length === 0) {
        // Reset selectedElements if all elements have been selected
        selectedElements = [];
        return null;
    }

    const randomIndex = Math.floor(Math.random() * availableElements.length);
    const randomElement = availableElements[randomIndex];

    // Add the selected element to the selectedElements array
    selectedElements.push(randomElement);

    return randomElement;
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
            backgroundColor: '#1AFF05',
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
            backgroundColor: '#F50000',
            duration: 0.25,
            stagger: 0.05,
            ease: 'expo.Out',
        });

        timeline2.play();


        strikes += 1;

        switch (strikes) {
            case 1:
                gsap.to('#strike-1', { backgroundColor: '#F50000', color: 'white', ease: 'expo.out' })
                break;
            case 2:
                gsap.to('#strike-2', { backgroundColor: '#F50000', color: 'white', ease: 'expo.out' })
                break;
            case 3:
                gsap.to('#strike-3', { backgroundColor: '#F50000', color: 'white', ease: 'expo.out' })
                break;
            default:
                return
        }

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
                console.log(data);
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
    console.log(originalWord);
    console.log(selectedElements);
    scrabbledWord = scrabbleWord(originalWord).toUpperCase();


    scoreText.textContent = `Score: ${(score += 1)}`;
}

function easyLevel() {

    transition()
    dict = easyWords;
    console.log(dict);
    startGame()
}

function transition() {
    const transitionTimeline = gsap.timeline();
    transitionTimeline.fromTo(introGame, { opacity: 1, display: 'flex', ease: 'expo.out' }, { x: -200, opacity: 0, display: 'none', ease: 'expo.out' })
    transitionTimeline.fromTo(playGame, { display: 'none', x: 200, opacity: 0, ease: 'expo.out' }, { display: 'flex', x: 0, opacity: 1, ease: 'expo.out' })

}

function midLevel() {
    transition()
    dict = mediumWords;
    console.log(dict);
    startGame()
}

function hardLevel() {
    transition()
    dict = hardWords;
    console.log(dict);
    startGame()
}


const lvlBtn0 = document.querySelectorAll('.lvlBtn')[0]
const lvlBtn1 = document.querySelectorAll('.lvlBtn')[1]
const lvlBtn2 = document.querySelectorAll('.lvlBtn')[2]



lvlBtn0.addEventListener('pointerdown', () => {
    pointer0()
})

lvlBtn1.addEventListener('pointerdown', () => {
    pointer1()
})

lvlBtn2.addEventListener('pointerdown', () => {
    pointer2()
})

function pointer0() {
    const timeline3 = gsap.timeline({
        onComplete: () => {
            timeline3.reverse();
            easyLevel()

        },
    });

    timeline3.to(lvlBtn0, {
        scale: 0.9,
        duration: 0.1,
        ease: 'expo.Out',
    });

    timeline3.play();
}

function pointer1() {
    const timeline3 = gsap.timeline({
        onComplete: () => {
            timeline3.reverse();
            midLevel()

        },
    });

    timeline3.to(lvlBtn1, {
        scale: 0.9,
        duration: 0.1,
        ease: 'expo.Out',
    });

    timeline3.play();
}

function pointer2() {
    const timeline3 = gsap.timeline({
        onComplete: () => {
            timeline3.reverse();
            hardLevel()

        },
    });

    timeline3.to(lvlBtn2, {
        scale: 0.9,
        duration: 0.1,
        ease: 'expo.Out',
    });

    timeline3.play();
}

const intialAni = gsap.timeline()
intialAni.from('#title', { y: -100, opacity: 0, ease: 'expo.out' })
intialAni.from('#introGame', { y: -100, opacity: 0, ease: 'expo.out' }, '<.25')
intialAni.from('.ins', { y: -50, opacity: 0, ease: 'expo.out', stagger: 0.1 }, '<.5')
intialAni.from('.lvlBtn', { y: -100, opacity: 0, ease: 'expo.out', stagger: 0.1 }, '<.5')





