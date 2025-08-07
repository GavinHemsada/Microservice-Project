const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

let studentId;
let token;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/result_test');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Result API Endpoints', () => {
  const testResult = {
    first_name: "gavi1",
    last_name : "hemsada",
    dob: "2001.1.1",
    email: "gavin@gmail.com",
    gender : "male",
    phone : "0718721716",
    password: "123456",
    address : {
        street : "stree1",
        city:"Piliyandala", 
        state:"WP", 
        zipCode:"10300", 
        country:"SL"
    }
  };

  it('should register a new student', async () => {
    const res = await request(app).post('/api/student/register').send(testResult);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message','User created successfully');
    studentId = res.body._id;
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app).post('/api/student/login').send({
      email: testStudent.email,
      password: testStudent.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');

    token = res.body.token;
  });

  it('should fetch all students', async () => {
    const res = await request(app)
      .get('/api/student/all')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch student by id', async () => {
    const res = await request(app)
      .get(`/api/student/${studentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', studentId);
    expect(res.body).toHaveProperty('first_name');
    expect(res.body).toHaveProperty('last_name');
  });

  it('should update student info', async () => {
    const res = await request(app)
      .put(`/api/student/${studentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(testStudent);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successful update!');
  });

  it('should delete the student', async () => {
    const res = await request(app)
      .delete(`/api/student/${studentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 400 for invalid login', async () => {
    const res = await request(app).post('/api/student/login').send({
      email: 'wrong@example.com',
      password: 'wrongpass',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
