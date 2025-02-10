//----------------------------- AIRPORTS_GET -----------------------------

$(document).ready(function () {
    function fetchAirports() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Airports.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCountriesAir(data);
                    putAirports(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchAirportsLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchAirportsLocal();
        });
    }
    function fetchCountriesAir(air) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Countries.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCitiesAir(air, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }
    function fetchCitiesAir(air, coun) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Cities.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayAirports(air, coun, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }
    
    function fetchAirportsLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Airports.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchCountriesAirLocal(data);
                    putAirports(data)
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }
    function fetchCountriesAirLocal(air) {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Countries.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchCitiesAirLocal(air, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }
    function fetchCitiesAirLocal(air, coun) {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Cities.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    displayAirports(air, coun, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function displayAirports(airports, countries, cities) {    
        const $list = $('#table');

        airports.forEach(airportsData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });
    
            const formSlideButton = $('<td>', {
                class: 'table-data form-slide-button',
                id: 'form-slide-button' + airportsData.id
            });
    
            formSlideButton.load('/svg/downarrowkrutoy.svg', function() {
                $(this).find('svg').attr({
                    width: '15px',  
                    height: '10px'
                });
            });
    
            const name = $('<td>', {
                class: 'table-data',
                id: "airport-name" + airportsData.id,
                text: airportsData.name
            });
    
            const icao = $('<td>', {
                class: 'table-data',
                text: airportsData.icao
            });
    
            const iata = $('<td>', {
                class: 'table-data',
                text: airportsData.iata
            });
    
            const city = $('<td>', {
                class: 'table-data',
                value: airportsData.cityId,
                text: airportsData.city.name
            });
    
            const country = $('<td>', {
                class: 'table-data',
                value: airportsData.city.countryId,
                text: airportsData.city.country.name
            });
    
            const latitude = $('<td>', {
                class: 'table-data',
                text: airportsData.latitude
            });
    
            const longitude = $('<td>', {
                class: 'table-data',
                text: airportsData.longitude
            });
    
            const deleteButton = $('<td>', {
                class: 'table-data delete-button-td'
            }).append($('<button>', {
                class: "deleteButton btn",
                value: airportsData.id,
                id: "delete-btn", 
                text: "Удалить"
            }));
            
            const $formItem = $('<tr>', {
                id: 'table-form-row' + airportsData.id,
                class: "table-row table-form-row"
            }).append($('<td>', { 
                    class: 'table-data',
                    id: 'empty-td' + airportsData.id,
                    style: 'display:none;'
            })).append($('<td>', { 
                    class: 'table-data-form table-data',
                    id: 'table-form-td' + airportsData.id,
                    style: 'display:none;',
                }).append($('<input>', {
                        type: 'text',
                        name: 'name',
                        value: airportsData.name,
                        id: 'input-name' + airportsData.id,
                        style: 'display: none;',
                        class: "table-form-input input-name",
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-icao-td'+airportsData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'icao',
                    value: airportsData.icao,
                    id: 'input-icao'+airportsData.id,
                    style: 'display: none;',
                    class: "table-form-input input-icao"
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-iata-td'+airportsData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'iata',
                    value: airportsData.iata,
                    id: 'input-iata'+airportsData.id,
                    style: 'display: none;',
                    class: "table-form-input input-iata"
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-city-td'+airportsData.id,
                style: 'display: none;'
                }).append(tableFormCityList = $('<select>', {
                    id: 'table-form-city-list'+airportsData.id,
                    class: "table-form-select select-city",
                    style: 'display:none',
                    name: "city"+airportsData.id
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-country-td'+airportsData.id,
                style: 'display: none;'
            }).append(tableFormCountryList = $('<select>', {
                    id: 'table-form-country-list'+airportsData.id,
                    class: "table-form-select select-country",
                    style: 'display: none;',
                    name: 'country'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-latitude-td'+airportsData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'latitude',
                    id: 'input-latitude'+airportsData.id,
                    value: airportsData.latitude,
                    style: 'display: none;',
                    class: "table-form-input input-latitude"
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-longitude-td'+airportsData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'longitude',
                    id: 'input-longitude'+airportsData.id,
                    value: airportsData.longitude,
                    style: 'display: none;',
                    class: "table-form-input input-longitude"
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-submit-td'+airportsData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'submit',
                    name: 'submit',
                    id: 'submit' + airportsData.id,
                    value: "Подтвердить",
                    style: 'display: none;',
                    class: "table-form-submit"
            })))      
            
            countries.forEach(countryData => {
                const countryOption = $('<option>', {
                    id: "country-option" + countryData.id,
                    value: countryData.id,
                    text: countryData.name
                });
                tableFormCountryList.append(countryOption);
            });
            
            const $countrySelect = tableFormCountryList;
            const $citySelect = tableFormCityList;
            const initialCountryVal = airportsData.city.countryId;
            
            function populateCities(selectedCountryId, selectedCityId = null) {
                cities.forEach(cityData => {
                    if (cityData.countryId == selectedCountryId) {
                        const cityOption = $('<option>', {
                            id: "city-option" + cityData.id,
                            value: cityData.id,
                            text: cityData.name
                        });
                        $citySelect.append(cityOption);
                    }
                });
            
                if (selectedCityId && airportsData.city.countryId == selectedCountryId) {
                    $citySelect.val(selectedCityId);
                } else if(selectedCityId && !airportsData.city.countryId == selectedCountryId){
                    $citySelect.val(selectedCityId);
                }
            }
            
            if(initialCountryVal){
                $countrySelect.val(initialCountryVal);
                const initialCountryId = $countrySelect.val();
                const initialCityId = airportsData.cityId;
                populateCities(initialCountryId, initialCityId);
            }
            
            $countrySelect.on('change', function() {
                const initialCityId = airportsData.cityId;
                const selectedCountryId = $(this).val();
                $citySelect.empty();
                populateCities(selectedCountryId, initialCityId);
            });

            $listItem.append(formSlideButton, name, icao, iata, city, country, latitude, longitude, deleteButton);
            
            $list.append($listItem, $formItem);
    
            $("#form-slide-button" + airportsData.id).click(function(){
                const isOpen = $("#empty-td" + airportsData.id).is(":visible");
                $("#empty-td" + airportsData.id).slideToggle("fast");
                $("#table-form-td" + airportsData.id).slideToggle("fast");
                $("#table-icao-td"+airportsData.id).slideToggle("fast");
                $("#table-iata-td"+airportsData.id).slideToggle("fast");
                $("#table-city-td"+airportsData.id).slideToggle("fast");
                $("#table-country-td"+airportsData.id).slideToggle("fast");
                $("#table-latitude-td" + airportsData.id).slideToggle("fast");
                $("#table-longitude-td" + airportsData.id).slideToggle("fast");
                $("#table-submit-td" + airportsData.id).slideToggle("fast");
                $("#input-name"+airportsData.id).slideToggle("fast");
                $("#input-icao"+airportsData.id).slideToggle("fast");
                $("#input-iata"+airportsData.id).slideToggle("fast");
                $("#table-form-city-list"+airportsData.id).slideToggle("fast");
                $("#table-form-country-list" + airportsData.id).slideToggle("fast");
                $("#input-latitude" + airportsData.id).slideToggle("fast");
                $("#input-longitude" + airportsData.id).slideToggle("fast");
                $("#submit" + airportsData.id).slideToggle("fast");
                if (isOpen) {
                    $(this).find('svg').removeClass('rotate');
                    $(this).find('svg').addClass('rotate-back');
                } else {
                    $(this).find('svg').removeClass('rotate-back');
                    $(this).find('svg').addClass('rotate');
                }
                
            });
            const $apName = $(`#input-name${airportsData.id}`);
            const $icaoAirport = $(`#input-icao${airportsData.id}`);
            const $iataAirport = $(`#input-iata${airportsData.id}`);
            const $lat = $(`#input-latitude${airportsData.id}`);
            const $lon = $(`#input-longitude${airportsData.id}`);
            const $maxValTextLat = $('#max-val-lat');
            const $maxValTextLon = $('#max-val-lon');
        
            $lat.on('input', function() {
                let maxVal = 9;
            
                if ($(this).val().startsWith("-")) {
                    maxVal = 90;
                }
            
                if ($(this).val().length > maxVal) {
                    $(this).val($(this).val().slice(0, maxVal));
                }
            
                if (Number($(this).val()) > 90 || Number($(this).val()) < -90) {
                    $(this).val($(this).val().slice(0, -1));
                    $maxValTextLat.show();
                    $maxValTextLat.text("Значение не может быть выше 90 или ниже -90");
                } else {
                    $maxValTextLat.hide(); 
                }
            });
        
            $lon.on('input', function() {
                let maxVal = 10;
            
                if ($(this).val().startsWith("-")) {
                    maxVal = 11;
                }
            
                if ($(this).val().length > maxVal) {
                    $(this).val($(this).val().slice(0, maxVal));
                }
            
                if (Number($(this).val()) > 180 || Number($(this).val()) < -180) {
                    $(this).val($(this).val().slice(0, -1));
                    $maxValTextLon.show();
                    $maxValTextLon.text("Значение не может быть выше 180 или ниже -180");
                } else {
                    $maxValTextLon.hide(); 
                }
            });
        
            $apName.on('input', function() {
                if ($(this).val().length > 250) {
                    $(this).val($(this).val().slice(0, 250));
                }
            });
        
            $icaoAirport.on('input', function() {
                $(this).val($(this).val().toUpperCase());
            
                if ($(this).val().length > 4) {
                    $(this).val($(this).val().slice(0, 4));
                }
            });
        
            $iataAirport.on('input', function() {
                $(this).val($(this).val().toUpperCase());
            
                if ($(this).val().length > 3) {
                    $(this).val($(this).val().slice(0, 3));
                }
            });
        });
    }

    //----------------------------- AIRPORTS_PUT -------------------------------

    function putAirports(airports) {
        $(document).one('click', "[name='submit']", async function (event) { 
            var elem = [];
    
            airports.forEach((airport) => {
                if (this.id == ('submit' + airport.id) ) {
                    elem = airport;
                }
            });
            event.preventDefault();
            var data = {
                id: elem.id,
                name: $(`#input-name${elem.id}`).val(),
                icao: $(`#input-icao${elem.id}`).val(),
                iata: $(`#input-iata${elem.id}`).val(),
                cityId: $(`#table-form-city-list${elem.id}`).val(), 
                city: {
                    id: $(`#table-form-city-list${elem.id}`).val(),
                    name: $(`#city-option${$(`#table-form-city-list${elem.id}`).val()}`).text(),
                    countryId: $(`#table-form-country-list${elem.id}`).val(),
                    country: {
                        id: $(`#table-form-country-list${elem.id}`).val(),
                        name: $(`#country-option${$(`#table-form-country-list${elem.id}`).val()}`).text(), 
                    }
                },
                latitude: $(`#input-latitude${elem.id}`).val(),
                longitude: $(`#input-longitude${elem.id}`).val()
            };
            console.log(data);
            
            try {
                const urls = await getApiUrls();
                console.log(urls.Airports.Global);
                $.ajax({
                    type: "PUT",
                    url: urls.Airports.Global + '/' + elem.id,
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function(response) {
                        $("#table").load(window.location + " #table > *", function() {
                            fetchAirports();
                        });
                    },
                    error: function(error) {
                        console.log(error);
                        $.ajax({
                            type: "PUT",
                            url: urls.Airports.Local + '/' + elem.id,
                            data: JSON.stringify(data),
                            contentType: "application/json",
                            success: function (response) {
                                $("#table").load(window.location + " #table > *", function() {
                                    fetchAirports();
                                });
                            },
                            error: function (error) {
                                console.log("Ошибка сети");
                            }
                        });
                    }
                });
            } catch (er) {
                const urls = await getApiUrls();
                $.ajax({
                    type: "PUT",
                    url: urls.Airports.Local + '/' + elem.id,
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (response) {
                        $("#table").load(window.location + " #table > *", function() {
                            fetchAirports();
                        });
                    },
                    error: function (error) {
                        console.log("Ошибка сети");
                    }
                });
            }
        });
    }
    
    //----------------------------- AIRPORTS_DELETE -----------------------------

    $(document).on("click", "#delete-btn", async function () {
        const airportId = $(this).val();
        const airportName = $("#airport-name" + airportId).text();
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
        if (!isTouchDevice) {
            const userConfirmed = confirm("Вы уверены что хотите удалить " + airportName + "?");
            if (!userConfirmed) {
                console.log("Удаление отменено пользователем.");
                return;
            }
        }
    
        try {
            const urls = await getApiUrls();
            console.log("URL для удаления:", urls.Airports.Global + "?id=" + airportId);

            $.ajax({
                type: "DELETE",
                url: urls.Airports.Global + "?id=" + airportId,
                success: function (response) {
                    console.log("Удаление успешно:", response);
                    $("#table").load(window.location + " #table > *", function() {
                        fetchAirports();
                    });
                },
                error: function (error) {
                    console.error("Ошибка при удалении с глобального URL:", error);
                    $.ajax({
                        type: "DELETE",
                        url: urls.Airports.Local + "?id=" + airportId,
                        success: function (response) {
                            console.log("Удаление успешно с локального URL:", response);
                            $("#table").load(window.location + " #table > *", function() {
                                fetchAirports();
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
                url: urls.Airports.Local + "?id=" + airportId,
                success: function (response) {
                    console.log("Удаление успешно с локального URL после ошибки:", response);
                    $("#table").load(window.location + " #table > *", function() {
                        fetchAirports();
                    });
                },
                error: function (error) {
                    console.error("Ошибка сети при удалении с локального URL после ошибки:", error);
                }
            });
        }
    });
    
    
    setTimeout(function() {
        fetchAirports()
    }, 200)
            
});
  