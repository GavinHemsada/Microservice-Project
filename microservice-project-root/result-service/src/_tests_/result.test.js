const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";

const app = require("../../app");

let resultId;
let teacherToken;
let userToken;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/result_test");
  teacherToken = jwt.sign(
    { id: "64b8f0f9e13a2a0012a3b001", role: "Teacher" },
    process.env.JWT_SECRET
  );
  userToken = jwt.sign(
    { id: "64b8f0f9e13a2a0012a3b002", role: "Student" },
    process.env.JWT_SECRET
  );
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Result API Endpoints", () => {
  const testResult = {
    student_id: "507f1f77bcf86cd799439011",
    course_id: "507f1f77bcf86cd799439012",
    marks: 85,
    grade: "A",
    semester: "2024-Fall",
  };

  it("should create a new result", async () => {
    const res = await request(app)
      .post("/api/result/add")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send(testResult);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "result successfully");
    expect(res.body).toHaveProperty("_id");
    resultId = res.body._id;
  });

  it("should fetch all results", async () => {
    const res = await request(app)
      .get("/api/result")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch results by student id", async () => {
    const res = await request(app)
      .get(`/api/result/student/${testResult.student_id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("student_id");
    expect(res.body[0]).toHaveProperty("course_id");
  });

  it("should fetch results by course id", async () => {
    const res = await request(app)
      .get(`/api/result/courses/${testResult.course_id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update result info", async () => {
    const updates = { marks: 90, grade: "A+", semester: "2025-Spring" };

    const res = await request(app)
      .put(`/api/result/${resultId}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({ ...testResult, ...updates });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Successful update!");
    expect(res.body.result).toHaveProperty("marks", 90);
    expect(res.body.result).toHaveProperty("grade", "A+");
  });

  it("should return 400 for invalid result data", async () => {
    const invalid = { marks: 50 }; 

    const res = await request(app)
      .post("/api/result/add")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send(invalid);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("should delete the result", async () => {
    const res = await request(app)
      .delete(`/api/result/${resultId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "result deleted successfully");
  });
});
