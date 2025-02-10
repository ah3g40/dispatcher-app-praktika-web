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


// async function displayFlights(flights) {
//     const flightList = document.getElementById('flight-list');
//     flights.forEach(flight => {
//         const flightListItem = document.createElement('li');
//         flightListItem.id = flight.id;
//         flightListItem.textContent = flight.carrierCompany.name+" "+flight.plane.company.name+" "+flight.plane.tailNumber+" летит на скорости "+flight.plane.cruisingSpeed+" узлов из "+flight.airportFrom.icao+"("+flight.airportFrom.iata+") в "+flight.airportTo.icao+"("+flight.airportTo.iata+")";
//         flightList.appendChild(flightListItem);
//     });
// }

async function displayFlights(flights) {
    const list = document.getElementById('flight-list');
    flights.forEach(flight => {
        const listItem = document.createElement('tr');
        listItem.className = "table-row";
        listItem.id = flight.id;
        list.appendChild(listItem);
        
        const flightList = document.getElementById(flight.id);
        
        
        const carrierCompany = document.createElement('td');
        const planeCompany = document.createElement('td');
        const planeTailNumber = document.createElement('td');
        const captain = document.createElement('td');
        const pilot = document.createElement('td');
        const cruisingSpeed = document.createElement('td');
        const airportFromIcao = document.createElement('td');
        const airportToIcao = document.createElement('td');
        const fullness = document.createElement('td');
        const departDate = document.createElement('td');
        const arrivalDate = document.createElement('td');
        
        carrierCompany.className = "table-data";
        planeCompany.className = "table-data";
        planeTailNumber.className = "table-data";
        captain.className = "table-data";
        pilot.className = "table-data";
        cruisingSpeed.className = "table-data";
        airportFromIcao.className = "table-data";
        airportToIcao.className = "table-data";
        fullness.className = "table-data";
        departDate.className = "table-data";
        arrivalDate.className = "table-data";
        
        
        carrierCompany.textContent = flight.carrierCompany.name;
        planeCompany.textContent = flight.plane.company.name;
        planeTailNumber.textContent = flight.plane.tailNumber;
        captain.textContent = flight.captain.lastName+" "+flight.captain.firstName+" "+flight.captain.middleName
        pilot.textContent = flight.pilot.lastName+" "+flight.pilot.firstName+" "+flight.pilot.middleName
        cruisingSpeed.textContent = flight.plane.cruisingSpeed+" knots";
        airportFromIcao.textContent = flight.airportFrom.icao+" ("+flight.airportFrom.iata+")";
        airportToIcao.textContent = flight.airportTo.icao+" ("+flight.airportTo.iata+")";
        fullness.textContent = flight.fullness;
        departDate.textContent = flight.departureDate;
        arrivalDate.textContent = flight.arrivalDate;
        
        flightList.appendChild(carrierCompany);
        flightList.appendChild(planeCompany);
        flightList.appendChild(planeTailNumber);
        flightList.appendChild(captain);
        flightList.appendChild(pilot);
        flightList.appendChild(cruisingSpeed);
        flightList.appendChild(airportFromIcao);
        flightList.appendChild(airportToIcao);
        flightList.appendChild(fullness);
        flightList.appendChild(departDate);
        flightList.appendChild(arrivalDate);
    });
}

// function getFlightsGlobalUrl() {
//     $.getJSON('../json/apiUrls.json', function(data) {
//         // Извлекаем значение Flights: Global
//         var flightsGlobalUrl = data.Flights.Global;
        
//         // Выводим ссылку в консоль
//         console.log('Flights Global URL:', flightsGlobalUrl)

//         $.get(flightsGlobalUrl, function(data) {

//         })
//     })};


$(document).ready(function() {
    // Функция для загрузки и отображения данных
    function loadAndDisplayData() {
        // Шаг 1: Загружаем apiUrls.json
        $.getJSON('../json/apiUrls.json', function(apiUrls) {
            // Извлекаем URL для Flights: Global
            var flightsGlobalUrl = apiUrls.Flights.Global;

            // Шаг 2: Делаем запрос к API Flights: Global
            $.getJSON(flightsGlobalUrl, function(flightsData) {
                // Шаг 3: Отображаем данные в таблице
                displayDataInTable(flightsData);
            }).fail(function() {
                $('#dataContainer').html('<p>Ошибка при загрузке данных с API.</p>');
            });
        }).fail(function() {
            $('#dataContainer').html('<p>Ошибка при загрузке apiUrls.json.</p>');
        });
    }

    // Функция для отображения данных в таблице
    function displayDataInTable(data) {
        var container = $('#dataContainer');
        container.empty(); // Очищаем контейнер

        if (Array.isArray(data) && data.length > 0) {
            // Создаем таблицу
            var table = $('<table></table>');

            // Создаем заголовок таблицы
            var thead = $('<thead></thead>');
            var headerRow = $('<tr></tr>');

            // Получаем ключи (названия столбцов) из первого элемента
            var columns = Object.keys(data[0]);
            columns.forEach(function(column) {
                headerRow.append($('<th></th>').text(column));
            });

            thead.append(headerRow);
            table.append(thead);

            // Создаем тело таблицы
            var tbody = $('<tbody></tbody>');

            // Сортируем данные (например, по flightNumber)
            data.sort(function(a, b) {
                return a.flightNumber.localeCompare(b.flightNumber);
            });

            // Добавляем строки с данными
            data.forEach(function(item) {
                var row = $('<tr></tr>');
                columns.forEach(function(column) {
                    // Создаем ячейку и добавляем класс table-data
                    var cell = $('<td></td>').text(item[column]).addClass('table-data');
                    row.append(cell);
                });
                tbody.append(row);
            });

            table.append(tbody);
            container.append(table);
        } else {
            container.html('<p>Нет данных для отображения.</p>');
        }
    }

    // Вызов функции при загрузке страницы
    loadAndDisplayData();
});
