var apiKey = 'YOUR_API_KEY';
var unit = "metric";

function onLoad() {

  var input = document.getElementById('search-input');
  input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      document.getElementById('search-btn').click();
    }
  });

  var btn = document.getElementById('search-btn');
  btn.addEventListener('click', function() {
    inputCheck(input.value);
  });

  var geo = document.getElementById('geo-btn');
  geo.addEventListener('click', function() {
    getApiLocation();
  })


}

/**
 * Analize the given input text, if it's a 5 digit string run a ZIP research,
 * otherwise run research by city name.
 * @param {string} inputText input text given by input form.
 */
function inputCheck(inputText) {
  if (inputText == parseInt(inputText) && inputText.length == 5) {
    getApiText('zip', inputText);
  } else {
    getApiText('q', inputText);
  }

}


/**
 * Open an XMLHttpRequest with OpenWeatherMap API using city name or city ZIP.
 * XMLHttpRequest return a json file.
 * Without error runs analizeData(weather)
 * With error runs attachError("City or ZIP Code not found, try again")
 *
 * @param {q or ZIP} searchType type of search, by city ('q') or by ZIP Code ('zip')
 * @param {string} inputText Input text string, city name or zip code.
 */

function getApiText(searchType, inputText) {
  var requestURL = `https://api.openweathermap.org/data/2.5/forecast?${searchType}=${inputText}&APPID=08874f09563464fbad6669d17899a3e4&units=${unit}`;
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      var weather = request.response;
      var ret = analizeData(weather);
    } else if (request.status === 400 || request.status === 404) {
      var ret = attachError("City or ZIP Code not found, try again");
    }

  }
  request.send();

}

/**
 * Function to analize datas returned by XMLHttpRequest.
 * @param {XMLHttpRequest.response.json} weather Weather information
 */

function analizeData(weather) {
  var resultDiv = document.getElementById('result');
  var input = document.getElementById('search-input');
  input.value = "";
  var cards = document.getElementsByClassName('card');

  //First clean up previous result
  for (var card of cards) {
    while (card.firstChild) {
      card.removeChild(card.firstChild);
    }
  }
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }

  //Append city name and country above carousel
  var h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode(weather.city.name + ', ' + weather.city.country));
  resultDiv.appendChild(h1);

  //Name all carousel's cards with namedays.
  var days = document.getElementsByClassName('day');
  days[0].innerHTML = "Today";
  for (var i = 1; i < days.length; i++) {
    var asd = new Date().getDay();
    var parsedDay = parseInt(asd);
    parsedDay = parsedDay + i;
    days[i].innerHTML = numberToNameDay(parsedDay);
  }


  //Fill the first card with the day remaining information.
  var dayS = "nmde";
  var dt_hour = weather.list[0].dt_txt.slice(11, 13); //Take the first hour information
  var letter = daySection(dt_hour);
  var card1 = cards[0];
  var daySec = daySectionToName(letter);

  var m = 0;
  for (var i = dayS.indexOf(letter); i<dayS.length; i++) {
    var weatherSection = weather.list[m];
    var div = document.createElement('div');
    div.className = '' + daySectionToName(dayS.charAt(i));

    var divIcon = document.createElement('div');
    divIcon.className = 'icon';

    var icon = document.createElement('img');
    icon.src = 'http://openweathermap.org/img/wn/'+weatherSection.weather[0].icon+'@2x.png';

    divIcon.appendChild(icon);
    div.appendChild(divIcon);
    card1.appendChild(div);

    var divText = document.createElement('div');
    divText.className = 'text';

    var divTitle = document.createElement('div');
    divTitle.className = 'title';

    var divTitleContent = document.createElement('h2');
    divTitleContent.innerHTML = daySectionToName(dayS.charAt(i));

    divTitle.appendChild(divTitleContent);
    divText.appendChild(divTitle);
    div.appendChild(divText);

    var divDescription = document.createElement('div');
    divDescription.className = 'description';

    var par1 = document.createElement('p');
    par1.innerHTML = weatherSection.main.temp + '°C';
    var par2 = document.createElement('p');
    par2.innerHTML = weatherSection.weather[0].description;
    var par3 = document.createElement('p');
    par3.innerHTML = 'Humidity: ' + weatherSection.main.humidity + '%';

    divDescription.appendChild(par1);
    divDescription.appendChild(par2);
    divDescription.appendChild(par3);
    divText.appendChild(divDescription);

    m = m+2;
  }

  //Find the beginning of the next day.
  for (var i = 1; i<weather.list.length; i++) {
    if(weather.list[i].dt_txt.slice(11, 13)==0) {
      m=i;
      break;
    }
  }

  //Fill the remaining 4 cards with full day informations.
  for (var i = 1; i < 5; i++) {
    for (var char of dayS) {
      var weatherSection = weather.list[m];
      var div = document.createElement('div');
      div.className = '' + daySectionToName(char);

      var divIcon = document.createElement('div');
      divIcon.className = 'icon';

      var icon = document.createElement('img');
      icon.src = 'http://openweathermap.org/img/wn/'+weatherSection.weather[0].icon+'@2x.png';

      divIcon.appendChild(icon);
      div.appendChild(divIcon);
      cards[i].appendChild(div);

      var divText = document.createElement('div');
      divText.className = 'text';

      var divTitle = document.createElement('div');
      divTitle.className = 'title';

      var divTitleContent = document.createElement('h2');
      divTitleContent.innerHTML = daySectionToName(char);

      divTitle.appendChild(divTitleContent);
      divText.appendChild(divTitle);
      div.appendChild(divText);

      var divDescription = document.createElement('div');
      divDescription.className = 'description';

      var par1 = document.createElement('p');
      par1.innerHTML = weatherSection.main.temp + '°C';
      var par2 = document.createElement('p');
      par2.innerHTML = weatherSection.weather[0].description;
      var par3 = document.createElement('p');
      par3.innerHTML = 'Humidity: ' + weatherSection.main.humidity + '%';

      divDescription.appendChild(par1);
      divDescription.appendChild(par2);
      divDescription.appendChild(par3);
      divText.appendChild(divDescription);

      m = m+2;
    }
  }


}


/**
 * Print under the search input text the error.
 * Before that clean up the previous search of all cards in the carousel.
 *
 * @param {string} textError String containing the error message.
 */
function attachError(textError) {
  var resultDiv = document.getElementById('result');
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }
  var cards = document.getElementsByClassName('card');
  for (var card of cards) {
    while (card.firstChild) {
      card.removeChild(card.firstChild);
    }
  }
  var h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode(textError));

  var days = document.getElementsByClassName('day');
  days[0].innerHTML = "Waiting for a Search...";

  resultDiv.appendChild(h1);
}


/**
 * Get user current position (lat and lon) and pass it to showPosition().
 */
function getApiLocation() {
  var x = document.getElementById('result');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

/**
 * Open an XMLHttpRequest with OpenWeatherMap API using lat e lon taken by getApiLocation().
 * XMLHttpRequest return a json file.
 * Without error runs analizeData(weather)
 * With error runs attachError("City or ZIP Code not found, try again")
 *
 * @param position User current position.
 */
function showPosition(position) {
  console.log("ciaociao");
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=08874f09563464fbad6669d17899a3e4&units=${unit}`;
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      var weather = request.response;
      analizeData(weather);
    } else if (request.status === 400 || request.status === 404) {
      var ret = attachError("City or ZIP Code not found, try again");
    }

  }
  request.send();
}


/**
 * Divide a day in 4 section:
 * 00:00 - 05:59 : Night time ('n')
 * 06:00 - 11:59 : Morning time ('m')
 * 12:00 - 17:59 : Day time ('d')
 * 18:00 - 23:59 : Evening time ('e')
 *
 * @return Given an hour return the day section letter.
 */
function daySection(hour) {

  var floor = Math.floor(hour/ 6.0) * 6;
  switch (floor) {
    case 0:
      return 'n';
      break;
    case 6:
      return 'm';
      break;
    case 12:
      return 'd';
      break;
    case 18:
      return 'e';
      break;
    default:
      return 'n';
      break;
  }
}

/**
 *  Transform the daySection letter into the day section name, used to create
 *  class in HTML.
 *  @param {daySection} letter letter return by daySection
 *  @return {string} day section name.
 */
function daySectionToName(letter) {
  switch (letter) {
    case 'n':
      return 'night';
      break;
    case 'm':
      return 'morning';
      break;
    case 'd':
      return 'day';
      break;
    case 'e':
      return 'evening';
      break;
    default:
      return 'night';
  }
}

/**
 * @param {integer} number integer number
 * @return {string} Given a number, return the corresponding day name.
 */
function numberToNameDay(number) {
  if(number>6) number = number - 7;
  switch (number) {
    case 0:
      return "Sunday";
      break;
    case 1:
      return "Monday";
      break;
    case 2:
      return "Tuesday";
      break;
    case 3:
      return "Wednesday";
      break;
    case 4:
      return "Thursday";
      break;
    case 5:
      return "Friday";
      break;
    case 6:
      return "Saturday";
      break;
    default:
      return 'asdawd';
  }
}

var x = window.matchMedia("(min-width: 992px)")
myFunction(x) // Call listener function at run time
x.addListener(myFunction) // Attach listener function on state changes

function myFunction(x) {
  if (x.matches) { // If media query matches
    var carousel = document.getElementById('carousel');
    carousel.removeAttribute('data-flickity-options');
  }
}
