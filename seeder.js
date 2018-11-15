require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = mongoose.model('User', {username: String, password: String});
mongoose.connect(process.env.MONGODB_STRING);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    const admin = new User({
        username: 'admin',
        password: bcrypt.hashSync('12345678', 10)
    });
    admin.save()
        .then((newUser) => {
            console.log(newUser);
            db.close();
        });
});