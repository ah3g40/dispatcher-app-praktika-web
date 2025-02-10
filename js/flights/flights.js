
//----------------------------- FLIGHTS_GET -----------------------------

$(document).ready(function() {
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

    function displayFlights(flights) {    
        const $list = $('#table');

        flights.forEach(flightsData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });

            const carrierCompany = $('<td>', {
                class: 'table-data',
                text: flightsData.carrierCompany.name
            });

            const planeCompany = $('<td>', {
                class: 'table-data',
                text: flightsData.plane.company.name
            });
            const tailNumber = $('<td>', {
                class: 'table-data',
                id: 'flight-tail-number',
                text: flightsData.plane.tailNumber
            });
            const captain = $('<td>', {
                class: 'table-data',
                text: flightsData.captain.lastName+" "+flightsData.captain.firstName+" "+flightsData.captain.middleName
            });
            const pilot = $('<td>', {
                class: 'table-data',
                text: flightsData.pilot.lastName+" "+flightsData.pilot.firstName+" "+flightsData.pilot.middleName
            });
            const airportFrom = $('<td>', {
                class: 'table-data',
                text: flightsData.airportFrom.icao+" ("+flightsData.airportFrom.iata+")"
            });
            const airportTo = $('<td>', {
                class: 'table-data',
                text: flightsData.airportTo.icao+" ("+flightsData.airportTo.iata+")"
            });
            const fullness = $('<td>', {
                class: 'table-data',
                text: flightsData.fullness
            });
            let departureDateString = flightsData.departureDate;
            let cleanedDepartureDate = departureDateString.replace(/^(.*?)(T\d{2}:\d{2}).*$/, '$1 $2');
            cleanedDepartureDate = cleanedDepartureDate.replace('T', ' ');
            const departureDate = $('<td>', {
                class: 'table-data',
                text: cleanedDepartureDate
            });
            let arrivalDateString = flightsData.arrivalDate;
            let cleanedArrivalDate = arrivalDateString.replace(/^(.*?)(T\d{2}:\d{2}).*$/, '$1 $2');
            cleanedArrivalDate = cleanedArrivalDate.replace('T', ' ');
            const arrivalDate = $('<td>', {
                class: 'table-data',
                text: cleanedArrivalDate
            });
            const moreDetails = $('<td>', {
                name: `details`,
                'data-id': flightsData.id,
                'data-number': flightsData.plane.tailNumber,
                class: 'table-data details-button-td',
            }).append($('<button>', {
                class: "detailsButton btn",
                value: flightsData.id,
                id: "details-btn", 
                text: "Подробнее"
            }));
            const deleteButton = $('<td>', {
                class: 'table-data delete-button-td'
            }).append($('<button>', {
                class: "deleteButton btn",
                value: flightsData.id,
                id: "delete-btn", 
                text: "Удалить"
            }));
            

            $listItem.append(carrierCompany, planeCompany, tailNumber, captain, pilot, airportFrom, airportTo, fullness, departureDate, arrivalDate, moreDetails, deleteButton);

            $list.append($listItem);

            $(document).on('click', `[name='details']`, async function (event) {
                const flightId = $(this).data('id');
                const flightTailNumber = $(this).data('number');
                console.log(flightTailNumber);
                console.log(flightId);
                
                if (flightId && flightTailNumber) {
                    try {
                        window.location.href = `/flights?id=${flightId}&number=${flightTailNumber}`;
                    } catch (error) {
                        console.error('Ошибка при перенаправлении:', error);
                    }
                } else {
                    console.warn('Идентификатор рейса отсутствует.');
                }
            });
            
        });
    }

    //----------------------------- FLIGHTS_DELETE -----------------------------

$(document).on("click", "#delete-btn", async function () {
    const flightId = $(this).val();
    const flightName = $("#flight-tail-number" + flightId).text();
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        const userConfirmed = confirm("Вы уверены что хотите удалить " + flightName + "?");
        if (!userConfirmed) {
            console.log("Удаление отменено пользователем.");
            return;
        }
    }

    try {
        const urls = await getApiUrls();
        console.log("URL для удаления:", urls.Flights.Global + "/" + flightId);

        $.ajax({
            type: "DELETE",
            url: urls.Flights.Global + "/" + flightId,
            success: function (response) {
                console.log("Удаление успешно:", response);
                $("#table").load(window.location + " #table > *", function() {
                    fetchFlights();
                });
            },
            error: function (error) {
                console.error("Ошибка при удалении с глобального URL:", error);
                $.ajax({
                    type: "DELETE",
                    url: urls.Flights.Local + "/" + flightId,
                    success: function (response) {
                        console.log("Удаление успешно с локального URL:", response);
                        $("#table").load(window.location + " #table > *", function() {
                            fetchFlights();
                        });
                    },
                    error: function (error) {
                        console.error("Ошибка сети при удалении с локального URL:", error);
                    }
                });
            }
        });
    } catch (er) {
        console.error("Ошибка при получении URL API:", er);
        const urls = await getApiUrls();
        $.ajax({
            type: "DELETE",
            url: urls.Flights.Local + "/" + flightId,
            success: function (response) {
                console.log("Удаление успешно с локального URL после ошибки:", response);
                $("#table").load(window.location + " #table > *", function() {
                    fetchFlights();
                });
            },
            error: function (error) {
                console.error("Ошибка сети при удалении с локального URL после ошибки:", error);
            }
        });
    }
});
    fetchFlights()
})    
