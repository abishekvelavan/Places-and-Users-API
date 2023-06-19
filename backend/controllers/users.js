const HttpError = require('../models/http-error.js');
const { v4: uuid } = require('uuid');
const User = require('../models/users.js');
const bcrypt = require('bcryptjs');

const dummy_users = [
    {
        "id": '1',
        "name": "John Doe",
        "email": "johndoe@example.com",
        "password": "password123",
        "image": "https://example.com/images/johndoe.jpg"
    },
    {
        "id": '2',
        "name": "Jane Smith",
        "email": "janesmith@example.com",
        "password": "pass123",
        "image": "https://example.com/images/janesmith.jpg"
    },
    {
        "id": '3',
        "name": "Alex Johnson",
        "email": "alexjohnson@example.com",
        "password": "qwerty",
        "image": "https://example.com/images/alexjohnson.jpg"
    }
]

const getUsers = async (req,res,next) => {
    console.log('http request was successful for users');
    let users;
    try {
        users = await User.find({}, 'password');
    } catch (err){
        const error = new HttpError('failed',500);
        return next(error);
    }
    res.json(
        {
            users: users.map(user => user.toObject({getters : true}))
        }
    );
};

const getUserById = (req,res,next) => {
    console.log('http request was successful for user');
    const placeId = req.params.uid;
    const place = dummy_users.find( p => {
        return p.id === `${placeId}`;
    })
    if (!place) {
      throw new HttpError(`Could not find a user for the given user id ${placeId}.`, 404);
    }
    res.json(
        {
            place
        }
    );
};

const signUp = async (req,res,next) => {
    console.log('http request was successful for sign up');
    const {name, email, password} = req.body;
    let UpdatedUsers;
    try {
        UpdatedUsers= await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError('failed', 500);
        return next(error);
    }
    if (UpdatedUsers) {
        const err = new HttpError('Email already in use', 422);
        return next(err);
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('hashing error', 500);
        return next(error);
    }
    const createdUser = new User({
        name,
        email,
        image: '',
        password: hashedPassword,
        places:[]
    });
    try {
        await createdUser.save()
    } catch (err) {
        console.log(err);
        const error = new HttpError('user creation failed', 500);
        return next(error);
    };
    res.json(
        {
            createdUser: createdUser.toObject({getters: true})
        }
    );
};
const login = async (req,res,next) => {
    console.log('http request was successful for login');
    const {email, password} = req.body;
    let existingUsers;
    try {
        existingUsers= await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError('failed', 500);
        return next(error);
    }

    if (!existingUsers || existingUsers.password !== password) {
        const error = new HttpError(
            'Invalid email or password', 422);
        return next(error);
    }
    res.json(
        {
            message: 'logged in'
        }
    );
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signUp = signUp;
exports.login = login;