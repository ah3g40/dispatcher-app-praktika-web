$(document).ready(function () {

    //-------------------------- PLANETYPES_POST -----------------------------

    $("[name='planeTypeForm']").one('submit', async function (event) { 
        event.preventDefault();

        var data = {
            name: $("[name='name']").val(),
          }

            const urls = await getApiUrls();
            console.log(urls.PlaneTypes.Global);
            $.ajax({
                type: "POST",
                url: urls.PlaneTypes.Global,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.PlaneTypes.Global);
                },
                error: async function (error) {
                    console.log(error);
                    const urls = await getApiUrls();
            $.ajax({
                type: "POST",
                url: urls.PlaneTypes.Local,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    console.log("Данные отправлены на " + urls.PlaneTypes.Local);
                },
                error: function (error) {
                    console.log("Ошибка сети");
                }
            });
                }
            });
     });
});