const Course = require("../models/courseModel");

/**
 * Creates a course
 */
const coursePost = async (req, res) => {
  let course = new Course(req.body);
  await course
    .save()
    .then((data) => {
      res.status(201); // CREATED
      res.header({
        location: `/api/courses/?id=${data.id}`,
      });
      res.json(data);
    })
    .catch((err) => {
      res.status(422);
      console.log("error while saving the course", err);
      res.json({
        error: "There was an error saving the course",
      });
    });
};

/**
 * Get all courses or one
 */
const courseGet = (req, res) => {
  if (req.query && req.query.id) {
    Course.findById(req.query.id)
      .then((course) => {
        res.json(course);
      })
      .catch((err) => {
        res.status(404);
        console.log("error while querying the course", err);
        res.json({ error: "Course doesn't exist" });
      });
  } else {
    Course.find()
      .then((courses) => {
        res.json(courses);
      })
      .catch((err) => {
        res.status(422);
        res.json({ error: err });
      });
  }
};

/**
 * Updates a course
 */
const coursePatch = (req, res) => {
  if (req.query && req.query.id) {
    Course.findById(req.query.id, function (err, course) {
      if (err) {
        res.status(404);
        console.log("error while querying the course", err);
        res.json({ error: "Course doesn't exist" });
      }

      // Update the course object (patch)
      course.name = req.body.name ? req.body.name : course.name;
      course.credits = req.body.credits ? req.body.credits : course.credits;

      course.save(function (err) {
        if (err) {
          res.status(422);
          console.log("error while saving the course", err);
          res.json({
            error: "There was an error saving the course",
          });
        }
        res.status(200); // OK
        res.json(course);
      });
    });
  } else {
    res.status(404);
    res.json({ error: "Course doesn't exist" });
  }
};

/**
 * Deletes a course
 */
const courseDelete = (req, res) => {
  if (req.query && req.query.id) {
    Course.findById(req.query.id, function (err, course) {
      if (err) {
        res.status(404);
        console.log("error while querying the course", err);
        res.json({ error: "Course doesn't exist" });
      }

      course.deleteOne(function (err) {
        if (err) {
          res.status(422);
          console.log("error while deleting the course", err);
          res.json({
            error: "There was an error deleting the course",
          });
        }
        res.status(204); // No content
        res.json({});
      });
    });
  } else {
    res.status(404);
    res.json({ error: "Course doesn't exist" });
  }
};

module.exports = {
  coursePost,
  courseGet,
  coursePatch,
  courseDelete,
};