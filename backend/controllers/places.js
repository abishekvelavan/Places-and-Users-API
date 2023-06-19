const HttpError = require('../models/http-error.js');
const { v4: uuid } = require('uuid');
const Place = require('../models/places.js')
const User = require('../models/users.js')
const mongoose = require('mongoose');

const getPlaceById = async (req,res,next) => {
    console.log('http request was successful for places');
    const placeId = req.params.pid;
    let place;
    try {
      place = await Place.findById(placeId);
    } catch{
      (err) => {
        const error = new HttpError('Something went wrong.', 500);
        return next(error);
      }
    }
    if (!place) {
      const error = new HttpError('Could not find a place for the given place id.', 404);
      return next(error);
    }
    res.json(
        {
            place: place.toObject({getters: true})
        }
    );
};

const getPlaceByUserId = async (req,res,next) => {
    console.log('http request was successful for places by user id');
    const userId = req.params.uid;
    try {
      places = await Place.find({creator: userId});
    } catch (err) {
      const error = new HttpError('Failed',500);
      return next(error);
    }
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find a place for the given user id', 404));
      }
      res.json(
          {
              places: places.map(p => p.toObject({getters: true}))
          }
      );
};

const createPlace = async (req,res,next) => {
    console.log('http request was successful for creating a place');
    const { title, description, address, creator, location} = req.body;
    const createdPlace = new Place({
      title,
      description,
      address,
      location,
      creator,
      image: "https://picsum.photos/id/237/200/300",
    });
    try {
      const user = await User.findById(creator);
      console.log(creator);
      if (user) {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPlace.save({session: session});
        user.places.push(createdPlace);
        await user.save({session: session});
        await session.commitTransaction();
      } else {
        const error = new HttpError('Could not find a user for the given id.', 404);
        return next(error);
      }
    } catch {
      (err) => {
        const Error = new HttpError('creating the new place failed', 500);
        return next(Error);
      }
    }
    res.status(200).json({createdPlace});
}

const updatePlace = async (req,res,next) => {
    const {title,description,address,location} = req.body;
    const pid = req.params.pid;
    console.log('http request to update a place was successful');
    let place;
    try {
      place = await Place.findById(pid);
    } catch(err) {
      const error = new HttpError('update failed', 500);
      return next(error);
    }
    
    place.title = title;
    place.description = description;
    place.address = address;
    place.location = location;
    try {
      await place.save();
    } catch(err) {
      const error = new HttpError('failed', 500);
      return next(error);
    }
    res.status(200).json({place : place.toObject({getters: true})});
}
const deletePlace = async (req,res,next) => {
  const pid = req.params.pid;
  console.log('http request to delete a place was successful');
  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError('delete failed', 500);
    return next(error);
  }
  try {
    place.remove();
  } catch (err) {
    const error = new HttpError('delete failed', 500);
    return next(error);
  }
  res.status(200).json({message : 'Deleted Place'});
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;