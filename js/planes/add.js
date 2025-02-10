$(document).ready(function() {
    //---------------- вытягивание стран и городов для <select> -----------------
    
    function fetchCompanies() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Companies.Global;

            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fillCompanies(data);
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
    };

    function fetchPlaneTypes() {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.PlaneTypes.Global;

            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fillPlaneTypes(data);
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
    };
    
    function fetchCompaniesLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Companies.Local;

            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fillCompanies(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }
    
    function fetchPlaneTypesLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.PlaneTypes.Local;

            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fillPlaneTypes(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    async function fillCompanies(companies) {
        const $companyList = $('#company-list');
    
        companies.forEach(company => {
            const listItem = $('<option>', {
                value: company.id,
                text: company.name
            });
            $companyList.append(listItem);
        });
    }

    async function fillPlaneTypes(planeTypes) {
        const $planeTypeList = $('#plane-type-list');
    
        planeTypes.forEach(planeType => {
            const listItem = $('<option>', {
                value: planeType.id,
                text: planeType.name
            });
            $planeTypeList.append(listItem);
        });
    }
    

    setTimeout(function() {
        fetchCompanies();
        fetchPlaneTypes();
    }, 100)
});

$(document).ready(function () {

    //----------------------------- PLANES_POST -----------------------------

    $("[name='planeForm']").one('submit', async function (event) { 
        event.preventDefault();

        var data = {
            companyId: $("[name='company']").val(),
            company: {
                id: $("[name='company']").val(),
                name: $("[name='company'] option:selected").text(),
            },
            name: $("[name='name']").val(),
            tailNumber: $("[name='tailNumber']").val(),
            planeTypeId: $("[name='planeType']").val(),
            planeType: {
                id: $("[name='planeType']").val(),
                name: $("[name='planeType'] option:selected").text(),
            },
            takeoffSpeed:  parseInt($("[name='takeoffSpeed']").val()),
            cruisingSpeed: parseInt($("[name='cruisingSpeed']").val()),
            landingSpeed: parseInt($("[name='landingSpeed']").val()),
            maxAltitude: parseInt($("[name='maxAltitude']").val()),
            passengerCapacity: parseInt($("[name='passengerCapacity']").val()),
            maxSpeed: parseInt($("[name='maxSpeed']").val()),
            manufactureYear: parseInt($("[name='manufactureYear']").val()),
            lastCheckDate: $("[name='lastCheckDate']").val()
          }

          console.log(data);

        try {
            const urls = await getApiUrls();
            console.log(urls.Planes.Global);
            $.ajax({
                type: "POST",
                url: urls.Planes.Global,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.Planes.Global);
                    window.location.href = `/planes`;
                },
                error: function (error) {
                    console.log(error);
                }
            });
        } catch (er) {
            const urls = await getApiUrls();
            $.ajax({
                type: "POST",
                url: urls.Planes.Local,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.Planes.Local);
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
     });
});