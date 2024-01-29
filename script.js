document.addEventListener('DOMContentLoaded', () => {
    // console.log(checkWeather('London'));
    createGrid();
    createCards();
    checkGridDropZoneValidity();
    addEventListeners();
});

// function reads local browser storage
function readLocalStorage() {
    return JSON.parse(localStorage.getItem('cards')) || [];
};

// Function to update the card position in local storage
function saveCardPosition() {
    const cards = document.querySelectorAll('.card');
    localStorage.clear('cards');
    const storeCards = readLocalStorage();

    cards.forEach(card => {
        const position = card.id;
        const sizeClasses = Array.from(card.classList).filter(cls => cls !== 'card');
        storeCards.push({position: position, size: sizeClasses[0]});
    })
    localStorage.setItem('cards', JSON.stringify(storeCards));
}

// function to create a grid based on the browser size
function createGrid() {
    const columns = Math.floor(window.innerWidth / 220); // 220 is 200px + 20px gap
    const rows2 = window.innerHeight - 100; // 100 is the height of nev
    const rows = Math.floor(rows2 / 220);

    //generate grid-item
    const gridContainer = document.getElementById('gridContainer');
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= columns; j++ ) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-items','drop-zone');
            gridItem.id = `${j}-${i}`;
            gridContainer.appendChild(gridItem);
        }
    }
}

// function to generate cards based on the local storage
function createCards() {
    // Get data from local storage
    const data = readLocalStorage();
    if(data.length > 0){
        data.forEach(cardData => {
            const card = document.createElement('div');
            card.classList.add('card', cardData.size);
            card.setAttribute('draggable', 'true');
            card.id = cardData.position;
            card.innerHTML = '<h2>Card Title</h2>'; // place holder for weather data
            document.getElementById(`${cardData.position}`).appendChild(card);
        });
    }
}

function removeCard(pos) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = pos;

    const id = tempElement.firstChild.id;
    const gridItem = document.getElementById(id);
    gridItem.innerHTML = '';
    return;
}

// funciton checks every tile and adds or removes drop-zone class
function checkGridDropZoneValidity() {
    // check if grid-items.innerHTML = ''; and add class drop-zone 
    const gridItems = document.getElementsByClassName('grid-items');
    const data = readLocalStorage();

    // create an awway using the id of grid-items
    const gridItemsArray = [];
    for (let i = 0; i < gridItems.length; i++) {
        const element = gridItems[i];
        const id = element.id;
        gridItemsArray.push(id);
    }

    // remove drop-zone class from card positions
    const notDropZone = data.map(item => gridItemsNoDrop(item.position, item.size)); // returns an object with array of positions drop-zone was removed
    const notDropZoneArray = Object.values(notDropZone).flat(); // flatten the object into one array

    // calculate grid-items that should have drop-zone position
    const dropZoneArray = gridItemsArray.filter(itemA => !notDropZoneArray.includes(itemA));
    addDropZones(dropZoneArray);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// need to rewrite this function to check every tile and apply the relevant styles when dragging card
// function to check which zones items not valid for card drop
function gridItemsNoDrop(pos, size) {
    const removedElements = []; // create an array to store the position of grid-items that had 'drop-zone' class removed
    const tileOrigin = document.getElementById(`${pos}`); // origin tile is the topleft tile the card sits on and is also the cards position
    
    removedElements.push(`${pos}`); // saving the position of the grid-item that will have drop-zone class removed in the array
    tileOrigin.classList.remove('drop-zone');
    tileOrigin.classList.add('not-drop-zone');

    let tileOriginX, tileOriginY, tileOriginXY;

    // convert pos from string to x and y values
    const idStr = pos;
    const [x, y] = idStr.split('-').map(Number);

    // check card size and remove class drop-zone from the tiles the cards occupy also save tile position into array
    if (size === 'large' || size === 'mediumY') {
        tileOriginX = document.getElementById(`${x + 1}-${y}`);
        removedElements.push(`${x + 1}-${y}`);
        tileOriginX.classList.remove('drop-zone');
        tileOriginX.classList.add('not-drop-zone');
    }

    if (size === 'large' || size === 'mediumX') {
        tileOriginY = document.getElementById(`${x}-${y + 1}`);
        removedElements.push(`${x}-${y + 1}`);
        tileOriginY.classList.remove('drop-zone');
        tileOriginY.classList.add('not-drop-zone');
    }

    if (size === 'large') {
        tileOriginXY = document.getElementById(`${x + 1}-${y + 1}`);
        removedElements.push(`${x + 1}-${y + 1}`);
        tileOriginXY.classList.remove('drop-zone');
        tileOriginXY.classList.add('not-drop-zone');
    }

    if (size !== 'large' && size !== 'mediumY' && size !== 'mediumX' && size !== 'small') {
        console.error('Card does not have a valid size' + size);
    }

    // return the array of tile positions with drop-zone class removed
    return removedElements;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
// function only called when cards are being dragged. Checks edge column and row for valid drop-zone
function gridItemNoDropEdge(size) {
    const columns = Math.floor(window.innerWidth / 220);
    const rows2 = window.innerHeight - 100;
    const rows = Math.floor(rows2 / 220);

    if (size === 'large' || size === 'mediumY') {
        removeLastColumn(columns, rows);
    }

    if (size === 'large' || size === 'mediumX') {
        removeLastRow(columns, rows);
    }

    if (size !== 'large' && size !== 'mediumY' && size !== 'mediumX' && size !== 'small') {
        console.error('Could not retrieve card size: ' + size);
    }

    function removeLastColumn(columns, rows) {
        for (let y = 1; y <= rows; y++) {
            const gridItem = document.getElementById(`${columns}-${y}`);
            if (gridItem) {
                gridItem.classList.remove('drop-zone');
                gridItem.classList.add('not-drop-zone');
            }
        }
    }

    function removeLastRow(columns, rows) {
        for (let x = 1; x <= columns; x++) {
            const gridItem = document.getElementById(`${x}-${rows}`);
            if (gridItem) {
                gridItem.classList.remove('drop-zone');
                gridItem.classList.add('not-drop-zone');
            }
        }
    }
}

// function adds drop-zone to grid-items
function addDropZones(positions) {
    positions.forEach(id => {
        const element = document.getElementById(id);
        element.classList.add('drop-zone');
        element.classList.remove('not-drop-zone');
    })
}

// function to handle drag and drop events
function handleDragStart(event, card) {
    event.dataTransfer.setData("text/html", card.outerHTML);
    const sizeClass = getSizeClass(card.classList);
    gridItemNoDropEdge(sizeClass);
    styleGridItems(`1`);
}

// Function to handle drag end
function handleDragEnd() {
    addEventListeners();
    styleGridItems(`0`);
    checkGridDropZoneValidity();
}

// Function to prevent default behavior for dragover and dragenter events
function preventDefault(event) {
    event.preventDefault();
}

// Function to handle drop event
function handleDrop(event) {
    event.preventDefault();
    const isDropZone = event.target.classList.contains('valid');
    if (isDropZone) {
        const draggedCardHTML = event.dataTransfer.getData("text/html");
        const newGridItemId = event.target.id;
        event.target.innerHTML = draggedCardHTML;
        const draggedCard = event.target.querySelector('.card');
        if (draggedCard) {
            draggedCard.id = newGridItemId;
        }
        removeCard(draggedCardHTML);
        saveCardPosition();
    }
}

// Function to add drag and drop event listeners to cards
function addCardEventListeners(card) {
    card.addEventListener('dragstart', (event) => handleDragStart(event, card));
    card.addEventListener('dragend', handleDragEnd);
}

// Function to add drag and drop event listeners to drop zones
function addDropZoneEventListeners(dropZone) {
    dropZone.addEventListener('dragover', preventDefault);
    dropZone.addEventListener('dragenter', preventDefault);
    dropZone.addEventListener('drop', handleDrop);
}

// Main function to add all event listeners
function addEventListeners() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(addCardEventListeners);
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(addDropZoneEventListeners);
}

function styleGridItems(num) {
    if(num == 1) {
        addStyleClass();
    }
    if (num == 0) {
        removeStyleClass();
    }
}

function addStyleClass(){
    const validClass = document.querySelectorAll('.drop-zone');
    const invalidClass = document.querySelectorAll('.not-drop-zone');

    validClass.forEach(cls =>{
        cls.classList.add('valid');
    })
    invalidClass.forEach(cls => {
        cls.classList.add('invalid');
    })
}

function removeStyleClass() {
    const validClass = document.querySelectorAll('.valid');
    const invalidClass = document.querySelectorAll('.invalid');

    validClass.forEach(cls =>{
        cls.classList.remove('valid');
    })
    invalidClass.forEach(cls => {
        cls.classList.remove('invalid');
    })
}

function getSizeClass(cardClassList) {
    // Loop through the classList and find the size class
    const sizeClasses = ['large', 'mediumX', 'mediumY', 'small'];
    for (const sizeClass of sizeClasses) {
        if (cardClassList.contains(sizeClass)) {
            return sizeClass;
        }
    }
    // Default to 'unknown' if no size class is found
    return console.error('Card size missing :' + cardClassList);
}

// weather function
async function checkWeather(city){
    const apiURL = `http://api.weatherapi.com/v1/current.json`;
    const apiKey = `89958791f22a440ba62202448241501`;
    const aqi = `no`;
    try {
        const response = await fetch(`${apiURL}?key=${apiKey}&q=${city}&aqi=${aqi}`);
        apiData = await response.json();
        console.log(apiData);
        updateWeatherCard(apiData);
    } catch (error) {
        console.error('Error fetching API data:', error.message);
    }
}

// save api data into objects
function updateWeatherCard(apiData) {
    const city = apiData.location.name;
    const country = apiData.location.country;
    const localTime = apiData.location.localtime;
    const updateTime = apiData.current.last_updated;

    const temp_c = apiData.current.temp_c;
    const temp_f = apiData.current.temp_f;
    
    const weatherText = apiData.current.condition.text;
    const weatherIcon = `http:${apiData.current.condition.icon}`;
    
    const wind_mph = apiData.current.wind_mph;
    const wind_kph = apiData.current.wind_kph;
    
    const wind_degree = apiData.current.wind_degree;
    const wind_dir = apiData.current.wind_dir;

    const pressure_mb = apiData.current.pressure_mb;
    const pressure_in = apiData.current.pressure_in;

    const precip_mm = apiData.current.precip_mm;
    const precip_in = apiData.current.precip_in;

    const feelslike_c = apiData.current.feelslike_c;
    const feelslike_f = apiData.current.feelslike_f;

    const vis_km = apiData.current.vis_km;
    const vis_miles = apiData.current.vis_miles;

    const gust_mph = apiData.current.gust_mph;
    const gust_kph = apiData.current.gust_kph;
    
    const humidity = apiData.current.humidity;
    const cloud = apiData.current.cloud;
    const uv = apiData.current.uc;

    const searchCard = document.getElementById('searchCard');
    const searchCardHTML = '';

    searchCardHTML =`
        <h2>${city},${country}</h2><p>${localTime}</p>
        <img src="${weatherIcon}" alt="${weatherText}">
        <p>${weatherText}</p>
        <p>${temp_c}</p>
        <div></div><div>${feelslike_c}</div><div></div>
        <div>${humidity}</div>
        <div>${wind_mph}</div>
        <div>${wind_degree}</div>
    `;

    searchCard.innerHTML = searchCardHTML;

}