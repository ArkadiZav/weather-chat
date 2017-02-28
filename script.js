var source = $('#weatherchat-template').html();
var template = Handlebars.compile(source);

var cities = [];

var fetch = function (cityName) {
$.ajax({
  method: "GET",
  url: 'http://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid=d703871f861842b79c60988ccf3b17ec',
  dataType: "json",
  success: function(data) {
    //console.log(data);
    addCity(data);
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
  }
});
};

var clickHandler = function () {
  var cityName = $("#city-name").val();
  fetch(cityName);
}

// helper function to get time and date
var makeDateAndTime = function () {
  var d = new Date();
  var today;
  var hours;
  var minutes;
  var dd = d.getDate();
  var mm = d.getMonth() + 1;
  var yyyy = d.getFullYear();
  var timeObj; // and object to be returned that will contain all time information

  if (d.getMinutes().toString() == 1) {
    minutes = '0' + d.getMinutes();
  }
  else {
    minutes = d.getMinutes();
  }
  if (d.getHours().toString() == 1) {
    hours = '0' + d.getHours();
  }
  else {
    hours = d.getHours();
  }

  if (dd < 10) {
    dd = '0'+ dd;
  }
  if(mm < 10){
      mm = '0'+ mm;
  }
  var today = dd + '/' + mm + '/' + yyyy;

  timeObj = {today: today,
            hours: hours,
            minutes: minutes};

  return timeObj;
}

// what happens when you click on a certain "Comment" button
$('.view-city-weather').on('click', '.add-comment', function () {
  var text = $(this).parent().siblings('.comment-name').val();
  var cityIndex = $(this).parent().closest('.city').index();
  createComment(text, cityIndex);
  showComments();
})

var createCity = function (name, hours, minutes, date, farenheit, celsius) {
  cities.push({name: name, hours: hours, minutes: minutes, date: date, farenheit: farenheit, celsius: celsius, comments: []});
}

var createComment = function (text, citiesIndex) {
  var comment = { text: text };
  cities[citiesIndex].comments.push(comment);
};

// parameter is data received from weather API
var addCity = function(data) {
  var timeInfo = makeDateAndTime();
  var celsius = Math.round(data.main.temp - 273.15);
  var farenheit = Math.round(data.main.temp * 9/5 - 459.67);
  var name = (data.name).toUpperCase();
  var hours = timeInfo.hours;
  var minutes = timeInfo.minutes;
  var date = timeInfo.today;

  createCity(name, hours, minutes, date, farenheit, celsius, timeInfo);
  showCities();
  showComments();
}

var removeCity = function (currentCity) {
  var $clickedCity = $(currentCity).closest('.city');
  var index = $clickedCity.index();

  cities.splice(index, 1);
  $clickedCity.remove();
};

$('.view-city-weather').on('click', '.remove-city', function () {
  removeCity(this);
});

var showCities = function () {
  $(".view-city-weather").empty();
  for (var i = 0; i < cities.length; i++) {
    var cityData = template({hours: cities[i].hours, minutes: cities[i].minutes, date: cities[i].date, name: cities[i].name, celsius: cities[i].celsius, farenheit: cities[i].farenheit});
    $(".view-city-weather").append(cityData);
  }
}

var showComments = function () {
  $('.comments-list').empty();
  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];
    var $city = $(".view-city-weather").find('.city').eq(i);
    for (var j = 0; j < city.comments.length; j++) {
      var comment = city.comments[j];
      $city.find('.comments-list').append(
        '<div class="comment">' + comment.text + '</div>');
    }
  }
}
