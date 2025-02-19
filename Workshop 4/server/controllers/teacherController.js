const Teacher = require("../models/teacherModel");

/**
 * Creates a teacher
 *
 * @param {*} req
 * @param {*} res
 */
const teacherPost = async (req, res) => {
  let teacher = new Teacher();

  teacher.first_name = req.body.first_name;
  teacher.last_name = req.body.last_name;
  teacher.cedula = req.body.cedula;
  teacher.age = req.body.age;
  teacher.course = req.body.course;

  // Validación de campos requeridos
  if (
    teacher.first_name &&
    teacher.last_name &&
    teacher.cedula &&
    teacher.age &&
    teacher.course
  ) {
    try {
      const data = await teacher.save();
      res
        .status(201)
        .header({
          location: `/api/teachers/?id=${data.id}`,
        })
        .json(data);
    } catch (err) {
      console.log("Error while saving the teacher", err);
      res.status(422).json({
        error_code: 1233,
        error: "There was an error saving the teacher",
      });
    }
  } else {
    res.status(422).json({
      error: "Missing required data for teacher",
    });
  }
};

/**
 * Get all teachers
 *
 * @param {*} req
 * @param {*} res
 */
const teacherGet = (req, res) => {
  // if an specific teacher is required
  if (req.query && req.query.id) {
    Teacher.findById(req.query.id)
      .populate("course")
      .then((teacher) => {
        res.json(teacher);
      })
      .catch((err) => {
        res.status(404);
        console.log("error while queryting the teacher", err);
        res.json({ error: "Teacher doesnt exist" });
      });
  } else {
    // get all teachers
    Teacher.find()
      .populate("course")
      .then((teachers) => {
        res.json(teachers);
      })
      .catch((err) => {
        res.status(422);
        res.json({ error: err });
      });
  }
};

/**
 * Updates a teacher
 *
 * @param {*} req
 * @param {*} res
 */
const teacherPatch = (req, res) => {
  // get teacher by id
  if (req.query && req.query.id) {
    Teacher.findById(req.query.id, function (err, teacher) {
      if (err) {
        res.status(404);
        console.log("error while queryting the teacher", err);
        res.json({ error: "Teacher doesnt exist" });
      }

      // update the teacher object (patch)
      teacher.title = req.body.title ? req.body.title : teacher.title;
      teacher.detail = req.body.detail ? req.body.detail : teacher.detail;
      // update the teacher object (put)
      // teacher.title = req.body.title
      // teacher.detail = req.body.detail

      teacher.save(function (err) {
        if (err) {
          res.status(422);
          console.log("error while saving the teacher", err);
          res.json({
            error: "There was an error saving the teacher",
          });
        }
        res.status(200); // OK
        res.json(teacher);
      });
    });
  } else {
    res.status(404);
    res.json({ error: "Teacher doesnt exist" });
  }
};

/**
 * Deletes a teacher
 *
 * @param {*} req
 * @param {*} res
 */
const teacherDelete = (req, res) => {
  // get teacher by id
  if (req.query && req.query.id) {
    Teacher.findById(req.query.id, function (err, teacher) {
      if (err) {
        res.status(404);
        console.log("error while queryting the teacher", err);
        res.json({ error: "Teacher doesnt exist" });
      }

      teacher.deleteOne(function (err) {
        if (err) {
          res.status(422);
          console.log("error while deleting the teacher", err);
          res.json({
            error: "There was an error deleting the teacher",
          });
        }
        res.status(204); //No content
        res.json({});
      });
    });
  } else {
    res.status(404);
    res.json({ error: "Teacher doesnt exist" });
  }
};

module.exports = {
  teacherGet,
  teacherPost,
  teacherPatch,
  teacherDelete,
};
