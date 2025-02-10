$(document).ready(function() {
    //---------------- вытягивание стран и городов для <select> -----------------
    var cities = []
    
    async function fetchCities() {
        $('form[name="pilotForm"] select[name="country"]').on('change', async function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.value !== "") {
                try {
                    if (cities == null || cities.length === 0) {
                        const urls = await getApiUrls();
                        const globalUrl = urls.Cities.Global;
                        const response = await fetchWithTimeout(globalUrl, {}, 400);
                        if (!response.ok) {
                            throw new Error('Ошибка сети: ' + response.statusText);
                        }
    
                        const data = await response.json();
                        cities = data;
                        console.log(cities);
                        
                        await fillCities(data, selectedOption);
                    } else {
                        await fillCities(cities, selectedOption);
                    }
                } catch (error) {
                    fetchCitiesLocal(selectedOption);
                    console.log("Ошибка " + error);
                }
            }
        });
    }
    
    function fetchCountries() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Countries.Global;

            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fillCountries(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchCountriesLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchCountriesLocal();
        });
    };
    
    async function fetchCitiesLocal(selectedOption) {
        try {
            if (cities == null || cities.length === 0) {
                const urls = await getApiUrls();
                const localUrl = urls.Cities.Local;
                const response = await fetchWithTimeout(localUrl, {}, 400);
                if (!response.ok) {
                    throw new Error('Ошибка сети: ' + response.statusText);
                }
    
                const data = await response.json();
                cities = data;
                console.log(cities);
                
                await fillCities(data, selectedOption);
            } else {
                await fillCities(cities, selectedOption);
            }
        } catch (error) {
            console.log("Ошибка " + error);
        }
    }    
    
    function fetchCountriesLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Countries.Local;

            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fillCountries(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }
    
    async function fillCountries(countries) {
        const $countryList = $('#country-list');
    
        countries.forEach(country => {
            const listItem = $('<option>', {
                value: country.id,
                text: country.name
            });
            $countryList.append(listItem);
        });
    
        await fetchCities();
    }
    
    
    
    async function fillCities(cities, option) {
        const $cityList = $('#city-list');
        $cityList.empty(); 
    
        const $cityLabel = $('label[for="city"]');
        
        $("#select-item-container-disabled").removeClass("select-item-container");
        $cityLabel.show();
        $cityList.show();
        
        const $disabled = $('<option>', {
            value: "",
            selected: true,
            disabled: true,
            text: "Выберите город"
        });
        $cityList.append($disabled);
    
        cities.forEach(city => {
            if (city.country.id == option.value) {
                const $cityListItem = $('<option>', {
                    value: city.id,
                    text: city.name
                });
                $cityList.append($cityListItem);
            }
        });
    }

    setTimeout(function() {
        fetchCountries();
    }, 100)
});

$(document).ready(function () {

    //----------------------------- PILOTS_POST -----------------------------

    $("[name='pilotForm']").one('submit', async function (event) { 
        event.preventDefault();

        var data = {
            lastName: $("[name='lastName']").val(),
            firstName: $("[name='firstName']").val(),
            middleName: $("[name='middleName']").val(),
            cityId: $("[name='city']").val(),
            city: {
              id: $("[name='city']").val(),
              name: $("[name='city'] option:selected").text(),
              countryId: $("[name='country']").val(),
              country: {
                id: $("[name='country']").val(),
                name: $("[name='country'] option:selected").text(),
              }
            }
          }

          console.log(data);
        try {
            const urls = await getApiUrls();
            console.log(urls.Pilots.Global);
            $.ajax({
                type: "POST",
                url: urls.Pilots.Global,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.Pilots.Global);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        } catch (er) {
            const urls = await getApiUrls();
            $.ajax({
                type: "POST",
                url: urls.Pilots.Local,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.Pilots.Local);
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
     });
});