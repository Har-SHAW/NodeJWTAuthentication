const express = require("express");
const bodyParser = require("body-parser");
const Favourites = require("../models/favourite");
const favouriteRouter = express.Router();
var authenticate = require("../authenticate");
const Fourites = require("../models/favourite");

favouriteRouter.use(bodyParser.json());

favouriteRouter
  .route("/")
  .get(authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .populate("dishes")
      .populate("user")
      .then(
        (favs) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favs);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Fourites.findOne({ user: req.user._id })
      .then((fav) => {
        if (fav !== null) {
          var favs = req.body;
          for (var i = 0; i < favs.length; i++) {
            if (fav.dishes.indexOf(favs[i]._id) === -1)
              fav.dishes.push(favs[i]._id);
          }
          fav.save().then(
            (f) => {
              console.log("Fav Created ", f);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(f);
            },
            (err) => next(err)
          );
        } else {
          Favourites.create({ user: req.user._id }).then((fav) => {
            var favs = req.body;
            for (var i = 0; i < favs.length; i++) {
              fav.dishes.push(favs[i]._id);
            }
            fav.save().then(
              (f) => {
                console.log("fav Created ", f);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(f);
              },
              (err) => next(err)
            );
          });
        }
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Favourites.remove({ user: req.user._id })
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

favouriteRouter
  .route("/:dishId")
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /favourites/" + dishId);
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Fourites.findOne({ user: req.user._id }).then((fav) => {
      if (fav !== null) {
        if (fav.dishes.indexOf(req.params.dishId) === -1) {
          fav.dishes.push(req.params.dishId)
          fav
            .save()
            .then(
              (fav) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(fav);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        } else {
          res.statusCode = 500;
          res.end("Dish already exists in Favourite dishes");
        }
      } else {
        Favourites.create({ user: req.user._id }).then((fav) => {
          fav.dishes.push(req.params.dishId);
          fav
            .save()
            .then(
              (f) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(f);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        });
      }
    });
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favourites");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .then((fav) => {
        fav.dishes.remove(req.params.dishId);
        fav.save().then(
          (f) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(f);
          },
          (err) => next(err)
        );
      })
      .catch((err) => next(err));
  });

module.exports = favouriteRouter;
