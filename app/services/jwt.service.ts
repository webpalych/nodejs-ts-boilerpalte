import * as JWT from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/user'

export class JWTService {

    protected config: any;

    constructor(){
        this.config = {
            key: process.env.JWT_SECRET,
            ttl: process.env.JWT_TTL,
            refresh_ttl: process.env.JWT_REFRESH_TTL,

        };
    }

    public getTokenFromHeader = (req: Request) => {
        //get header
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if(bearerHeader) {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            return bearer[1];
        } else {
            return '';
        }
    };

    public createToken = (userId: string) => {
        return JWT.sign({ user: userId }, this.config.key,{ expiresIn: this.config.ttl });
    };

    public verifyToken = (token: string) => {
        try {
            JWT.verify(token, this.config.key);
            return true;
        } catch (error) {
            return error;
        }
    };

    public refreshToken = (req: Request) => {
        //get current token
        const token = this.getTokenFromHeader(req);
        let newToken: boolean | string = false;

        if(token) {
            const currentTimestamp: number = new Date().getTime();
            try {
                // get payload
                const payload = JWT.decode(token);
                // get refresh end date
                let refreshTimestamp: Date | number = new Date(payload.exp * 1000);
                refreshTimestamp = refreshTimestamp.setDate(refreshTimestamp.getDate() + this.config.refresh_ttl);
                // compare token refresh date and current date
                if (currentTimestamp <= refreshTimestamp) {
                    newToken = this.createToken(payload.user);
                }
            } catch (error) {
                newToken = false;
            }
        }

        return newToken;
    };

    public jwtMiddleware = (req: Request, res: Response, next: any) => {
        const token = this.getTokenFromHeader(req);

        if(token) {
            const verify = this.verifyToken(token);
            if(verify !== true) {
                res.status(403).json({error: verify.message});
            } else {
                req.token = token;
                next();
            }
        } else {
            res.status(403).json({error: 'token_not_provided'});
        }
    };

    public getAuthUser = (token: string) => {
        // get payload from current token
        const payload = JWT.verify(token, this.config.key);
        // get user from DB
        return User.findById(payload.user, '_id username');
    }
}