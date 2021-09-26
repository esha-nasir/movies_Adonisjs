import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Movie from "App/Models/Movie";
import { schema } from '@ioc:Adonis/Core/Validator';
import Application from "@ioc:Adonis/Core/Application";

export default class MoviesController {
  public async index({ view }: HttpContextContract) {
    const movies = await Movie.all();
    return view.render("auth/dashboard", {
      movies: movies,
    });
    //return view.render('/dashboard', { movies: movies})
    // return view.render('movie/update',{movie})
  }
  public async show({ params, view }: HttpContextContract) {
    //const user = await auth.authenticate();

    // if (user) {
    const movie = await Movie.find(params.id);
    return view.render("auth/update", {
      movies: movie,
    });
    // }
  }

  public async update({ request, params, response }: HttpContextContract) {
    // const user = await auth.authenticate();
    const req = await request.validate({
      schema: schema.create({
        title: schema.string(),
        description: schema.string(),
        tags: schema.string(),
      }),

      messages: {
        "title.required": "*required",
        "description.required": "*required",
        "tags.required": "*required",
      },
    });
    // if (user) {
    const movie = await Movie.find(params.id);
    if (movie) {
      movie.title = req.title;
      movie.description = req.description;
      movie.tags = req.tags;

      // movie.image = request.input('image');

      //        const movieImage = await request.file('image',{

      //         extnames: ['jpg','jpeg','png', 'gif'],
      //    })
      //    console.log("Movieeeeee==========>",movieImage);

      //    movie.image = new Date().getTime()+'.'+ movieImage?.subtype
      //     console.log("MMMMMM==========>",movie.image);
      //     if (movieImage) {
      //    console.log("==========>",movieImage);
      //         await movieImage.move(Application.tmpPath('uploads/movie'),{
      //          name : movie.image
      //      })
      //         }

      /////////////////////////
      if (await movie.save()) {
        response.redirect("/dashboard");
        // return view.render(`auth/update`, {
        //   movies: movie,
        // });
        //return movie
      }
      return; // 422
    }
    return; // 401
    //  }
  }

  public async store({ request, response }: HttpContextContract) {
    // const user = await auth.authenticate();

    const req = await request.validate({
      schema: schema.create({
        title: schema.string(),
        description: schema.string(),
        tags: schema.string(),
      }),

      messages: {
        "title.required": "*required",
        "description.required": "*required",
        "tags.required": "*required",
      },
    });

    // if (user) {
    const movie = new Movie();
    movie.title = req.title;
    movie.description = req.description;
    movie.tags = req.tags;
    // movie.image = request.file('image')

    const movieImage = await request.file("image");
    console.log("Movieeeeee==========>", movieImage);

    movie.image = new Date().getTime() + "." + movieImage?.subtype;
    console.log("MMMMMM==========>", movie.image);
    if (movieImage) {
      console.log("==========>", movieImage);
      await movieImage.move(Application.publicPath("/tmp/uploads/"), {
        name: movie.image,
      });
    }

    await movie.save();
    response.redirect("/dashboard");
    // } else {
    //   console.log("Please LogIN");
    //   return response.redirect("/dashboard");
    // }
  }
  public async destroy({ params, response }: HttpContextContract) {
    //const id = params.id;
    //const movie = await Movie.find(id);
    await Movie.query().where("id", params.id).delete();
    //await movie?.delete();

    response.redirect("/dashboard");
  }
}
