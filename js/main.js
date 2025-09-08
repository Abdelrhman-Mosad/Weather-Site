const defLocation = 'cairo'

const todayCardElmId = document.getElementById('today_wp');
const weatherCardWp = todayCardElmId.parentElement;
const searchBtnElm = document.getElementById('searchBtn');
const searchInputElm = document.getElementById('searchInput');
const errorMsgElm = document.getElementById('ErrorMSgLoc');

// used to validate the search input
const inputRegex = /^[a-zA-Z]{3,}$/

let globalDate = new Date();


/**************** Load event **************** */
window.addEventListener('load', function(){
    getWetherInfo().then(function(res){
        updateWeather(res);
    });

    displayDate();
})


/**************** click event (for search) **************** */
searchBtnElm.addEventListener('click', function(){
    let inValue = searchInputElm.value ;

    activateDeactFailedState(false);
    if (inputRegex.test(inValue))
    {
        getWetherInfo(inValue).then(function(res){
            if(res){
                updateWeather(res , inValue);
            }
            else
            {
                activateDeactFailedState(true);
            }
        });
    }
    else
    {
        activateDeactFailedState(true);
    }
})



/* Get data from server */
async function getWetherInfo(loc='cairo'){

    let data,errorMsg ;
    await fetch(`https://api.weatherapi.com/v1/forecast.json?key=d689c2be63b34323bfd114303250409&q=${loc}&days=3`)
    .then(function(respond){
        if((respond.status >= 200) && (respond.status<300)){
            return respond.json();
        }
        else {
            return "error";
        }
    })
    .then(function(dataParsed){
        if(dataParsed != "error"){
            data = dataParsed.forecast.forecastday ;
        }
        else{
            
        }
    })

    return data ;
}


/* Update html with new weather data*/
function updateWeather(wethData , loc='cairo'){
    let idx = globalDate.getHours();
    /* Today card */
    todayCardElmId.querySelectorAll('p')[0].innerText = loc;
    todayCardElmId.querySelectorAll('p')[1].innerText = wethData[0].hour[idx].temp_c + '°C';
    todayCardElmId.querySelectorAll('p')[2].innerText = wethData[0].day.condition.text;
    todayCardElmId.querySelector('img').setAttribute('src' , ('https://'+wethData[0].day.condition.icon) );

    todayCardElmId.querySelectorAll('ul li span')[0].innerText = wethData[0].hour[idx].chance_of_rain +'%';
    todayCardElmId.querySelectorAll('ul li span')[1].innerText = wethData[0].hour[idx].vis_km +'km/s';
    todayCardElmId.querySelectorAll('ul li span')[2].innerText = wethData[0].hour[idx].humidity +'%';


    /* Rest of cards */
    for(let i = 1 ; i< 3; i++){
        weatherCardWp.children[i].querySelector('img').setAttribute('src' , ('https://'+wethData[i].day.condition.icon) );
        weatherCardWp.children[i].querySelectorAll('p')[0].innerText = wethData[i].day.maxtemp_c + '°C';
        weatherCardWp.children[i].querySelectorAll('p')[1].innerText = wethData[i].day.mintemp_c + '°C';
        weatherCardWp.children[i].querySelectorAll('p')[2].innerText = wethData[i].day.condition.text ;
    }
}



/* Update headers of card with dates*/
function displayDate(){
    let currentDate = new Date();
    let formattedDay = new Intl.DateTimeFormat('en-US', {
    weekday: 'long'
    }).format(currentDate);

    let formattedMonth = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long'
    }).format(currentDate);

    todayCardElmId.querySelectorAll('.card_header span')[0].innerText = formattedDay;
    todayCardElmId.querySelectorAll('.card_header span')[1].innerText = formattedMonth;


    // Get next day
    currentDate.setDate( currentDate.getDate() + 1);

    formattedDay = new Intl.DateTimeFormat('en-US', {
    weekday: 'long'
    }).format(currentDate);
    weatherCardWp.querySelectorAll('.card_header span')[2].innerText = formattedDay;


    // Get next day
    currentDate.setDate( currentDate.getDate()+1);

    formattedDay = new Intl.DateTimeFormat('en-US', {
    weekday: 'long'
    }).format(currentDate);
    weatherCardWp.querySelectorAll('.card_header span')[3].innerText =  formattedDay;
}



// change state : (of search bar status) 
function activateDeactFailedState(state){
    if(state){
        
        searchInputElm.classList.add('is-invalid');
        errorMsgElm.classList.remove('d-none');
    }
    else{
        searchInputElm.classList.remove('is-invalid');
        errorMsgElm.classList.add('d-none');
    }
}
