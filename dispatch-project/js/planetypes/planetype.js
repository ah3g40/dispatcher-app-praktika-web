$(document).ready(function() {
    function fetchPlaneTypes() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.PlaneTypes.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayPlaneTypes(data);
                    putPlaneTypes(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchPlaneTypesLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchPlaneTypesLocal();
        });
    }
    
    function fetchPlaneTypesLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.PlaneTypes.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    displayPlaneTypes(data);
                    putPlaneTypes(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function displayPlaneTypes(planeTypes) {    
        const $list = $('#table');

        planeTypes.forEach(planeTypesData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });

            const formSlideButton = $('<td>', {
                class: 'table-data form-slide-button',
                id: 'form-slide-button' + planeTypesData.id
            });

            formSlideButton.load('/svg/downarrowkrutoy.svg', function() {
                $(this).find('svg').attr({
                    width: '15px',  
                    height: '10px'
                });
            });

            const name = $('<td>', {
                class: 'table-data',
                name: 'plane-type-name'+planeTypesData.id,
                id: 'plane-type-name'+planeTypesData.id,
                text: planeTypesData.name
            });

            const deleteButton = $('<td>', {
                class: 'table-data delete-button-td'
            }).append($('<button>', {
                class: "deleteButton btn",
                value: planeTypesData.id,
                id: "delete-btn", 
                text: "Удалить"
            }));

            const $formItem = $('<tr>', {
                id: 'table-form-row' + planeTypesData.id,
                class: "table-row table-form-row"
            }).append($('<td>', {
                class: 'table-data',
                id: 'empty-td' + planeTypesData.id,
                style: 'display:none;'
            })).append($('<td>', { 
                class: 'table-data-form table-data',
                id: 'table-form-td' + planeTypesData.id,
                style: 'display:none;',
            }).append($('<input>', {
                    type: 'text',
                    name: 'name',
                    value: planeTypesData.name,
                    id: 'input-name' + planeTypesData.id,
                    style: 'display: none;',
                    class: "table-form-input input-name",
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-submit-td'+planeTypesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'submit',
                    name: 'submit',
                    id: 'submit' + planeTypesData.id,   
                    value: "Подтвердить",
                    style: 'display: none;',
                    class: "table-form-submit"
            })));

            $listItem.append(formSlideButton, name, deleteButton);
            
            $list.append($listItem, $formItem);

            $("#form-slide-button"+planeTypesData.id).click(function() {
                const isOpen = $("#empty-td"+planeTypesData.id).is("visible");
                $("#empty-td" + planeTypesData.id).slideToggle("fast");
                $("#table-form-td" + planeTypesData.id).slideToggle("fast");
                $("#table-submit-td" + planeTypesData.id).slideToggle("fast");
                $("#input-name"+planeTypesData.id).slideToggle("fast");
                $("#submit"+planeTypesData.id).slideToggle("fast");
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
//---------------------------- PLANETYPES-PUT --------------------------------------
    
function putPlaneTypes(planeTypes) {
    $(document).one('click', "[name='submit']", async function(event) {
        var elem = [];

        planeTypes.forEach((planeType) => {
            if(this.id == ('submit'+planeType.id)) {
                elem = planeType;
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
            console.log(urls.PlaneTypes.Global);
            $.ajax({
                type: "PUT",
                url: urls.PlaneTypes.Global + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchPlaneTypes();
                    });
                },
                error: function(error) {
                    console.log(error);
                    $.ajax({
                        type: "PUT",
                        url: urls.PlaneTypes.Local + '/' + elem.id,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchPlaneTypes();
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
                url: urls.PlaneTypes.Local + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchPlaneTypes();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    });
    
}

//-------------------------------- PLANETYPES_DELETE ------------------------

$(document).one("click", "#delete-btn", async function () {
    if (confirm("Вы уверены что хотите удалить " + $("#plane-type-name" + $(this).val()).text())) {
        const id = $(this).val();
        try {
            const urls = await getApiUrls();
            console.log(urls.PlaneTypes.Local + "/" + $(this).val())
            $.ajax({
                type: "DELETE",
                url: urls.PlaneTypes.Global + "/" + id,
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchPlaneTypes();
                    });
                },
                error: function (error) {
                    console.log(error);
                    $.ajax({
                        type: "DELETE",
                        url: urls.PlaneTypes.Local + "/" + id,
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchPlaneTypes();
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
                url: urls.PlaneTypes.Local + "/" + id,
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchPlaneTypes();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    }
 })

    fetchPlaneTypes()
});
