const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

let courseId;
let token;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/courses_test");
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Courses API Endpoints", () => {
  const testCourse = {
    teacher_id: "507f1f77bcf86cd799439011", // Mock ObjectId
    name: "Advanced Mathematics",
    description:
      "A comprehensive course covering advanced mathematical concepts",
  };

  it("should create a new course", async () => {
    const res = await request(app)
      .post("/api/courses/add")
      .set("Authorization", "Bearer mock-teacher-token")
      .send(testCourse);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Course created successfully");
    courseId = res.body._id;
  });

  it("should fetch all courses", async () => {
    const res = await request(app)
      .get("/api/courses")
      .set("Authorization", "Bearer mock-token");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch course by id", async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}`)
      .set("Authorization", "Bearer mock-token");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", courseId);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("description");
    expect(res.body).toHaveProperty("teacher_id");
  });

  it("should fetch courses by teacher id", async () => {
    const res = await request(app)
      .get(`/api/courses/teacher/${testCourse.teacher_id}`)
      .set("Authorization", "Bearer mock-token");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update course info", async () => {
    const updatedCourse = {
      ...testCourse,
      name: "Updated Mathematics Course",
      description: "Updated course description",
    };

    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set("Authorization", "Bearer mock-teacher-token")
      .send(updatedCourse);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Course updated successfully");
  });

  it("should delete the course", async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", "Bearer mock-teacher-token");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Course deleted successfully");
  });

  it("should return 400 for invalid course data", async () => {
    const invalidCourse = {
      name: "Invalid Course",
      // Missing required fields: teacher_id, description
    };

    const res = await request(app)
      .post("/api/courses/add")
      .set("Authorization", "Bearer mock-teacher-token")
      .send(invalidCourse);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 for non-existent course", async () => {
    const nonExistentId = "507f1f77bcf86cd799439012";
    const res = await request(app)
      .get(`/api/courses/${nonExistentId}`)
      .set("Authorization", "Bearer mock-token");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Course not found");
  });
});
