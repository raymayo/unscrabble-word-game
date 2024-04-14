new Sortable(document.getElementById('sort-group-1'), {
    group: {
        name: 'shared',

    },
    removeCloneOnHide: true,
    onEnd: handleEnd,
    animation: 150, // Set animation duration (in milliseconds)
});

new Sortable(document.getElementById('sort-group-2'), {
    group: {
        name: 'shared',
        pull: 'clone',
    },
    sort: false,
    animation: 150, // Set animation duration (in milliseconds)
});


function handleEnd(evt) {
    const item = evt.item;
    const fromList = evt.from;
    const toList = evt.to;

    // If the element is moved to a different list
    if (fromList !== toList) {
        // Remove the dragged item
        item.parentNode.removeChild(item);
    }
}

let usedKeys = [];
let score = 0;

function fetchWordsData() {
    fetch('./easy.json')
        .then((response) => response.json())
        .then((data) => {
            const keys = Object.keys(data).filter(key => !usedKeys.includes(key)); // Filter out used keys
            if (keys.length === 0) {
                console.log('All keys have been used.');
                return;
            }
            const selectedWord = keys[Math.floor(Math.random() * keys.length)];
            const wordAna = data[selectedWord];
            usedKeys.push(selectedWord);
            console.log(selectedWord);
            console.log(wordAna);
            splitStringAndCreateElements(selectedWord, document.getElementById('sort-group-2'));

            // Add event listener after data is fetched
            document.getElementById('submitBtn').addEventListener('click', () => {
                checkAnagram(wordAna);
            });

        })
        .catch((error) => {
            console.error('Error fetching JSON:', error);
        });
}

fetchWordsData();

function splitStringAndCreateElements(str, parentElement) {
    const letters = str.split('');

    letters.forEach((letter) => {
        const letterElement = document.createElement('li');
        letterElement.textContent = letter;

        parentElement.appendChild(letterElement);
    });
}
const correctWordArray = [];

function checkAnagram(anagram) {
    const answerBoxText = document.getElementById('sort-group-1').textContent;

    // Filter out words that are already in correctWordArray
    const filteredAnagrams = anagram.filter(word => !correctWordArray.includes(word));

    filteredAnagrams.forEach(word => {
        if (word === answerBoxText) {
            console.log('Correct!');
            correctWordArray.push(word);
            console.log(correctWordArray);
            score++;
        } else {
            console.log('Incorrect!');
        }
    });
}


let clearBtn = document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('sort-group-1').textContent = ''
})
