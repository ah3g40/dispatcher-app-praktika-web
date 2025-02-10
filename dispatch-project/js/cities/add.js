$(document).ready(function () {

//---------------------- Вытягивание стран для <select> ----------------------

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
}

setTimeout(function() {
    fetchCountries();
}, 100)
});

$(document).ready(function() {

//---------------------------------- CITIES_POST ----------------------------

$("[name='cityForm']").one('submit', async function (event) { 
    event.preventDefault();

    var data = {
        name: $("[name='name']").val(),
        countryId: $("[name='country']").val(),
          country: {
            id: $("[name='country']").val(),
            name: $("[name='country'] option:selected").text()
          }
      }

      console.log(data);
    try {
        const urls = await getApiUrls();
        console.log(urls.Cities.Global);
        $.ajax({
            type: "POST",
            url: urls.Cities.Global,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (response) {
                console.log("Данные отправлены на " + urls.Cities.Global);
            },
            error: function (error) {
                console.log(error);
            }
        });
    } catch (er) {
        const urls = await getApiUrls();
        $.ajax({
            type: "POST",
            url: urls.Cities.Local,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (response) {
                console.log("Данные отправлены на " + urls.Cities.Local);
            },
            error: function (error) {
                console.log("Ошибка сети");
            }
        });
    }
 });
});