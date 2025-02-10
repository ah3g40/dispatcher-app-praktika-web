$(document).ready(function() {
    function fetchPilots() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Pilots.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCountriesToPilots(data);
                    putPilots(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchPilotsLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchPilotsLocal();
        });
    }

    function fetchCountriesToPilots(pilots) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Countries.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCitiesToPilots(pilots, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }

    function fetchCitiesToPilots(pilots, countries) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Cities.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayPilots(pilots, countries, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }
    
    function fetchPilotsLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Pilots.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchCountriesToPilotsLocal(data);
                    putPilots(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function fetchCountriesToPilotsLocal(pilots) {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Countries.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchCitiesToPilotsLocal(pilots, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function fetchCitiesToPilotsLocal(pilots, countries) {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Cities.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    displayPilots(pilots, countries, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function displayPilots(pilots, countries, cities) {    
        const $list = $('#table');

        pilots.forEach(pilotsData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });

            const formSlideButton = $('<td>', {
                class: 'table-data form-slide-button',
                id: 'form-slide-button' + pilotsData.id
            });
    
            formSlideButton.load('/svg/downarrowkrutoy.svg', function() {
                $(this).find('svg').attr({
                    width: '15px',  
                    height: '10px'
                });
            });

            const lastName = $('<td>', {
                class: 'table-data',
                id: 'pilot-last-name'+pilotsData.id,
                text: pilotsData.lastName
            });

            const firstName = $('<td>', {
                class: 'table-data',
                text: pilotsData.firstName
            });
            const middleName = $('<td>', {
                class: 'table-data',
                text: pilotsData.middleName
            });
            const city = $('<td>', {
                class: 'table-data',
                text: pilotsData.city.name
            });
            const country = $('<td>', {
                class: 'table-data',
                text: pilotsData.city.country.name
            });

            const deleteButton = $('<td>', {
                class: 'table-data delete-button-td'
            }).append($('<button>', {
                class: "deleteButton btn",
                value: pilotsData.id,
                id: "delete-btn", 
                text: "Удалить"
            }));

            const $formItem = $('<tr>', {
                id: 'table-form-row' + pilotsData.id,
                class: "table-row table-form-row"
            }).append($('<td>', { 
                    class: 'table-data',
                    id: 'empty-td' + pilotsData.id,
                    style: 'display:none;'
            })).append($('<td>', { 
                    class: 'table-data-form table-data',
                    id: 'table-form-td' + pilotsData.id,
                    style: 'display:none;',
                }).append($('<input>', {
                        type: 'text',
                        name: 'lastName',
                        value: pilotsData.lastName,
                        id: 'input-last-name' + pilotsData.id,
                        style: 'display: none;',
                        class: "table-form-input input-name",
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-first-name-td'+pilotsData.id,
                style: 'display: none'
                }).append($('<input>', {
                    type: 'text',
                    name: 'firstName',
                    value: pilotsData.firstName,
                    id: 'input-first-name' + pilotsData.id,
                    style: 'display: none',
                    class: "table-form-input input-name"
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-middle-name-td'+pilotsData.id,
                style: 'display: none'
            }).append($('<input>', {
                type: 'text',
                name: 'middleName',
                value: pilotsData.middleName,
                id: 'input-middle-name'+pilotsData.id,
                style: 'display: none',
                class: "table-form-input input-name"
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-city-td'+pilotsData.id,
                style: 'display: none;'
                }).append(tableFormCityList = $('<select>', {
                    id: 'table-form-city-list'+pilotsData.id,
                    class: "table-form-select select-city",
                    style: 'display:none',
                    name: "city"+pilotsData.id
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-country-td'+pilotsData.id,
                style: 'display: none;'
            }).append(tableFormCountryList = $('<select>', {
                    id: 'table-form-country-list'+pilotsData.id,
                    class: "table-form-select select-country",
                    style: 'display: none;',
                    name: 'country'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-submit-td'+pilotsData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'submit',
                    name: 'submit',
                    id: 'submit' + pilotsData.id,
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
            const initialCountryVal = pilotsData.city.countryId;
            
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
            
                if (selectedCityId && pilotsData.city.countryId == selectedCountryId) {
                    $citySelect.val(selectedCityId);
                } else if(selectedCityId && !pilotsData.city.countryId == selectedCountryId){
                    $citySelect.val(selectedCityId);
                }
            }
            
            if(initialCountryVal){
                $countrySelect.val(initialCountryVal);
                const initialCountryId = $countrySelect.val();
                const initialCityId = pilotsData.cityId;
                populateCities(initialCountryId, initialCityId);
            }
            
            $countrySelect.on('change', function() {
                const initialCityId = pilotsData.cityId;
                const selectedCountryId = $(this).val();
                $citySelect.empty();
                populateCities(selectedCountryId, initialCityId);
            });

            $listItem.append(formSlideButton, lastName,firstName,middleName,city,country, deleteButton);
            
            $list.append($listItem, $formItem);

            $("#form-slide-button" + pilotsData.id).click(function(){
                const isOpen = $("#empty-td" + pilotsData.id).is(":visible");
                $("#empty-td" + pilotsData.id).slideToggle("fast");
                $("#table-form-td" + pilotsData.id).slideToggle("fast");
                $("#table-first-name-td"+pilotsData.id).slideToggle("fast");
                $("#table-middle-name-td"+pilotsData.id).slideToggle("fast");
                $("#table-city-td"+pilotsData.id).slideToggle("fast");
                $("#table-country-td"+pilotsData.id).slideToggle("fast");
                $("#table-submit-td"+pilotsData.id).slideToggle("fast");
                $("#input-last-name"+pilotsData.id).slideToggle("fast");
                $("#input-first-name"+pilotsData.id).slideToggle("fast");
                $("#input-middle-name"+pilotsData.id).slideToggle("fast");
                $("#table-form-city-list"+pilotsData.id).slideToggle("fast");
                $("#table-form-country-list"+pilotsData.id).slideToggle("fast");
                $("#submit"+pilotsData.id).slideToggle("fast");

        });
    })
    }

//--------------------------------- PILOTS_PUT ----------------------------------

    function putPilots(pilots) {
        $(document).one('click', "[name='submit']", async function (event) { 
            var elem = [];
    
            pilots.forEach((pilot) => {
                if (this.id == ('submit' + pilot.id) ) {
                    elem = pilot;
                }
            });
            event.preventDefault();
            var data = {
                id: elem.id,
                lastName: $(`#input-last-name${elem.id}`).val(),
                firstName: $(`#input-first-name${elem.id}`).val(),
                middleName: $(`#input-middle-name${elem.id}`).val(),
                cityId: $(`#table-form-city-list${elem.id}`).val(), 
                city: {
                    id: $(`#table-form-city-list${elem.id}`).val(),
                    name: $(`#city-option${$(`#table-form-city-list${elem.id}`).val()}`).text(),
                    countryId: $(`#table-form-country-list${elem.id}`).val(),
                    country: {
                        id: $(`#table-form-country-list${elem.id}`).val(),
                        name: $(`#country-option${$(`#table-form-country-list${elem.id}`).val()}`).text(), 
                    }
                }
            };
            console.log(data);
            
            try {
                const urls = await getApiUrls();
                console.log(urls.Pilots.Global);
                $.ajax({
                    type: "PUT",
                    url: urls.Pilots.Global + '/' + elem.id,
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function(response) {
                        $("#table").load(window.location + " #table > *", function() {
                            fetchPilots();
                        });
                    },
                    error: function(error) {
                        console.log(error);
                        $.ajax({
                            type: "PUT",
                            url: urls.Pilots.Local + '/' + elem.id,
                            data: JSON.stringify(data),
                            contentType: "application/json",
                            success: function (response) {
                                $("#table").load(window.location + " #table > *", function() {
                                    fetchPilots();
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
                    url: urls.Pilots.Local + '/' + elem.id,
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (response) {
                        $("#table").load(window.location + " #table > *", function() {
                            fetchPilots();
                        });
                    },
                    error: function (error) {
                        console.log("Ошибка сети");
                    }
                });
            }
        });
    }

//------------------------------ PILOTS_DELETE ----------------------------------

$(document).one("click", "#delete-btn", async function () {
    if (confirm("Вы уверены что хотите удалить " + $("#pilot-last-name" + $(this).val()).text())) {
        try {
            const urls = await getApiUrls();
            console.log(urls.Pilots.Local + "/" + $(this).val())
            $.ajax({
                type: "DELETE",
                url: urls.Pilots.Global + "/" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchPilots();
                    });
                },
                error: function (error) {
                    console.log(error);
                    $.ajax({
                        type: "DELETE",
                        url: urls.Pilots.Local + "/" + $(this).val(),
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchPilots();
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
                type: "DELETE",
                url: urls.Pilots.Local + "/" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchPilots();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    }
 })

    fetchPilots()
});