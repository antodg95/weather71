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


}

function inputCheck(inputText) {
  if (inputText == parseInt(inputText) && inputText.length == 5) {
    getApi('zip', inputText);
  } else {
    getApi('q', inputText);
  }

}

function getApi(searchType, inputText) {
  //console.log(`https://api.openweathermap.org/data/2.5/weather?${searchType}=${inputText}&APPID=08874f09563464fbad6669d17899a3e4`);
  var requestURL = `https://api.openweathermap.org/data/2.5/weather?${searchType}=${inputText}&APPID=08874f09563464fbad6669d17899a3e4&units=${unit}`;
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      var projects = request.response;
      var ret = analizeData(projects);
    } else if (request.status === 400 || request.status === 404) {
      var ret = attachError("City or ZIP Code not found, try again");
    }

  }
  request.send();

}

function analizeData(projects) {
  var resultDiv = document.getElementById('result');
  var br = document.createElement('br');
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }
  var h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode(projects.name + ', ' + projects.sys.country));

  var h2 = document.createElement('h2');
  h2.appendChild(document.createTextNode('Weather: ' + projects.weather[0].description));

  var h3 = document.createElement('h3');
  h3.appendChild(document.createTextNode('Temperature: ' + projects.main.temp + '°C'));
  h3.appendChild(br);

  var h4 = document.createElement('h4');
  h3.appendChild(document.createTextNode('Min. Temperature: ' + projects.main.temp_min + '°C'));
  h4.appendChild(br);

  var h5 = document.createElement('h4');
  h3.appendChild(document.createTextNode('Max. Temperature: ' + projects.main.temp_max + '°C'));
  h5.appendChild(br);

  resultDiv.appendChild(h1);
  resultDiv.appendChild(h2);
  resultDiv.appendChild(h3);
  resultDiv.appendChild(h4);
  resultDiv.appendChild(h5);
}

function attachError(textError) {
  var resultDiv = document.getElementById('result');
  while (resultDiv.firstChild) {
    resultDiv.removeChild(resultDiv.firstChild);
  }
  var h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode(textError));

  resultDiv.appendChild(h1);
}
