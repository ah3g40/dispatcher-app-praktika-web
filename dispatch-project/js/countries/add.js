$(document).ready(function () {

    //----------------------------- COUNTRIES_POST -----------------------------

    $("[name='countryForm']").one('submit', async function (event) { 
        event.preventDefault();

        var data = {
            name: $("[name='name']").val(),
          }

        try {
            const urls = await getApiUrls();
            console.log(urls.Countries.Global);
            $.ajax({
                type: "POST",
                url: urls.Countries.Global,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.Countries.Global);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        } catch (er) {
            const urls = await getApiUrls();
            $.ajax({
                type: "POST",
                url: urls.Countries.Local,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.Countries.Local);
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
     });
});