// Import only what we need from express
import { Router, Request, Response } from 'express';

import { User } from '../models/user'
import { JWTService } from '../services/jwt.service'
import bcrypt from 'bcrypt';

// Assign router to the express.Router() instance
const router: Router = Router();

const jwt: JWTService = new JWTService();

// LOGIN ROUTE
router.post('/login', validateLoginParams, async (req: Request, res: Response) => {

    //get request body
    const name = req.body.name;
    const password = req.body.password;

    //get user from DB
    try {
        const user = await User.findOne({ username: name });
        //send error if no user found
        if (user === null) {
            sendLoginError(res);
        } else {
            //compare entered password with hash
            const validPassword = bcrypt.compareSync(password, user.password);

            //send error if password is wrong
            if(!validPassword) {
                sendLoginError(res);
            } else {
                //create token
                const token = jwt.createToken(user.id);
                //try to delete properties
                delete user._id;
                delete user.password;
                res.json({token, user});
            }
        }
    } catch (error) {
        res.status(502).send('error');
    }
});


// REFRESH TOKEN ROUTE
router.get('/refresh-token', (req: Request, res: Response) => {

    const newToken = jwt.refreshToken(req);

    if (newToken) {
        res.json({token : newToken});
    } else {
        res.status(403).json({error: 'token_invalid'});
    }
});

// LOGIN VALIDATION MIDDLEWARE
function validateLoginParams(req: Request, res: Response, next: any) {

    if (!req.body.name) {
        res.status(422)
            .json({
                error: 'name_is_required'
            });
    } else if (!req.body.password) {
        res.status(422)
            .json({
                error: 'password_is_required'
            });
    } else {
        next();
    }
}

function sendLoginError(res: Response) {

    res.status(422).json({
        error: 'invalid_credentials'
    });
}

export const AuthController: Router = router;