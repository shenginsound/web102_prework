/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(let i = 0; i<games.length; i++){
        
        // create a new div element, which will become the game card
        let gameElements = document.createElement("div")
        gameElements.textContent = games.name
         // add the class game-card to the list
        gameElements.classList.add("game-card")

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        
            gameElements.innerHTML = `
            <img class ="game-img" src="${games[i].img}" alt="${games[i].name}">
            <h2>${games[i].name}</h2>
            <p>${games[i].description}</p>
            <p>Pledged: $${games[i].pledged}</p>
            <p>Goal: $${games[i].goal}</p>
            <p>Backers: ${games[i].backers}</p>`;

        // append the game to the games-container
        gamesContainer.appendChild(gameElements);


    }
        

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
let gamesFundedBySeaMonstrer = GAMES_JSON.filter(
    (game) => game.goal <= game.pledged
);
addGamesToPage(gamesFundedBySeaMonstrer);



/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers

const totalBackers = GAMES_JSON.reduce((sum, game) => {
    return sum + game.backers;
}, 0);


// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalBackers.toLocaleString('en-US')}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaise = GAMES_JSON.reduce((money, game) => {
    return money + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaise.toLocaleString('en-US')}`;


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.length;
gamesCard.innerHTML = `${totalGames}`;




/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    // use filter() to get a list of games that have not yet met their goal
    let unfundedGameList = GAMES_JSON.filter(
        (game) => game.goal > game.pledged
    );

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGameList);

}
// filterUnfundedOnly(); => 7

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal

    let fundedGameList = GAMES_JSON.filter(
        (game) => game.goal <= game.pledged
    );

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(fundedGameList);


    // use the function we previously created to add unfunded games to the DOM

}
// filterFundedOnly(); => 4

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addAllGamesToPage(GAMES_JSON);

}
// showAllGames();

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const sumUnfundedGames = GAMES_JSON.reduce((count, game) => {
    return game.pledged < game.goal ? count + 1 : count;
}, 0);



// create a string that explains the number of unfunded games using the ternary operator
let displayUnfundedGamesNum = `"A total of $${totalRaise.toLocaleString('en-US')} 
has been raised for ${GAMES_JSON.length} games. Currently, ${sumUnfundedGames === 1 ? "1 game" : `${sumUnfundedGames} games`}
remain unfunded. We need your help to fund these amazing games !"`


// create a new DOM element containing the template string and append it to the description container
let descriptionElements = document.createElement("div");
descriptionElements.innerHTML = displayUnfundedGamesNum;
descriptionContainer.appendChild(descriptionElements);



/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...others] = sortedGames; 

// create a new element to hold the name of the top pledge game, then append it to the correct element
let firstGameElement = document.createElement("div");

firstGameElement.innerHTML = firstGame.name;

firstGameContainer.appendChild(firstGameElement);



// do the same for the runner up item
let secondGameElement = document.createElement("div");
secondGameElement.innerHTML = secondGame.name;
secondGameContainer.appendChild(secondGameElement);

/*****************************************************************************
 * Bonus Challengr: Search for a game
*/


function searchGame() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const searchResults = document.getElementById('searchResults');
    

    // clear previous results
    searchResults.innerHTML = '';

    // match results
    
    let matchedGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchInput));
    if(searchInput.length === 0){
        matchedGames = null;
    }else {
        matchedGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchInput));

    }
    
     // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
    if (matchedGames.length > 0) {
        matchedGames.forEach(game => {
            let findGameElement = document.createElement('div');
            findGameElement.classList.add("game-card");
            findGameElement.innerHTML = `
            <img class ="game-img" src="${game.img}" alt="${game.name}">
            <h2>${game.name}</h2>
            <p>${game.description}</p>
            <p>Pledged: $${game.pledged}</p>
            <p>Goal: $${game.goal}</p>
            <p>Backers: ${game.backers}</p>
            `;
            searchResults.appendChild(findGameElement);
            
        });
    } else {
        searchResults.innerText = 'No games found';
    };
};

const searchButton = document.getElementById("search");
searchButton.addEventListener("click", searchGame);






function addAllGamesToPage(games) {

    // loop over each item in the data
    for(let i = 0; i<games.length; i++){
        
        // create a new div element, which will become the game card
        let gameElements = document.createElement("div")
        gameElements.textContent = games.name
         // add the class game-card to the list
        gameElements.classList.add("game-card")

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        
            gameElements.innerHTML = `
            <img class ="game-img" src="${games[i].img}" alt="${games[i].name}">
            <h2>${games[i].name}</h2>
            <p>${games[i].description}</p>
            <p>Pledged: $${games[i].pledged}</p>
            <p>Goal: $${games[i].goal}</p>
            <p>Backers: ${games[i].backers}</p>`;

        // append the game to the games-container
        gamesContainer.appendChild(gameElements);


    }
        

}