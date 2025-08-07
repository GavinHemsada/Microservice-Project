const Student = require("../model/student");
const jwt = require("jsonwebtoken");

const createStudent = async (req, res) => {
  const {
    first_name,
    last_name,
    dob,
    gender,
    phone,
    email,
    password,
    address,
  } = req.body;
  const user = await Student.exists({ email });
  if (user) return res.status(400).json({ error: "User already exists " });

  const newStudent = new Student({
    first_name,
    last_name,
    dob,
    email,
    gender,
    phone,
    password,
    address,
  });

  await newStudent.save();

  return res
    .status(201)
    .json({ message: "User created successfully", _id: newStudent._id });
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { studentId: student._id, role: "Student" },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
};

const readallStudent = async (_req, res) => {
  const all = await Student.find().select("-password");
  res.status(200).json(all);
};

const getStudentbyID = async (req, res) => {
  const studentID = req.params.id;
  const student = await Student.findById(studentID).select("-password");
  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }
  return res.status(200).json(student);
};

const updateStudent = async (req, res) => {
  try {
    // const studentid = req.user && req.user._id; // get jwt id
    const studentid = req.params.id;
    const updates = req.body;

    const student = await Student.findByIdAndUpdate(studentid, updates, {
      new: true,
    });

    if (!student) {
      return res.status(404).json({ error: "student not found" });
    }

    return res.status(200).json({ message: "Successful update!", student });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentid = req.params.id;

    const deletedStudent = await Student.findByIdAndDelete(studentid);

    if (!deletedStudent) {
      return res.status(404).json({ error: "student not found" });
    }

    return res.status(200).json({ message: "student deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createStudent,
  loginStudent,
  readallStudent,
  updateStudent,
  deleteStudent,
  getStudentbyID,
};
