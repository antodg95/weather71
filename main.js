var apiKey = '08874f09563464fbad6669d17899a3e4';
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

function inputCheck(inputText) {
  if (inputText == parseInt(inputText) && inputText.length == 5) {
    getApiText('zip', inputText);
  } else {
    getApiText('q', inputText);
  }

}

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

function analizeData(weather) {
  var resultDiv = document.getElementById('result');
  var input = document.getElementById('search-input');
  input.value = "";
  var cards = document.getElementsByClassName('card');
  for (var card of cards) {
    while (card.firstChild) {
      card.removeChild(card.firstChild);
    }
  }
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }

  var h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode(weather.city.name + ', ' + weather.city.country));
  resultDiv.appendChild(h1);

  var days = document.getElementsByClassName('day');
  days[0].innerHTML = "Today";
  for (var i = 1; i < days.length; i++) {
    var asd = new Date().getDay();
    var parsedDay = parseInt(asd);
    parsedDay = parsedDay + i;
    days[i].innerHTML = numberToNameDay(parsedDay);
  }

  var dayS = "nmde";

  var dt_hour = weather.list[0].dt_txt.slice(11, 13);
  var letter = daySection(dt_hour);
  var card1 = cards[0];
  var daySec = daySectionToName(letter);

  var m = 0;
  for (var i = dayS.indexOf(letter); i<dayS.length; i++) {
    var weatherSection = weather.list[m];
    var div = document.createElement('div');
    div.className = '' + daySectionToName(daySection(dayS.charAt(i)));

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
    divTitleContent.innerHTML = daySectionToName(daySection(dayS.charAt(i)));

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

  for (var i = 1; i<weather.list.length; i++) {
    if(weather.list[i].dt_txt.slice(11, 13)==0) {
      m=i;
      break;
    }
  }

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

function getApiLocation() {
  var x = document.getElementById('result');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
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

function daySection(letter) {

  var floor = Math.floor(21 / 6.0) * 6;
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

function numberToNameDay(number) {
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
