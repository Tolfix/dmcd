import {Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcryptjs';
import log from '../Lib/Logger';
import { PassportStatic } from 'passport';

// Load User model
import User from '../Models/User';

export default function Auth(passport: PassportStatic) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => 
        {
            User.findOne({
                email: email,
            }).then((user) => {
                if (!user) {
                    log.warning(`Someone tried to login with email: ${email}`)
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) =>
                {
                    if (err) throw err;
                    if (!isMatch) {
                        log.warning(`User ${user.username} failed to login.`)
                        return done(null, false, { message: 'Password incorrect' });
                    }
                    return done(null, user);
                });
            });
    })
);

    passport.serializeUser((user, done) => {
        //@ts-ignore
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err: any, user: any) => {
            done(err, user);
        });
    });
};