$(document).ready(function() {
    function fetchCarrierCompanies() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.CarrierCompanies.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCountriesToCarrierCompanies(data);
                    putCarrierCompanies(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchCarrierCompaniesLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchCarrierCompaniesLocal();
        });
    }

    function fetchCountriesToCarrierCompanies(carrierCompanies) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Countries.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayCarrierCompanies(carrierCompanies, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }

    function fetchCarrierCompaniesLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.CarrierCompanies.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchCountriesToCarrierCompaniesLocal(data);
                    putCarrierCompanies(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function fetchCountriesToCarrierCompaniesLocal(carrierCompanies) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Countries.Local;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayCarrierCompanies(carrierCompanies, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }

    function displayCarrierCompanies(carrierCompanies, countries) {    
        const $list = $('#table');

        carrierCompanies.forEach(carrierCompaniesData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });

            const formSlideButton = $('<td>', {
                class: 'table-data form-slide-button',
                id: 'form-slide-button' + carrierCompaniesData.id
            });
    
            formSlideButton.load('/svg/downarrowkrutoy.svg', function() {
                $(this).find('svg').attr({
                    width: '15px',  
                    height: '10px'
                });
            });

            const carrierCompaniesName = $('<td>', {
                class: 'table-data',
                id: 'carrier-company-name'+carrierCompaniesData.id,
                text: carrierCompaniesData.name
            });

            const country = $('<td>', {
                class: 'table-data',
                text: carrierCompaniesData.country.name
            });

            const deleteButton = $('<td>', {
                class: 'table-data delete-button-td'
            }).append($('<button>', {
                class: "deleteButton btn",
                value: carrierCompaniesData.id,
                id: "delete-btn", 
                text: "Удалить"
            }));

            const $formItem = $('<tr>', {
                id: 'table-form-row' + carrierCompaniesData.id,
                class: "table-row table-form-row"
            }).append($('<td>', { 
                    class: 'table-data',
                    id: 'empty-td' + carrierCompaniesData.id,
                    style: 'display:none;'
            })).append($('<td>', { 
                    class: 'table-data-form table-data',
                    id: 'table-form-td' + carrierCompaniesData.id,
                    style: 'display:none;',
                }).append($('<input>', {
                        type: 'text',
                        name: 'name',
                        value: carrierCompaniesData.name,
                        id: 'input-name' + carrierCompaniesData.id,
                        style: 'display: none;',
                        class: "table-form-input input-name",
            }))).append($('<td>', {
                    class: 'table-data-form table-data',
                    id: 'table-country-td'+carrierCompaniesData.id,
                    style: 'display:none'
                }).append(tableFormCountryList = $('<select>', {
                        id: 'table-form-country-list'+carrierCompaniesData.id,
                        class: 'table-form-select select-country',
                        style: 'display:none',
                        name: 'country'
            }))).append($('<td>', {
                    class: 'table-data-form table-data',
                    id: 'table-submit-td'+carrierCompaniesData.id,
                    style: 'display: none;'
                }).append($('<input>', {
                        type: 'submit',
                        name: 'submit',
                        id: 'submit' + carrierCompaniesData.id,
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
            const initialCountryVal = carrierCompaniesData.countryId;

            if(initialCountryVal){
                $countrySelect.val(initialCountryVal);
            }

            $listItem.append(formSlideButton, carrierCompaniesName, country, deleteButton);
            
            $list.append($listItem, $formItem);

            $("#form-slide-button"+carrierCompaniesData.id).click(function() {
                const isOpen = $('#empty-td'+carrierCompaniesData.id).is(":visible");
                $("#empty-td" + carrierCompaniesData.id).slideToggle("fast");
                $("#table-form-td" + carrierCompaniesData.id).slideToggle("fast");
                $("#table-country-td"+carrierCompaniesData.id).slideToggle("fast");
                $("#table-submit-td"+carrierCompaniesData.id).slideToggle("fast");
                $("#input-name"+carrierCompaniesData.id).slideToggle("fast");
                $("#table-form-country-list"+carrierCompaniesData.id).slideToggle("fast");
                $("#submit"+carrierCompaniesData.id).slideToggle("fast");
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

//---------------------------- CARRIERCOMPANIES_PUT --------------------------------------
    
function putCarrierCompanies(carrierCompanies) {
    $(document).one('click', "[name='submit']", async function (event) { 
        var elem = [];

        carrierCompanies.forEach((carrierCompany) => {
            if (this.id == ('submit' + carrierCompany.id) ) {
                elem = carrierCompany;
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
            console.log(urls.CarrierCompanies.Global);
            $.ajax({
                type: "PUT",
                url: urls.CarrierCompanies.Global + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCarrierCompanies();
                    });
                },
                error: function(error) {
                    console.log(error);
                    $.ajax({
                        type: "PUT",
                        url: urls.CarrierCompanies.Local + '/' + elem.id,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchCarrierCompanies();
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
                url: urls.CarrierCompanies.Local + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCarrierCompanies();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    });
}

//----------------------------- CARRIERCOMPANIES_DELETE -----------------------------

$(document).one("click", "#delete-btn", async function () {
    if (confirm("Вы уверены что хотите удалить " + $("#carrier-company-name" + $(this).val()).text())) {
        try {
            const urls = await getApiUrls();
            console.log(urls.CarrierCompanies.Local + "/" + $(this).val())
            $.ajax({
                type: "DELETE",
                url: urls.CarrierCompanies.Global + "/" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCarrierCompanies();
                    });
                },
                error: function (error) {
                    console.log(error);
                    $.ajax({
                        type: "DELETE",
                        url: urls.CarrierCompanies.Local + "/" + $(this).val(),
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchCarrierCompanies();
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
                url: urls.CarrierCompanies.Local + "/" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCarrierCompanies();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    }
 })

    fetchCarrierCompanies()
});
