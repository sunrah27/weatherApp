document.addEventListener('DOMContentLoaded', () => {
    // console.log(checkWeather('London'));
    createGrid();
    readLocalStorage();
    // addEventListeners();
});

function createGrid() {
    const columns = Math.floor(window.innerWidth / 220);
    const rows2 = window.innerHeight - 100;
    const rows = Math.floor(rows2 / 220);

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

function updateWeatherCard(apiData) {
    const city = apiData.location.name;
    const country = apiData.location.country;
    const callTime = apiData.location.localtime;
    const updateTime = apiData.current.last_updated;
    const temp_c = apiData.current.temp_c;
    const temp_f = apiData.current.temp_f;
    const windDeg = apiData.current.wind_degree;
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
    const humidity = apiData.current.humidity;
    const cloud = apiData.current.cloud;
    const feelslike_c = apiData.current.feelslike_c;
    const feelslike_f = apiData.current.feelslike_f;
    const vis_km = apiData.current.vis_km;
    const vis_miles = apiData.current.vis_miles;
    const uv = apiData.current.uc;
    const gust_mph = apiData.current.gust_mph;
    const gust_kph = apiData.current.gust_kph;
}

// keep this code
// searchBtn.addEventListener('click', (event) =>{
//     event.preventDefault();
//     checkWeather(searchBox.value);
// });

function readLocalStorage() {
    const data = JSON.parse(localStorage.getItem('cards')) || [];

    if(data.length > 0){
        data.forEach(cardData => {
            createCard(cardData.position, cardData.size);
        });
    }
    checkGridDropZoneValidity(pos, size);
};

function createCard(pos, size) {
    const card = document.createElement('div');
    card.classList.add('card', size);
    card.setAttribute('draggable', 'true');
    card.innerHTML = '<h2>Card Title</h2>';
    document.getElementById(`${pos}`).appendChild(card);
}

function checkGridDropZoneValidity(pos, size) {
    // funciton checks every tile and adds or removes drop-zone class
    // check if grid-items.innerHTML = ''; and add class drop-zone 

    // remove class drop-zone from any card positions
    gridItemsNoDrop(pos, size);
}

function gridItemsNoDrop(pos, size) {
    const tileOrigin = document.getElementById(`${pos}`);
    let tileOriginX;
    let tileOriginY;
    let tileOriginXY;
    
    var idStr = pos;
    var [x, y] = idStr.split('-').map(Number);

    switch (size) {
        case `large`:
            tileOrigin.classList.remove('drop-zone');
            tileOriginX = document.getElementById(`${x+1}-${y}`);
            tileOriginX.classList.remove('drop-zone');
            tileOriginY = document.getElementById(`${x}-${y+1}`);
            tileOriginY.classList.remove('drop-zone');
            tileOriginXY = document.getElementById(`${x+1}-${y+1}`);
            tileOriginXY.classList.remove('drop-zone');
            break;
        case `mediumY`:
            tileOrigin.classList.remove('drop-zone');
            tileOriginX = document.getElementById(`${x+1}-${y}`);
            tileOriginX.classList.remove('drop-zone');
            break;
        case `mediumX`:
            tileOrigin.classList.remove('drop-zone');
            tileOriginY = document.getElementById(`${x}-${y+1}`);
            tileOriginY.classList.remove('drop-zone');
            break;
        case `small`:
            tileOrigin.classList.remove('drop-zone');
            break;
        default:
            console.error('Card does not have a valid size');
    }
}

function gridItemNoDropEdge (size) {
    const columns = Math.floor(window.innerWidth / 220);
    const rows2 = window.innerHeight - 100;
    const rows = Math.floor(rows2 / 220);

    let gridItem;

    for (let y = 1; y <= rows; y++ ) {
        console.log(`${columns}-${y}`);
        gridItem = document.getElementById(`${columns}-${y}`);
        gridItem.classList.remove('drop-zone');
    }

    for (let x = 1; x < columns; x++ ) {
        console.log(`${x}-${rows}`);
        gridItem = document.getElementById(`${x}-${rows}`);
        gridItem.classList.remove('drop-zone');
    }
}

function addEventListeners() {  // need to rewrite this function to handle all drag and drop events.
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData("text/html", event.target.outerHTML);
        })
    })
}

// dragstart    -> This should be part of the eventListner
// drag         -> It is fired continuously as the element is dragged. Use it for real-time updates
// dragenter    -> Triggered when the dragged element enters a valid drop target. This event is often used to provide visual feedback that the drop target is valid.
// dragover     -> Triggered continuously as the dragged element is over a valid drop target. In this event, you prevent the default behavior to allow a drop.
// dragleave    -> Triggered when the dragged element leaves a valid drop target. This event is often used to remove any visual feedback that was applied during the dragenter event.
// drop         -> Triggered when the dragged element is dropped on a valid drop target. In this event, you access the transferred data and handle the drop.
// dragend      -> Triggered when the drag operation is completed (element dropped or cancelled). Cleanup or additional actions can be performed in this event.

// function hideGridItems() {
//     const gridItems = Array.from(document.getElementsByClassName('grid-items'));
//     console.log(gridItems);
//     let tiles = 0;
//     gridItems.forEach((item) => {
//         if (item.classList.contains('large')) {
//             tiles += 3;
//         } else if (item.classList.contains('mediumX'||'mediumY')) {
//             tiles += 1;
//         } else if (item.classList.contains('small')) {
//             tiles++;
//         }
//     })
// }