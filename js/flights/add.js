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
                    fetchPlanes(data);
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
    };

    function fetchPlanes(carrierCompanies) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Planes.Global;

            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchAirports(carrierCompanies, data);
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
    };

    function fetchAirports(carrierCompanies, planes) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Airports.Global;

            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchPilots(carrierCompanies, planes, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchAirportsLocal();
                }
            });
        }).catch(function(error) {
            console.log("Ошибка " + error);
            fetchAirportsLocal();
        });
    };

    function fetchPilots(carrierCompanies, planes, airports) {
        getApiUrls().then(function(urls) {
            const globalUrl = urls.Pilots.Global;

            $.ajax({
                url: globalUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fillSelects(carrierCompanies, planes, airports, data);
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
    };

    function fetchCarrierCompaniesLocal() {
        getApiUrls().then(function(urls) {
            const localUrl = urls.CarrierCompanies.Local;

            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchPlanesLocal(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function fetchPlanesLocal(carrierCompanies) {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Planes.Local;

            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchAirportsLocal(carrierCompanies, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function fetchAirportsLocal(carrierCompanies, planes) {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Airports.Local;

            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fetchPilotsLocal(carrierCompanies, planes, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    function fetchPilotsLocal(carrierCompanies, planes, airports) {
        getApiUrls().then(function(urls) {
            const localUrl = urls.Pilots.Local;

            $.ajax({
                url: localUrl,
                method: 'GET',
                success: function(data) {
                    fillSelects(carrierCompanies, planes, airports, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log("Ошибка: " + textStatus);
                }
            });
        }).catch(function(error) {
            console.log("Ошибка: " + error);
        });
    }

    async function fillSelects(carrierCompanies, planes, airports, pilots) {
        const $carrierCompanyList = $('#carrier-company-list');
        const $planeList = $('#plane-list');
        const $airportFromList = $('#airport-from-list');
        const $airportToList = $('#airport-to-list');
        const $captainList = $('#captain-list');
        const $pilotList = $('#pilot-list');
    
        carrierCompanies.forEach(carrierCompany => {
            const listItem = $('<option>', {
                value: carrierCompany.id,
                text: carrierCompany.name
            });
            $carrierCompanyList.append(listItem);
        });
        planes.forEach(plane => {
            const listItem = $('<option>', {
                value: plane.id,
                text: plane.company.name+" "+plane.name+" "+plane.tailNumber
            });
            $planeList.append(listItem);
        });
        airports.forEach(airport => {
            const listItem = $('<option>', {
                value: airport.id,
                text: airport.name
            });
            $airportFromList.append(listItem);
        });
        airports.forEach(airport => {
            const listItem = $('<option>', {
                value: airport.id,
                text: airport.name
            });
            $airportToList.append(listItem);
        });
        pilots.forEach(pilot => {
            const listItem = $('<option>', {
                value: pilot.id,
                text: pilot.lastName+" "+pilot.firstName+" "+pilot.middleName
            });
            $captainList.append(listItem);
        });pilots.forEach(pilot => {
            const listItem = $('<option>', {
                value: pilot.id,
                text: pilot.lastName+" "+pilot.firstName+" "+pilot.middleName
            });
            $pilotList.append(listItem);
        });
    }

    fetchCarrierCompanies();
    setTimeout(function() {
    }, 200)

    
// ДОДЕЛАТЬ
// ДОДЕЛАТЬ
// ДОДЕЛАТЬ
// ДОДЕЛАТЬ
// ДОДЕЛАТЬ
    //----------------------------- FLIGHTS_POST -----------------------------

    $("[name='flightForm']").one('submit', async function (event) { 
        event.preventDefault();

        function fetchCurrentPlane() {
            getApiUrls().then(function(urls) {
            const globalPlanesUrl = urls.Planes.Global + "/"+$("[name='plane']").val();
            $.ajax({
                url: globalPlanesUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCurrentAirportFrom(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    fetchCurrentPlaneLocal();
                }
            });
        })};

        function fetchCurrentAirportFrom(currentPlane) {
            getApiUrls().then(function(urls) {
            const globalAirportsFromUrl = urls.Airports.Global + "/"+$("[name='airportFrom']").val();
            $.ajax({
                url: globalAirportsFromUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCurrentAirportTo(currentPlane, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                    data = 0;
                    fetchCurrentAirportTo(currentPlane, data);
                }
            });
        })};

        function fetchCurrentAirportTo(currentPlane, currentAirportFrom) {
            getApiUrls().then(function(urls) {
            const globalAirportsToUrl = urls.Airports.Global + "/"+$("[name='airportTo']").val();
            $.ajax({
                url: globalAirportsToUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCurrentCaptain(currentPlane, currentAirportFrom, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        })};

        function fetchCurrentCaptain(currentPlane, currentAirportFrom, currentAirportTo) {
            getApiUrls().then(function(urls) {
            const globalCaptainUrl = urls.Pilots.Global + "/"+$("[name='captain']").val();
            $.ajax({
                url: globalCaptainUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCurrentPilot(currentPlane, currentAirportFrom, currentAirportTo ,data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        })};

        function fetchCurrentPilot(currentPlane, currentAirportFrom, currentAirportTo, currentCaptain) {
            getApiUrls().then(function(urls) {
            const globalPilotUrl = urls.Pilots.Global + "/"+$("[name='pilot']").val();
            $.ajax({
                url: globalPilotUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    PostFlight(currentPlane, currentAirportFrom, currentAirportTo , currentCaptain,data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        })};

        function fetchCurrentPlaneLocal() {
            getApiUrls().then(function(urls) {
            const localPlanesUrl = urls.Planes.Local + "/"+$("[name='plane']").val();
            $.ajax({
                url: localPlanesUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCurrentAirportFromLocal(data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        })};
        
        function fetchCurrentAirportFromLocal(currentPlane) {
            getApiUrls().then(function(urls) {
            const localAirportsFromUrl = urls.Airports.Local + "/"+$("[name='airportFrom']").val();
            $.ajax({
                url: localAirportsFromUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCurrentAirportToLocal(currentPlane, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        })};

        function fetchCurrentAirportToLocal(currentPlane, currentAirportFrom) {
            getApiUrls().then(function(urls) {
            const localAirportsToUrl = urls.Airports.local + "/"+$("[name='airportTo']").val();
            $.ajax({
                url: localAirportsToUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCurrentCaptainLocal(currentPlane, currentAirportFrom, data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        })};

        function fetchCurrentCaptainLocal(currentPlane, currentAirportFrom, currentAirportTo) {
            getApiUrls().then(function(urls) {
            const localCaptainUrl = urls.Pilots.Local + "/"+$("[name='captain']").val();
            $.ajax({
                url: localCaptainUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    fetchCurrentPilotLocal(currentPlane, currentAirportFrom, currentAirportTo ,data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        })};

        function fetchCurrentPilotLocal(currentPlane, currentAirportFrom, currentAirportTo, currentCaptain) {
            getApiUrls().then(function(urls) {
            const localPilotUrl = urls.Pilots.Local + "/"+$("[name='pilot']").val();
            $.ajax({
                url: localPilotUrl,
                method: 'GET',
                timeout: 500,
                success: function(data) {
                    console.log(data);
                    PostFlight(currentPlane, currentAirportFrom, currentAirportTo , currentCaptain,data);
                },
                error: function(jqXHR, textStatus) {
                    console.log('Ошибка сети: ' + textStatus);
                }
            });
        })};
        
        async function PostFlight(currentPlane, currentAirportFrom, currentAirportTo, currentCaptain, currentPilot) {
        if (currentAirportFrom == 0 || currentAirportFrom == null) {
            getApiUrls().then(function(urls) {
                const flightsHistoryGlobalUrl = urls.FlightsHistory.Global+"/details?number="+currentPlane.tailNumber;
                $.ajax ({
                    url: flightsHistoryGlobalUrl,
                    method: 'GET',
                    timeout: 500,
                    success: async function(data) {
                        var flight = {
                        carrierCompanyId: $("[name='carrierCompany']").val(),
                        carrierCompany: {
                            id: $("[name='carrierCompany']").val(),
                            name: $("[name='carrierCompany'] option:selected").text(),
                        },
                        planeId: $("[name='plane']").val(),
                        plane: {
                            id: $("[name='plane']").val(),
                            companyId: currentPlane.companyId,
                            company: {
                                id: currentPlane.company.id,
                                name: currentPlane.company.name
                            },
                            name: currentPlane.name,
                            tailNumber: currentPlane.tailNumber,
                            planeTypeId: currentPlane.planeTypeId,
                            planeType: {
                                id: currentPlane.planeType.id,
                                name: currentPlane.planeType.name
                            },
                            takeoffSpeed: currentPlane.takeoffSpeed,
                            cruisingSpeed: currentPlane.cruisingSpeed,
                            landingSpeed: currentPlane.landingSpeed,
                            maxAltitude: currentPlane.maxAltitude,
                            passengerCapacity: currentPlane.passengerCapacity,
                            maxSpeed: currentPlane.maxSpeed,
                            manufactureYear: currentPlane.manufactureYear,
                            lastCheckDate: currentPlane.lastCheckDate
                        },
                        from: data.airportTo.id,
                        airportFrom: {
                            id: data.airportTo.id,
                            name: data.airportTo.name,
                            icao: data.airportTo.icao,
                            iata: data.airportTo.iata,
                            cityId: data.airportTo.cityId,
                            city: {
                                id: data.airportTo.city.id,
                                name: data.airportTo.city.name,
                                countryId: data.airportTo.city.countryId,
                                country: {
                                    id: data.airportTo.city.country.id,
                                    name: data.airportTo.city.country.name
                                }
                            },
                            latitude: data.airportTo.latitude,
                            longitude: data.airportTo.longitude
                        },
                        to: $("[name='airportTo']").val(),
                        airportTo: {
                            id: $("[name='airportTo']").val(),
                            name: currentAirportTo.name,
                            icao: currentAirportTo.icao,
                            iata: currentAirportTo.iata,
                            cityId: currentAirportTo.cityId,
                            city: {
                                id: currentAirportTo.city.id,
                                name: currentAirportTo.city.name,
                                countryId: currentAirportTo.city.countryId,
                                country: {
                                    id: currentAirportTo.city.country.id,
                                    name: currentAirportTo.city.country.name
                                }
                            },
                            latitude: currentAirportTo.latitude,
                            longitude: currentAirportTo.longitude
                        },
                        captainId: $("[name='captain']").val(),
                        captain: {
                            id: $("[name='captain']").val(),
                            lastName: currentCaptain.lastName,
                            firstName: currentCaptain.firstName,
                            middleName: currentCaptain.middleName,
                            cityId: currentCaptain.cityId,
                            city: {
                                id: currentCaptain.city.id,
                                name: currentCaptain.city.name,
                                countryId: currentCaptain.city.countryId,
                                country: {
                                    id: currentCaptain.city.country.id,
                                    name: currentCaptain.city.country.name
                                }
                            }
                        },
                        pilotId: $("[name='pilot']").val(),
                        pilot: {
                            id: $("[name='pilot']").val(),
                            lastName: currentPilot.lastName,
                            firstName: currentPilot.firstName,
                            middleName: currentPilot.middleName,
                            cityId: currentPilot.cityId,
                            city: {
                                id: currentPilot.city.id,
                                name: currentPilot.city.name,
                                countryId: currentPilot.city.countryId,
                                country: {
                                    id: currentPilot.city.country.id,
                                    name: currentPilot.city.country.name
                                }
                            }
                        },
                        fullness: $("[name='fullness']").val(),
                        departureDate: $("[name='departureDate']").val()+"T"+$("[name='departureTime']").val(),
                        arrivalDate: $("[name='arrivalDate']").val()+"T"+$("[name='arrivalTime']").val(),
                        altitude: 0,
                        speed: 0,
                        verticalSpeed: 0,
                        course: 0,
                        latitude: 0,
                        longitude: 0,
                        distanceBetweenAirportsKm: 0,
                        distanceBetweenAirportsM: 0
                    };

                    console.log(flight);

                    try {
                        const urls = await getApiUrls();
                        console.log(urls.Flights.Global);
                        $.ajax({
                            type: "POST",
                            url: urls.Flights.Global,
                            data: JSON.stringify(flight),
                            contentType: "application/json",
                            success: function (response) {
                                console.log("Данные отправлены на " + urls.Flights.Global);
                                window.location.href = `/`;
                            },
                            error: function (error) {
                                console.log(error);
                            }
                        });
                    } catch (er) {
                        const urls = await getApiUrls();
                        $.ajax({
                            type: "POST",
                            url: urls.Flights.Local,
                            data: JSON.stringify(flight),
                            contentType: "application/json",
                            success: function (response) {
                                console.log("Данные отправлены на " + urls.Flights.Local);
                                window.location.href = `/`;
                            },
                            error: function (error) {
                                console.log("Ошибка сети");
                            }
                        });
                    }
                    }
                    
                })
            })
                
        } 
        
        else {
            var flight = {
                carrierCompanyId: $("[name='carrierCompany']").val(),
                carrierCompany: {
                    id: $("[name='carrierCompany']").val(),
                    name: $("[name='carrierCompany'] option:selected").text(),
                },
                planeId: $("[name='plane']").val(),
                plane: {
                    id: $("[name='plane']").val(),
                    companyId: currentPlane.companyId,
                    company: {
                        id: currentPlane.company.id,
                        name: currentPlane.company.name
                    },
                    name: currentPlane.name,
                    tailNumber: currentPlane.tailNumber,
                    planeTypeId: currentPlane.planeTypeId,
                    planeType: {
                        id: currentPlane.planeType.id,
                        name: currentPlane.planeType.name
                    },
                    takeoffSpeed: currentPlane.takeoffSpeed,
                    cruisingSpeed: currentPlane.cruisingSpeed,
                    landingSpeed: currentPlane.landingSpeed,
                    maxAltitude: currentPlane.maxAltitude,
                    passengerCapacity: currentPlane.passengerCapacity,
                    maxSpeed: currentPlane.maxSpeed,
                    manufactureYear: currentPlane.manufactureYear,
                    lastCheckDate: currentPlane.lastCheckDate
                },
                from: $("[name='airportFrom']").val(),
                airportFrom: {
                    id: $("[name='airportFrom']").val(),
                    name: currentAirportFrom.name,
                    icao: currentAirportFrom.icao,
                    iata: currentAirportFrom.iata,
                    cityId: currentAirportFrom.cityId,
                    city: {
                        id: currentAirportFrom.city.id,
                        name: currentAirportFrom.city.name,
                        countryId: currentAirportFrom.city.countryId,
                        country: {
                            id: currentAirportFrom.city.country.id,
                            name: currentAirportFrom.city.country.name
                        }
                    },
                    latitude: currentAirportFrom.latitude,
                    longitude: currentAirportFrom.longitude
                },
                to: $("[name='airportTo']").val(),
                airportTo: {
                    id: $("[name='airportTo']").val(),
                    name: currentAirportTo.name,
                    icao: currentAirportTo.icao,
                    iata: currentAirportTo.iata,
                    cityId: currentAirportTo.cityId,
                    city: {
                        id: currentAirportTo.city.id,
                        name: currentAirportTo.city.name,
                        countryId: currentAirportTo.city.countryId,
                        country: {
                            id: currentAirportTo.city.country.id,
                            name: currentAirportTo.city.country.name
                        }
                    },
                    latitude: currentAirportTo.latitude,
                    longitude: currentAirportTo.longitude
                },
                captainId: $("[name='captain']").val(),
                captain: {
                    id: $("[name='captain']").val(),
                    lastName: currentCaptain.lastName,
                    firstName: currentCaptain.firstName,
                    middleName: currentCaptain.middleName,
                    cityId: currentCaptain.cityId,
                    city: {
                        id: currentCaptain.city.id,
                        name: currentCaptain.city.name,
                        countryId: currentCaptain.city.countryId,
                        country: {
                            id: currentCaptain.city.country.id,
                            name: currentCaptain.city.country.name
                        }
                    }
                },
                pilotId: $("[name='pilot']").val(),
                pilot: {
                    id: $("[name='pilot']").val(),
                    lastName: currentPilot.lastName,
                    firstName: currentPilot.firstName,
                    middleName: currentPilot.middleName,
                    cityId: currentPilot.cityId,
                    city: {
                        id: currentPilot.city.id,
                        name: currentPilot.city.name,
                        countryId: currentPilot.city.countryId,
                        country: {
                            id: currentPilot.city.country.id,
                            name: currentPilot.city.country.name
                        }
                    }
                },
                fullness: $("[name='fullness']").val(),
                departureDate: $("[name='departureDate']").val()+"T"+$("[name='departureTime']").val(),
                arrivalDate: $("[name='arrivalDate']").val()+"T"+$("[name='arrivalTime']").val(),
                altitude: 0,
                speed: 0,
                verticalSpeed: 0,
                course: 0,
                latitude: 0,
                longitude: 0,
                distanceBetweenAirportsKm: 0,
                distanceBetweenAirportsM: 0
            }
            console.log(data);
            try {
                const urls = await getApiUrls();
                console.log(urls.Flights.Global);
                $.ajax({
                    type: "POST",
                    url: urls.Flights.Global,
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (response) {
                        console.log("Данные отправлены на " + urls.Flights.Global);
                        window.location.href = `/`;
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            } catch (er) {
                const urls = await getApiUrls();
                $.ajax({
                    type: "POST",
                    url: urls.Flights.Local,
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: function (response) {
                        console.log("Данные отправлены на " + urls.Flights.Local);
                        window.location.href = `/`;
                    },
                    error: function (error) {
                        console.log("Ошибка сети");
                    }
                });
            }
        }    

        

        // try {
        //     const urls = await getApiUrls();
        //     console.log(urls.Flights.Global);
        //     $.ajax({
        //         type: "POST",
        //         url: urls.Flights.Global,
        //         data: JSON.stringify(data),
        //         contentType: "application/json",
        //         success: function (response) {
        //             console.log("Данные отправлены на " + urls.Flights.Global);
        //             window.location.href = `/`;
        //         },
        //         error: function (error) {
        //             console.log(error);
        //         }
        //     });
        // } catch (er) {
        //     const urls = await getApiUrls();
        //     $.ajax({
        //         type: "POST",
        //         url: urls.Flights.Local,
        //         data: JSON.stringify(data),
        //         contentType: "application/json",
        //         success: function (response) {
        //             console.log("Данные отправлены на " + urls.Flights.Local);
        //             window.location.href = `/`;
        //         },
        //         error: function (error) {
        //             console.log("Ошибка сети");
        //         }
        //     });
        // }
        
        }
        fetchCurrentPlane();
    })});
   