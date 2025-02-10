$(document).ready(function () {

    //----------------------------- COMPANIES_POST -----------------------------

    $("[name='companyForm']").one('submit', async function (event) { 
        event.preventDefault();

        var data = {
            name: $("[name='name']").val(),
          }

        try {
            const urls = await getApiUrls();
            console.log(urls.Companies.Global);
            $.ajax({
                type: "POST",
                url: urls.Companies.Global,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.Companies.Global);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        } catch (er) {
            const urls = await getApiUrls();
            $.ajax({
                type: "POST",
                url: urls.Companies.Local,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.Companies.Local);
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
        }
     });
});