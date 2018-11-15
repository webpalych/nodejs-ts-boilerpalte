/* app/controllers/welcome.controller.ts */

// Import only what we need from express
import { Router, Request, Response } from 'express';
import {User} from '../models/user';
import { JWTService } from '../services/jwt.service'


// Assign router to the express.Router() instance
const router: Router = Router();
const jwt: JWTService = new JWTService();

// The / here corresponds to the route that the WelcomeController
// is mounted on in the server.ts file.
// In this case it's /welcome
router.get('/', jwt.jwtMiddleware, async (req: Request, res: Response) => {

    const authUser = await jwt.getAuthUser(req.token);
    const users = await User.find();

    res.json({authUser, users});
});

// Export the express.Router() instance to be used by server.ts
export const WelcomeController: Router = router;