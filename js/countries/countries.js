// countries.js

$(document).ready(function() {
    function fetchCountries() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Countries.Global;

            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayCountries(data);
                    putCountries(data);
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
                    displayCountries(data);
                    putCountries(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function displayCountries(countries) {    
        const $list = $('#table');

        countries.forEach(countriesData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });
            
            const formSlideButton = $('<td>', {
                class: 'table-data form-slide-button',
                id: 'form-slide-button' + countriesData.id
            });

            formSlideButton.load('/svg/downarrowkrutoy.svg', function() {
                $(this).find('svg').attr({
                    width: '15px',  
                    height: '10px'
                });
            });

            const country = $('<td>', {
                class: 'table-data',
                id: 'country-name'+countriesData.id,
                text: countriesData.name
            });

            const deleteButton = $('<td>', {
                class: 'table-data delete-button-td'
            }).append($('<button>', {
                class: "deleteButton btn",
                value: countriesData.id,
                id: "delete-btn", 
                text: "Удалить"
            }));

            const $formItem = $('<tr>', {
                id: 'table-form-row' + countriesData.id,
                class: "table-row table-form-row"
            }).append($('<td>', {
                class: 'table-data',
                id: 'empty-td' + countriesData.id,
                style: 'display:none;'
            })).append($('<td>', { 
                class: 'table-data-form table-data',
                id: 'table-form-td' + countriesData.id,
                style: 'display:none;',
            }).append($('<input>', {
                    type: 'text',
                    name: 'name',
                    value: countriesData.name,
                    id: 'input-name' + countriesData.id,
                    style: 'display: none;',
                    class: "table-form-input input-name",
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-submit-td'+countriesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'submit',
                    name: 'submit',
                    id: 'submit' + countriesData.id,
                    value: "Подтвердить",
                    style: 'display: none;',
                    class: "table-form-submit"
            })));

            $listItem.append(formSlideButton, country, deleteButton);
            
            $list.append($listItem, $formItem);

            $("#form-slide-button"+countriesData.id).click(function() {
                const isOpen = $("#empty-td"+countriesData.id).is("visible");
                $("#empty-td" + countriesData.id).slideToggle("fast");
                $("#table-form-td" + countriesData.id).slideToggle("fast");
                $("#table-submit-td" + countriesData.id).slideToggle("fast");
                $("#input-name"+countriesData.id).slideToggle("fast");
                $("#submit"+countriesData.id).slideToggle("fast");
                if(isOpen) {
                    $(this).find('svg').removeClass('rotate');
                    $(this).find('svg').addClass('rotate-back');
                } else {
                    $(this).find('svg').removeClass('rotate-back');
                    $(this).find('svg').addClass('rotate');
                }
                
            });

        });
    }
    



    //---------------------------- COUNTRIES-PUT --------------------------------------
    
    function putCountries(countries) {
        $(document).one('click', "[name='submit']", async function(event) {
            var elem = [];

            countries.forEach((country) => {
                if(this.id == ('submit'+country.id)) {
                    elem = country;
                }
            });
            event.preventDefault();
            var data = {
                id: elem.id,
                name: $(`#input-name${elem.id}`).val()
            };
            console.log(data);

            try {
                const urls = await getApiUrls();
                console.log(urls.Countries.Global);
                $.ajax({
                    type: "PUT",
                    url: urls.Countries.Global + '/' + elem.id,
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function(response) {
                        $("#table").load(window.location + " #table > *", function() {
                            fetchCountries();
                        });
                    },
                    error: function(error) {
                        console.log(error);
                        $.ajax({
                            type: "PUT",
                            url: urls.Countries.Local + '/' + elem.id,
                            data: JSON.stringify(data),
                            contentType: "application/json",
                            success: function (response) {
                                $("#table").load(window.location + " #table > *", function() {
                                    fetchCountries();
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
                    url: urls.Countries.Local + '/' + elem.id,
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (response) {
                        $("#table").load(window.location + " #table > *", function() {
                            fetchCountries();
                        });
                    },
                    error: function (error) {
                        console.log("Ошибка сети");
                    }
                });
            }
        });
        
    }
//-------------------------- COUNTRIES_DELETE ---------------------------------------------

$(document).one("click", "#delete-btn", async function () {
    if (confirm("Вы уверены что хотите удалить " + $("#country-name" + $(this).val()).text())) {
        try {
            const urls = await getApiUrls();
            console.log(urls.Countries.Local + "/" + $(this).val())
            $.ajax({
                type: "DELETE",
                url: urls.Countries.Global + "/" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCountries();
                    });
                },
                error: function (error) {
                    console.log(error);
                    $.ajax({
                        type: "DELETE",
                        url: urls.Countries.Local + "/" + $(this).val(),
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchCountries();
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
                url: urls.Countries.Local + "/" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCountries();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    }
 })
 
fetchCountries()
});
