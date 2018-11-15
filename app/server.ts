///<reference path="../node_modules/@types/node/index.d.ts"/>
/* app/server.ts */

// Import everything from express and assign it to the express variable
import express from "express";// express();

// Require .env
require('dotenv').config();

// Import Mongoose
import Mongoose from "mongoose";

Mongoose.connect(process.env.MONGODB_STRING);


// Import Controllers from controllers entry point
import {WelcomeController} from './controllers';
import {AuthController} from './controllers';


// Create a new express application instance
const app: express.Application = express();
// The port the express app will listen on
const port: any = process.env.PORT || 3000;

app.use(express.json());
// Mount the WelcomeController at the /welcome route
app.use('/welcome', WelcomeController);
app.use('/auth', AuthController);

// Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});