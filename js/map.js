function fetchFlights() {
    getApiUrls().then(function(urls) {
        const globalUrl = urls.Flights.Global;

        $.ajax({
            url: globalUrl,
            method: 'GET',
            timeout: 500,
            success: function(data) {
                console.log(data);
                displayFlights(data);
            },
            error: function(jqXHR, textStatus) {
                console.log('Ошибка сети: ' + textStatus);
                fetchFlightsLocal();
            }
        });
    }).catch(function(error) {
        console.log("Ошибка " + error);
        fetchFlightsLocal();
    });
}

function fetchFlightsLocal() {
    getApiUrls().then(function(urls) {
        const localUrl = urls.Flights.Local;

        $.ajax({
            url: localUrl,
            method: 'GET',
            success: function(data) {
                displayFlights(data);
            },
            error: function(jqXHR, textStatus) {
                console.log("Ошибка: " + textStatus);
            }
        });
    }).catch(function(error) {
        console.log("Ошибка: " + error);
    });
}


ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
      center: [55.280689, 86.120385],
      zoom: 12,
      type: 'yandex#hybrid',
      controls: ['zoomControl']
    });


  });