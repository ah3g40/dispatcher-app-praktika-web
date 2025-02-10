$(document).ready(function() {
    function fetchCities() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Cities.Global;

            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCountriesToCities(data);
                    putCities(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchCitiesLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchCitiesLocal();
        });
    }

    function fetchCountriesToCities(cities) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Countries.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayCities(cities, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }

    function fetchCitiesLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Cities.Local;

            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchCountriesToCitiesLocal(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function fetchCountriesToCitiesLocal(cities) {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Countries.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    displayCities(cities, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function displayCities(cities, countries) {    
        const $list = $('#table');

        cities.forEach(cityData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });

            const formSlideButton = $('<td>', {
                class: 'table-data form-slide-button',
                id: 'form-slide-button' + cityData.id
            });
    
            formSlideButton.load('/svg/downarrowkrutoy.svg', function() {
                $(this).find('svg').attr({
                    width: '15px',  
                    height: '10px'
                });
            });

            const city = $('<td>', {
                class: 'table-data',
                id: "city-name"+cityData.id,
                text: cityData.name
            });

            const country = $('<td>', {
                class: 'table-data',
                text: cityData.country.name
            });

            const deleteButton = $('<td>', {
                class: 'table-data delete-button-td'
            }).append($('<button>', {
                class: "deleteButton btn",
                value: cityData.id,
                id: "delete-btn", 
                text: "Удалить"
            }));

            const $formItem = $('<tr>', {
                id: 'table-form-row' + cityData.id,
                class: "table-row table-form-row"
            }).append($('<td>', { 
                    class: 'table-data',
                    id: 'empty-td' + cityData.id,
                    style: 'display:none;'
            })).append($('<td>', { 
                    class: 'table-data-form table-data',
                    id: 'table-form-td' + cityData.id,
                    style: 'display:none;',
                }).append($('<input>', {
                        type: 'text',
                        name: 'name',
                        value: cityData.name,
                        id: 'input-name' + cityData.id,
                        style: 'display: none;',
                        class: "table-form-input input-name",
            }))).append($('<td>', {
                    class: 'table-data-form table-data',
                    id: 'table-country-td'+cityData.id,
                    style: 'display:none'
                }).append(tableFormCountryList = $('<select>', {
                        id: 'table-form-country-list'+cityData.id,
                        class: 'table-form-select select-country',
                        style: 'display:none',
                        name: 'country'
            }))).append($('<td>', {
                    class: 'table-data-form table-data',
                    id: 'table-submit-td'+cityData.id,
                    style: 'display: none;'
                }).append($('<input>', {
                        type: 'submit',
                        name: 'submit',
                        id: 'submit' + cityData.id,
                        value: "Подтвердить",
                        style: 'display: none;',
                        class: "table-form-submit"
            })))

            countries.forEach(countryData => {
                const countryOption = $('<option>', {
                    id: "country-option"+countryData.id,
                    value: countryData.id,
                    text: countryData.name
                });
                tableFormCountryList.append(countryOption);
            });

            const $countrySelect = tableFormCountryList;
            const initialCountryVal = cityData.countryId;

            if(initialCountryVal){
                $countrySelect.val(initialCountryVal);
            }

            $listItem.append(formSlideButton, city, country, deleteButton);
            
            $list.append($listItem,$formItem);

            $("#form-slide-button"+cityData.id).click(function() {
                const isOpen = $('#empty-td'+cityData.id).is(":visible");
                $("#empty-td" + cityData.id).slideToggle("fast");
                $("#table-form-td" + cityData.id).slideToggle("fast");
                $("#table-country-td"+cityData.id).slideToggle("fast");
                $("#table-submit-td"+cityData.id).slideToggle("fast");
                $("#input-name"+cityData.id).slideToggle("fast");
                $("#table-form-country-list"+cityData.id).slideToggle("fast");
                $("#submit"+cityData.id).slideToggle("fast");
                if (isOpen) {
                    $(this).find('svg').removeClass('rotate');
                    $(this).find('svg').addClass('rotate-back');
                } else {
                    $(this).find('svg').removeClass('rotate-back');
                    $(this).find('svg').addClass('rotate');
                }
            });
        });
    }


//---------------------------- CITIES_PUT --------------------------------------
    
function putCities(cities) {
    $(document).one('click', "[name='submit']", async function (event) { 
        var elem = [];

        cities.forEach((city) => {
            if (this.id == ('submit' + city.id) ) {
                elem = city;
            }
        });
        event.preventDefault();
        var data = {
            id: elem.id,
            name: $(`#input-name${elem.id}`).val(),
            countryId: $(`#table-form-country-list${elem.id}`).val(), 
            country: {
                id: $(`#table-form-country-list${elem.id}`).val(),
                name: $(`#country-option${$(`#table-form-country-list${elem.id}`).val()}`).text(),
            }
        };
        console.log(data);
        
        try {
            const urls = await getApiUrls();
            console.log(urls.Cities.Global);
            $.ajax({
                type: "PUT",
                url: urls.Cities.Global + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCities();
                    });
                },
                error: function(error) {
                    console.log(error);
                    $.ajax({
                        type: "PUT",
                        url: urls.Cities.Local + '/' + elem.id,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchCities();
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
                url: urls.Cities.Local + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCities();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    });
}

//----------------------------- CITIES_DELETE -----------------------------

$(document).one("click", "#delete-btn", async function () {
    if (confirm("Вы уверены что хотите удалить " + $("#city-name" + $(this).val()).text())) {
        try {
            const urls = await getApiUrls();
            console.log(urls.Cities.Local + "?id=" + $(this).val())
            $.ajax({
                type: "DELETE",
                url: urls.Cities.Global + "?id=" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCities();
                    });
                },
                error: function (error) {
                    console.log(error);
                    $.ajax({
                        type: "DELETE",
                        url: urls.Cities.Local + "?id=" + $(this).val(),
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchCities();
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
                url: urls.Cities.Local + "?id=" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCities();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    }
 })

fetchCities();

});
