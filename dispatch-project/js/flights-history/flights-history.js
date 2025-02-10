$(document).ready(function() {
    function fetchFlightsHistory() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.FlightsHistory.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayFlightsHistory(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchFlightsHistoryLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchFlightsHistoryLocal();
        });
    }

    function fetchFlightsHistoryLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.FlightsHistory.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayFlightsHistory(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }

    function displayFlightsHistory(flightsHistory) {
        const $list = $('#table');

        flightsHistory.forEach(flightsHistoryData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });

            const carrierCompany = $('<td>', {
                class: 'table-data',
                id: 'carrier-company'+flightsHistoryData.id,
                text: flightsHistoryData.carrierCompany.name
            });

            const planeCompany = $('<td>', {
                class: 'table-data',
                text: flightsHistoryData.plane.company.name
            });

            const tailNumber = $('<td>', {
                class: 'table-data',
                text: flightsHistoryData.plane.tailNumber
            });

            const captain = $('<td>', {
                class: 'table-data',
                text: flightsHistoryData.captain.lastName+" "+flightsHistoryData.captain.firstName+" "+flightsHistoryData.captain.middleName
            });

            const pilot = $('<td>', {
                class: 'table-data',
                text: flightsHistoryData.pilot.lastName+" "+flightsHistoryData.pilot.firstName+" "+flightsHistoryData.pilot.middleName
            });

            const airportFrom = $('<td>', {
                class: 'table-data',
                text: flightsHistoryData.airportFrom.icao+" ("+flightsHistoryData.airportFrom.iata+")"
            });

            const airportTo = $('<td>', {
                class: 'table-data',
                text: flightsHistoryData.airportTo.icao+" ("+flightsHistoryData.airportTo.iata+")"
            });

            const fullness = $('<td>', {
                class: 'table-data',
                text: flightsHistoryData.fullness
            });

            let departureDateString = flightsHistoryData.departureDate;
            let cleanedDepartureDate = departureDateString.replace(/^(.*?)(T\d{2}:\d{2}).*$/, '$1 $2');
            cleanedDepartureDate = cleanedDepartureDate.replace('T', ' ');
            const departureDate = $('<td>', {
                class: 'table-data',
                text: cleanedDepartureDate
            });

            let arrivalDateString = flightsHistoryData.arrivalDate;
            let cleanedArrivalDate = arrivalDateString.replace(/^(.*?)(T\d{2}:\d{2}).*$/, '$1 $2');
            cleanedArrivalDate = cleanedArrivalDate.replace('T', ' ');
            const arrivalDate = $('<td>', {
                class: 'table-data',
                text: cleanedArrivalDate
            });

            const moreDetails = $('<td>', {
                name: `details`,
                'data-id': flightsHistoryData.id,
                'data-number': flightsHistoryData.plane.tailNumber,
                class: 'table-data details-button-td',
            }).append($('<button>', {
                class: "detailsButton btn",
                value: flightsHistoryData.id,
                id: "details-btn", 
                text: "Подробнее"
            }));

            $listItem.append(carrierCompany, planeCompany, tailNumber, captain, pilot, airportFrom, airportTo, fullness, departureDate, arrivalDate, moreDetails);
            $list.append($listItem);

            $(document).on('click', `[name='details']`, async function (event) {
                const flightId = $(this).data('id');
                const flightTailNumber = $(this).data('number');
                console.log(flightTailNumber);
                console.log(flightId);
                
                if (flightId && flightTailNumber) {
                    try {
                        window.location.href = `/flights-history/details/?id=${flightId}`;
                    } catch (error) {
                        console.error('Ошибка при перенаправлении:', error);
                    }
                } else {
                    console.warn('Идентификатор рейса отсутствует.');
                }
            });
        });
    }
    fetchFlightsHistory();
})