const Teacher = require("../model/teacher");
const jwt = require("jsonwebtoken");

const createTeacher = async (req, res) => {
  const {
    first_name,
    last_name,
    dob,
    gender,
    phone,
    email,
    password,
    address,
    subject,
  } = req.body;
  const user = await Teacher.exists({ email });
  if (user) return res.status(400).json({ error: "User already exists " });

  const newTeacher = new Teacher({
    first_name,
    last_name,
    dob,
    email,
    gender,
    phone,
    password,
    address,
    subject,
  });

  await newTeacher.save();

  return res
    .status(201)
    .json({ message: "User created successfully", _id: newTeacher.id });
};

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isMatch = await teacher.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { teacherId: teacher._id, role: "Teacher" },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  res.status(200).json({ message: "Login successful", token });
};

const readallTeacher = async (_req, res) => {
  const all = await Teacher.find().select("-password");
  res.json(all);
};

const teacherfindbyID = async (req, res) => {
  const teacherId = req.params.id;
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    return res.status(400).json({ error: "Teacher not found" });
  }
  return res.status(200).json(teacher);
};
const updateTeacher = async (req, res) => {
  try {
    const teacherid = req.params.id;
    const updates = req.body;

    const teacher = await Teacher.findByIdAndUpdate(teacherid, updates, {
      new: true,
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    return res.status(200).json({ message: "Successful update!", teacher });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teachertid = req.params.id;

    const deletedTeacher = await Teacher.findByIdAndDelete(teachertid);

    if (!deletedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    return res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createTeacher,
  loginTeacher,
  readallTeacher,
  updateTeacher,
  deleteTeacher,
  teacherfindbyID,
};
