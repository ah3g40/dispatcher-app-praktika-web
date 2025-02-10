$(document).ready(function() {
    function fetchCompanies() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Companies.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayCompanies(data);
                    putCompanies(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchCompaniesLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchCompaniesLocal();
        });
    }
    
    function fetchCompaniesLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Companies.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    displayCompanies(data);
                    putCompanies(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function displayCompanies(companies) {    
        const $list = $('#table');

        companies.forEach(companiesData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });

            const formSlideButton = $('<td>', {
                class: 'table-data form-slide-button',
                id: 'form-slide-button' + companiesData.id
            });
    
            formSlideButton.load('/svg/downarrowkrutoy.svg', function() {
                $(this).find('svg').attr({
                    width: '15px',  
                    height: '10px'
                });
            });

            const company = $('<td>', {
                class: 'table-data',
                id: 'company-name'+companiesData.id,
                text: companiesData.name
            });

            const deleteButton = $('<td>', {
                class: 'table-data delete-button-td'
            }).append($('<button>', {
                class: "deleteButton btn",
                value: companiesData.id,
                id: "delete-btn", 
                text: "Удалить"
            }));

            const $formItem = $('<tr>', {
                id: 'table-form-row' + companiesData.id,
                class: "table-row table-form-row"
            }).append($('<td>', { 
                    class: 'table-data',
                    id: 'empty-td' + companiesData.id,
                    style: 'display:none;'
            })).append($('<td>', { 
                    class: 'table-data-form table-data',
                    id: 'table-form-td' + companiesData.id,
                    style: 'display:none;',
                }).append($('<input>', {
                        type: 'text',
                        name: 'name',
                        value: companiesData.name,
                        id: 'input-name' + companiesData.id,
                        style: 'display: none;',
                        class: "table-form-input input-name",
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-submit-td'+companiesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'submit',
                    name: 'submit',
                    id: 'submit' + companiesData.id,
                    value: "Подтвердить",
                    style: 'display: none;',
                    class: "table-form-submit"
            })))

            $listItem.append(formSlideButton, company, deleteButton);
            
            $list.append($listItem, $formItem);

            $("#form-slide-button"+companiesData.id).click(function() {
                const isOpen = $("#empty-td"+companiesData.id).is("visible");
                $("#empty-td" + companiesData.id).slideToggle("fast");
                $("#table-form-td" + companiesData.id).slideToggle("fast");
                $("#table-submit-td" + companiesData.id).slideToggle("fast");
                $("#input-name"+companiesData.id).slideToggle("fast");
                $("#submit"+companiesData.id).slideToggle("fast");
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

//------------------------------ COMPANIES_PUT ----------------------------

function putCompanies(companies) {

    $(document).one('click', "[name='submit']", async function(event) {
        var elem = [];

        companies.forEach((company) =>{
            if(this.id == ('submit'+company.id)) {
                elem = company;
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
            console.log(urls.Companies.Global);
            $.ajax({
                type: "PUT",
                url: urls.Companies.Global + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCompanies();
                    });
                },
                error: function(error) {
                    console.log(error);
                    $.ajax({
                        type: "PUT",
                        url: urls.Companies.Local + '/' + elem.id,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchCompanies();
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
                url: urls.Companies.Local + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCompanies();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    })
}

//-------------------------- COMPANIES_DELETE ---------------------------------------------

$(document).one("click", "#delete-btn", async function () {
    if (confirm("Вы уверены что хотите удалить " + $("#company-name" + $(this).val()).text())) {
        try {
            const urls = await getApiUrls();
            console.log(urls.Companies.Local + "/" + $(this).val())
            $.ajax({
                type: "DELETE",
                url: urls.Companies.Global + "/" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCompanies();
                    });
                },
                error: function (error) {
                    console.log(error);
                    $.ajax({
                        type: "DELETE",
                        url: urls.Companies.Local + "/" + $(this).val(),
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchCompanies();
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
                url: urls.Companies.Local + "/" + $(this).val(),
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchCompanies();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    }
 })

    fetchCompanies()
});
