import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema,rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';

export default class AuthController {
    public async signup({request, response, session}: HttpContextContract){
        const req = await request.validate({
          schema: schema.create({
            name: schema.string({}, [
              rules.maxLength(15),
              rules.minLength(8),
              rules.alpha({
                allow: ["space"],
              }),
            ]),
            email: schema.string({}, [
              rules.email(),
              rules.unique({ table: "users", column: "email" }),
            ]),
            password: schema.string({}, [
              rules.confirmed(),
              rules.minLength(8),
            ]),
          }),

          messages: {
            "name.required": "Name is required to sign up",
            "name.minLength": "Name must be atleast 8 digit characters",
            "name.maxLength": "Name must be less than 15 digit characters",
            "name.alpha": "Only alphabets are allowed",
            "email.required": "Email is required to sign up",
            "password.required": "Password is required to sign up",
            "email.unique": "Email field must have a unique value.",
            "password.minLength":
              "Password must be greater than 5 digit charater",
          },
        });


    
   const user = new User()
try{    
    user.name = req.name
    user.email = req.email
    user.password = req.password
   
    await user.save();
        console.log(user);
        console.log(req);
}catch(e){
 console.log("Certain field error")
} 
    session.flash({ notification: 'User created successfully' });
    return response.redirect('/')   
   
}

    public async login({ request, auth, response,session }: HttpContextContract){
       const req = 
       await request.validate({schema:schema.create({
            email: schema.string({}, 
                [
                    rules.email(),
                ]),
            password: schema.string({},
                [rules.minLength(8)])
        }),
         messages: {
        'email.required': 'Email is required to login',
        'password.required': 'Password is required to login',
        'password.confirm': 'Please enter valid password',
        'password.minLength': 'Password must be greater than 8 digit charater',
}
        
    })

    const email = req.email
    const password = req.password
    try{
    await auth.attempt(email, password)
    //return response.redirect('/dashboard');
    } 
    catch (e) {
      session.flashExcept(['password']);

      session.flash({
        error: 'We cannot find any account with these credentials.',
      });
      return response.redirect('/');
    }
    session.flash({ notification: 'Logged in successfully' });
    return response.redirect('/dashboard');
//     catch {
//     return response.badRequest('Invalid credentials')
//   }
  
}
 public async logout({auth, response, session}:HttpContextContract){
    await auth.logout()
    session.flash({ notification: 'Logged out successfully' });
    return response.redirect('/')
 }

}