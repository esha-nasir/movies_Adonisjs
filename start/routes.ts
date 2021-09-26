import Route from "@ioc:Adonis/Core/Route";

Route.on("/").render("auth/welcome").middleware("guest");
Route.on("/signUp").render("auth/signUp").middleware("guest");
Route.on("/logIn").render("auth/logIn").middleware("guest");
Route.on("/movie/update/").render("auth/update").middleware("guest");

Route.post("/signUp", "AuthController.signup");

Route.post("/logIn", "AuthController.login");
Route.post("/logOut", "AuthController.logout").middleware("auth");
Route.on("/movie/store").render("auth/create");

Route.get("/dashboard", "MoviesController.index").middleware("auth");
Route.get("/movie/show/:id", "MoviesController.show").middleware("auth");
Route.post("/movie/store/", "MoviesController.store").middleware("auth");
Route.post("/movie/update/:id", "MoviesController.update").middleware("auth");
Route.get("/delete/:id", "MoviesController.destroy").as("Movie.destroy");

//Route.on('/dashboard').render('auth/dashboard').middleware('auth')
