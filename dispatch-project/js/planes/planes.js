$(document).ready(function() {
    function fetchPlanes() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Planes.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCompaniesToPlanes(data);
                    putPlanes(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchPlanesLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchPlanesLocal();
        });
    }

    function fetchCompaniesToPlanes(planes) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Companies.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchPlaneTypesToPlanes(planes, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }

    function fetchPlaneTypesToPlanes(planes, companies) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.PlaneTypes.Global;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayPlanes(planes, companies, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }
    
    function fetchPlanesLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Planes.Local;
    
            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchCompaniesToPlanesLocal(data);
                    putPlanes(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function fetchCompaniesToPlanesLocal(planes) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Companies.Local;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchPlaneTypesToPlanesLocal(planes, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }

    function fetchPlaneTypesToPlanesLocal(planes, companies) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.PlaneTypes.Local;
    
            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    displayPlanes(planes, companies, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
        });
    }

    function displayPlanes(planes, companies, planeTypes) {    
        const $list = $('#table');

        planes.forEach(planesData => {
            const $listItem = $('<tr>', {
                class: 'table-row'
            });

            const formSlideButton = $('<td>', {
                class: 'table-data form-slide-button',
                id: 'form-slide-button' + planesData.id
            });
    
            formSlideButton.load('/svg/downarrowkrutoy.svg', function() {
                $(this).find('svg').attr({
                    width: '15px',  
                    height: '10px'
                });
            });

            const company = $('<td>', {
                class: 'table-data',
                text: planesData.company.name
            });

            const namePlane = $('<td>', {
                class: 'table-data',
                id: 'plane-name',
                text: planesData.name
            });

            const tailNumber = $('<td>', {
                class: 'table-data',
                text: planesData.tailNumber
            });

            const planeType = $('<td>', {
                class: 'table-data',
                text: planesData.planeType.name
            });

            const takeoffSpeed = $('<td>', {
                class: 'table-data',
                text: planesData.takeoffSpeed + " kn"
            });

            const cruisingSpeed = $('<td>', {
                class: 'table-data',
                text: planesData.cruisingSpeed + " kn"
            });

            const landingSpeed = $('<td>', {
                class: 'table-data',
                text: planesData.landingSpeed + " kn"
            });

            const maxAltitude = $('<td>', {
                class: 'table-data',
                text: planesData.maxAltitude + " ft"
            });

            const passengerCapacity = $('<td>', {
                class: 'table-data',
                text: planesData.passengerCapacity + " ppl"
            });

            const maxSpeed = $('<td>', {
                class: 'table-data',
                text: planesData.maxSpeed + " kn"
            });

            const manufactureYear = $('<td>', {
                class: 'table-data',
                text: planesData.manufactureYear
            });
            
            const lastCheckDate = $('<td>', {
                class: 'table-data',
                text: planesData.lastCheckDate
            });

            const deleteButton = $('<td>', {
                class: 'table-data delete-button-td'
            }).append($('<button>', {
                class: "deleteButton btn",
                value: planesData.id,
                id: "delete-btn", 
                text: "Удалить"
            }));

            const $formItem = $('<tr>', {
                id: 'table-form-row' + planesData.id,
                class: "table-row table-form-row"
            }).append($('<td>', { 
                    class: 'table-data',
                    id: 'empty-td' + planesData.id,
                    style: 'display:none;'
            })).append($('<td>', { 
                    class: 'table-data-form table-data',
                    id: 'table-form-td' + planesData.id,
                    style: 'display:none;',
                }).append(tableFormCompanyList = $('<select>', {
                    id: 'table-form-company-list'+planesData.id,
                    class: "table-form-select",
                    style: 'display:none;',
                    name: "company"+planesData.id
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-plane-name-td'+planesData.id,
                style: 'display: none;' 
                }).append($('<input>', {
                    type: 'text',
                    name: 'name',
                    value: planesData.name,
                    id: 'input-plane-name'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-input'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-tail-number-td'+planesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'tailNumber',
                    value: planesData.tailNumber,
                    id: 'input-tail-number'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-input'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-plane-type-td'+planesData.id,
                style: 'display: none;'
                }).append(tableFormPlaneTypeList = $('<select>', {
                    id: 'table-form-plane-type-list'+planesData.id,
                        class: "table-form-select",
                        style: 'display: none;',
                        name: "planeType"+planesData.id
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-takeoff-speed-td'+planesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'takeoffSpeed',
                    value: planesData.takeoffSpeed,
                    id: 'input-takeoff-speed'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-input'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-cruising-speed-td'+planesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'cruisingSpeed',
                    value: planesData.cruisingSpeed,
                    id: 'input-cruising-speed'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-input'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-landing-speed-td'+planesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'landingSpeed',
                    value: planesData.landingSpeed,
                    id: 'input-landing-speed'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-input'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-max-altitude-td'+planesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'maxAltitude',
                    value: planesData.maxAltitude,
                    id: 'input-max-altitude'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-input'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-passenger-capacity-td'+planesData.id,
                style: 'display:none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'passengerCapacity',
                    value: planesData.passengerCapacity,
                    id: 'input-passenger-capacity'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-input'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-max-speed-td'+planesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'maxSpeed',
                    value: planesData.maxSpeed,
                    id: 'input-max-speed'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-input'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-manufacture-year-td'+planesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'text',
                    name: 'manufactureYear',
                    value: planesData.manufactureYear,
                    id: 'input-manufacture-year'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-input'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-last-check-date-td'+planesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'date',
                    name: 'lastCheckDate',
                    value: planesData.lastCheckDate,
                    id: 'input-last-check-date'+planesData.id,
                    style: 'display: none;',
                    class: 'table-form-date'
            }))).append($('<td>', {
                class: 'table-data-form table-data',
                id: 'table-submit-td'+planesData.id,
                style: 'display: none;'
                }).append($('<input>', {
                    type: 'submit',
                    name: 'submit',
                    id: 'submit' + planesData.id,
                    value: "Подтвердить",
                    style: 'display: none;',
                    class: "table-form-submit"
            }))) 

            companies.forEach(companyData => {
                const companyOption = $('<option>', {
                    id: 'company-option'+companyData.id,
                    value: companyData.id,
                    text: companyData.name
                });
                tableFormCompanyList.append(companyOption);
            });

            planeTypes.forEach(planeTypeData => {
                const planeTypeOption = $('<option>', {
                    id: 'plane-type-option'+planeTypeData.id,
                    value: planeTypeData.id,
                    text: planeTypeData.name
                });
                tableFormPlaneTypeList.append(planeTypeOption);
            });

            const $companySelect = tableFormCompanyList;
            const $planeTypeSelect = tableFormPlaneTypeList;
            const initialCompanyVal = planesData.companyId;
            const initialPlaneTypeVal = planesData.planeTypeId;

            if(initialCompanyVal) {
                $companySelect.val(initialCompanyVal);
            }

            if(initialPlaneTypeVal) {
                $planeTypeSelect.val(initialPlaneTypeVal);
            }

            $listItem.append(formSlideButton, company,namePlane,tailNumber,planeType,takeoffSpeed,cruisingSpeed,landingSpeed,maxAltitude,passengerCapacity,maxSpeed,manufactureYear,lastCheckDate, deleteButton);
            
            $list.append($listItem, $formItem);

            $("#form-slide-button" + planesData.id).click(function(){
                const isOpen = $("#empty-td" + planesData.id).is(":visible");
                $("#empty-td" + planesData.id).slideToggle("fast");
                $("#table-form-td" + planesData.id).slideToggle("fast");
                $("#table-form-company-list"+planesData.id).slideToggle("fast");
                $("#table-plane-name-td"+planesData.id).slideToggle("fast");
                $("#input-plane-name"+planesData.id).slideToggle("fast");
                $("#table-tail-number-td"+planesData.id).slideToggle("fast");
                $("#input-tail-number"+planesData.id).slideToggle("fast");
                $("#table-plane-type-td"+planesData.id).slideToggle("fast");
                $("#table-form-plane-type-list"+planesData.id).slideToggle("fast");
                $("#table-takeoff-speed-td"+planesData.id).slideToggle("fast");
                $("#input-takeoff-speed"+planesData.id).slideToggle("fast");
                $("#table-cruising-speed-td"+planesData.id).slideToggle("fast");
                $("#input-cruising-speed"+planesData.id).slideToggle("fast");
                $("#table-landing-speed-td"+planesData.id).slideToggle("fast");
                $("#input-landing-speed"+planesData.id).slideToggle("fast");
                $("#table-max-altitude-td"+planesData.id).slideToggle("fast");
                $("#input-max-altitude"+planesData.id).slideToggle("fast");
                $("#table-passenger-capacity-td"+planesData.id).slideToggle("fast");
                $("#input-passenger-capacity"+planesData.id).slideToggle("fast");
                $("#table-max-speed-td"+planesData.id).slideToggle("fast");
                $("#input-max-speed"+planesData.id).slideToggle("fast");
                $("#table-manufacture-year-td"+planesData.id).slideToggle("fast");
                $("#input-manufacture-year"+planesData.id).slideToggle("fast");
                $("#table-last-check-date-td"+planesData.id).slideToggle("fast");
                $("#input-last-check-date"+planesData.id).slideToggle("fast");
                $("#table-submit-td"+planesData.id).slideToggle("fast");
                $("#submit"+planesData.id).slideToggle("fast");
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

//----------------------------- PLANES_PUT -------------------------------

function putPlanes(planes) {
    $(document).one('click', "[name='submit']", async function (event) { 
        var elem = [];

        planes.forEach((plane) => {
            if (this.id == ('submit' + plane.id) ) {
                elem = plane;
            }
        });
        event.preventDefault();
        var data = {
            id: elem.id,
            companyId: $(`#table-form-company-list${elem.id}`).val(),
            company: {
                id: $(`#table-form-company-list${elem.id}`).val(),
                name: $(`#company-option${$(`#table-form-company-list${elem.id}`).val()}`).text(),
            },
            name: $(`#input-plane-name${elem.id}`).val(),
            tailNumber: $(`#input-tail-number${elem.id}`).val(),
            planeTypeId: $(`#table-form-plane-type-list${elem.id}`).val(),
            planeType: {
                id: $(`#table-form-plane-type-list${elem.id}`).val(),
                name: $(`#plane-type-option${$(`table-form-plane-type-list${elem.id}`).val()}`).text(),
            },
            takeoffSpeed: $(`#input-takeoff-speed${elem.id}`).val(),
            cruisingSpeed: $(`#input-cruising-speed${elem.id}`).val(),
            landingSpeed: $(`#input-landing-speed${elem.id}`).val(),
            maxAltitude: $(`#input-max-altitude${elem.id}`).val(),
            passengerCapacity: $(`#input-passenger-capacity${elem.id}`).val(),
            maxSpeed: $(`#input-max-speed${elem.id}`).val(),
            manufactureYear: $(`#input-manufacture-year${elem.id}`).val(),
            lastCheckDate: $(`#input-last-check-date${elem.id}`).val()
        };
        console.log(data);
        
        try {
            const urls = await getApiUrls();
            console.log(urls.Planes.Global);
            $.ajax({
                type: "PUT",
                url: urls.Planes.Global + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function(response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchPlanes();
                    });
                },
                error: function(error) {
                    console.log(error);
                    $.ajax({
                        type: "PUT",
                        url: urls.Planes.Local + '/' + elem.id,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (response) {
                            $("#table").load(window.location + " #table > *", function() {
                                fetchPlanes();
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
                url: urls.Planes.Local + '/' + elem.id,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    $("#table").load(window.location + " #table > *", function() {
                        fetchPlanes();
                    });
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
    });
}

//----------------------------- PLANES_DELETE -----------------------------

$(document).on("click", "#delete-btn", async function () {
    const planeId = $(this).val();
    const planeName = $("#plane-name" + planeId).text();
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        const userConfirmed = confirm("Вы уверены что хотите удалить " + planeName + "?");
        if (!userConfirmed) {
            console.log("Удаление отменено пользователем.");
            return;
        }
    }

    try {
        const urls = await getApiUrls();
        console.log("URL для удаления:", urls.Planes.Global + "/" + planeId);

        $.ajax({
            type: "DELETE",
            url: urls.Planes.Global + "/" + planeId,
            success: function (response) {
                console.log("Удаление успешно:", response);
                $("#table").load(window.location + " #table > *", function() {
                    fetchPlanes();
                });
            },
            error: function (error) {
                console.error("Ошибка при удалении с глобального URL:", error);
                $.ajax({
                    type: "DELETE",
                    url: urls.Planes.Local + "/" + planeId,
                    success: function (response) {
                        console.log("Удаление успешно с локального URL:", response);
                        $("#table").load(window.location + " #table > *", function() {
                            fetchPlanes();
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
            url: urls.Planes.Local + "/" + planeId,
            success: function (response) {
                console.log("Удаление успешно с локального URL после ошибки:", response);
                $("#table").load(window.location + " #table > *", function() {
                    fetchPlanes();
                });
            },
            error: function (error) {
                console.error("Ошибка сети при удалении с локального URL после ошибки:", error);
            }
        });
    }
});

    setTimeout(function() {
        fetchPlanes()
    }, 200)
    
});
