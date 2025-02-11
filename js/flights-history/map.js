$(document).ready(function() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');
    let paramsTailNumber = params.get('number')
    
    function fetchFlights() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.FlightsHistory.Global + "/" + id;

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
            const localUrl = urls.FlightsHistory.Local + "/" + id;

            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    console.log(data);
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

    function displayFlights(flights) {    
        const $list = $('#flight-info-list');
        const $currentFlight = $('#table');
        const $currentFlightItem = $('<tr>', {
            class: 'table-row'
        })

        const currentFlightInfo = $('<td>', {
            class: 'table-data',
            text: flights.carrierCompany.name+" "+flights.plane.company.name+" "+flights.plane.name+" "+flights.plane.tailNumber
        })

        const carrierCompany = $('<li>', {
            class: 'flight-info-list-item',
            text: flights.carrierCompany.name+" "+flights.plane.company.name+" "+flights.plane.name+" "+flights.plane.tailNumber
        })

        const captain = $('<li>', {
            class: 'flight-info-list-item',
            text: "Капитан: "+flights.captain.lastName+" "+flights.captain.firstName+" "+flights.captain.middleName
        });
        const pilot = $('<li>', {
            class: 'flight-info-list-item',
            text: "Второй пилот: "+flights.pilot.lastName+" "+flights.pilot.firstName+" "+flights.pilot.middleName
        });

        const airports = $('<li>', {
            class: 'flight-info-list-item',
            text: flights.airportFrom.icao+" ("+flights.airportFrom.iata+") >> "+flights.airportTo.icao+" ("+flights.airportTo.iata+")"
        });
        const fullness = $('<li>', {
            class: 'flight-info-list-item',
            text: "Заполненность: "+flights.fullness+" чел"
        });
        let departureDateString = flights.departureDate;
        let cleanedDepartureDate = departureDateString.replace(/^(.*?)(T\d{2}:\d{2}).*$/, '$1 $2');
        cleanedDepartureDate = cleanedDepartureDate.replace('T', ' ');
        const departureDate = $('<li>', {
            class: 'flight-info-list-item',
            text: "Дата вылета: "+cleanedDepartureDate
        });
        let arrivalDateString = flights.arrivalDate;
        let cleanedArrivalDate = arrivalDateString.replace(/^(.*?)(T\d{2}:\d{2}).*$/, '$1 $2');
        cleanedArrivalDate = cleanedArrivalDate.replace('T', ' ');
        const arrivalDate = $('<li>', {
            class: 'flight-info-list-item',
            text: "Дата прилёта: "+cleanedArrivalDate
        });
        
        
        const distanceBetweenAirports = $('<li>', {
            class: 'flight-info-list-item',
            text: "Расстояние между аэропортами: "+flights.distanceBetweenAirportsKm+" км ("+flights.distanceBetweenAirportsM+" м)"
        });          

            ymaps.ready(function () {
                var myMap = new ymaps.Map('map', {
                  center: [flights.latitude, flights.longitude],
                  zoom: 7,
                  type: 'yandex#hybrid',
                  controls: ['zoomControl']
                });
            
                var airport1Mark = new ymaps.Placemark([flights.airportFrom.latitude, flights.airportFrom.longitude], {}, {
                    balloonContentHeader: flights.airportFrom.name,
                    balloonContentBody: "содержимое",
                    balloonContentFooter: "футер метки",
                    hintContent: "Точка вылета",
                    iconLayout: 'default#image',
                    iconImageHref: '/svg/airport.svg',
                    iconImageSize: [50, 60],
                    iconImageOffset: [-25, -50]
                });

                var plane = new ymaps.Placemark([flights.latitude, flights.longitude], {}, {
                    iconLayout: 'default#image',
                    iconImageHref: '/svg/airplane.svg',
                    iconImageSize: [50, 60],
                    iconImageOffset: [-25, -30]
                });

                var airport2Mark = new ymaps.Placemark([flights.airportTo.latitude, flights.airportTo.longitude], {}, {
                    balloonContentHeader: flights.airportTo.name,
                    balloonContentBody: "содержимое",
                    balloonContentFooter: "футер метки",
                    hintContent: "Точка прилета",
                    iconLayout: 'default#image',
                    iconImageHref: '/svg/airport.svg',
                    iconImageSize: [50, 60],
                    iconImageOffset: [-25, -50]
                });
            
                var flightLine1 = new ymaps.Polyline([[flights.airportFrom.latitude, flights.airportFrom.longitude],
                    [flights.latitude, flights.longitude]], {}, {
                    strokeWidth: 6,
                    strokeColor: '#59d8ff',
                    draggable: false,
                    geodesic: true
                });

                var flightLine2 = new ymaps.Polyline([[flights.airportTo.latitude, flights.airportTo.longitude],
                    [flights.latitude, flights.longitude]], {}, {
                        strokeWidth: 3,
                        strokeColor: '#fff',
                        draggable: false,
                        strokeStyle: 'shortdash',
                        geodesic: true
                });
            
                myMap.geoObjects.add(airport1Mark);
                myMap.geoObjects.add(airport2Mark);
                myMap.geoObjects.add(flightLine1);
                myMap.geoObjects.add(flightLine2);
                myMap.geoObjects.add(plane);

                plane.options.set('iconImageHref', '/svg/airplane.svg');
                airport1Mark.options.set('iconImageHref', '/svg/airport.svg');
                airport2Mark.options.set('iconImageHref', '/svg/airport.svg');

                isChecked = false;

                function movePlacemark(flights) {
                    if (plane && myMap) {
                        plane.geometry.setCoordinates([flights.latitude, flights.longitude]);
                        flightLine1.geometry.setCoordinates([[flights.airportFrom.latitude, flights.airportFrom.longitude],[flights.latitude, flights.longitude]]); 
                        flightLine2.geometry.setCoordinates([[flights.latitude, flights.longitude],[flights.airportTo.latitude, flights.airportTo.longitude]]);
                        $(document).on('click', "#center", function (event) {
                            myMap.panTo([flights.latitude, flights.longitude], {
                                duration: 1000
                            });
                        }); 
                        
                        var checkbox = document.querySelector("input[type=checkbox]");

                        checkbox.addEventListener('change', function() {
                          if (this.checked) {
                            myMap.panTo([flights.latitude, flights.longitude], {
                                duration: 1000
                            });
                            isChecked = true;
                            myMap.behaviors.disable('drag');
                          } else {
                            isChecked = false;
                            myMap.behaviors.enable('drag');
                          }
                        });

                        if (isChecked) {
                            myMap.setCenter([flights.latitude, flights.longitude]);
                        }

                    } else {
                        console.error("Карта или метка не инициализированы");
                    }
                }                

                setInterval(() => {
                    getApiUrls().then(urls => {
                        const globalUrl = `${urls.Flights.Global}/details/?id=${id}&number=${paramsTailNumber}`;
                        $.ajax({
                            url: globalUrl,
                            method: 'GET',
                            timeout: 500,
                            success: function(data) {
                                console.log(data);
                                movePlacemark(data);
                            },
                            error: function(jqXHR, textStatus) {
                                console.log('Ошибка сети:', textStatus);
                                getApiUrls().then(urls => {
                                    const localUrl = `${urls.Flights.Local}/details/?id=${id}&number=${paramsTailNumber}`;
                                    $.ajax({
                                        url: localUrl,
                                        method: 'GET',
                                        success: function(data) {
                                            movePlacemark(data);
                                        },
                                        error: function(jqXHR, textStatus) {
                                            console.log("Ошибка:", textStatus);
                                        }
                                    });
                                });
                            }
                        });
                    });
                }, 1500);
          });


        $list.append(carrierCompany, captain, pilot, airports, fullness, departureDate, arrivalDate, distanceBetweenAirports);
        $currentFlightItem.append(currentFlightInfo);
        $currentFlight.append($currentFlightItem);
    }
    fetchFlights()
});
