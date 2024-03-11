module.exports = function(app) {
    app.get("/authors/", function(req, res) {

        let authors = [{
            "name": "autor1",
            "group": "grupo1",
            "rol": "cantante"
        }, {
            "name": "autor2",
            "group": "grupo2",
            "rol": "cantante"
        }, {
            "name": "autor3",
            "group": "grupo3",
            "rol": "cantante"
        }, {
            "name": "autor4",
            "group": "grupo4",
            "rol": "cantante"
        }];

        let response = {
            authors: authors
        };
        res.render("authors/authors.twig", response);
    });



    app.get('/authors/add', function (req, res) {
        res.render("authors/add.twig");
    });


    app.post('/authors/add', function(req, res) {
        let response = "--- Autor ---" + "<br>";

        // nombre
        if(req.body.name != null && typeof(req.body.name) != "undefined" && req.body.name != "")
            response += "Nombre: " + req.body.name + "<br>";
        else
            response += "Nombre no enviado en la petición" + "<br>";

        // grupo
        if(req.body.group != null && typeof(req.body.group) != "undefined" && req.body.group != "")
            response += "Grupo: " + req.body.group + "<br>";
        else
            response += "Grupo no enviado en la petición" + "<br>";

        // rol
        if(req.body.rol != null && typeof(req.body.rol) != "undefined" && req.body.rol != "")
            response += "Rol: " + req.body.rol + "<br>";
        else
            response += "Rol no enviado en la petición" + "<br>";


        res.send(response);
    });


    // redirects -> a urls
    // senders -> a plantillas

    app.get('/authors/*', function (req, res) {
        res.redirect("/authors/");
    });




};