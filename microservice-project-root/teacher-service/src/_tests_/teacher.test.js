const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

let teacherId;
let token;

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Teacher API Endpoints', () => {
  const testTeacher = {
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
    },
    subject: "sub1"
  };

  it('should register a new Teacher', async () => {
    const res = await request(app).post('/api/teacher/register').send(testTeacher);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message','User created successfully');
    teacherId = res.body._id;
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app).post('/api/teacher/login').send({
      email: testTeacher.email,
      password: testTeacher.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');

    token = res.body.token;
  });

  it('should fetch all Teacher', async () => {
    const res = await request(app)
      .get('/api/teacher/all')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

   it('should fetch Teacher by id', async () => {
    const res = await request(app)
      .get(`/api/teacher/${teacherId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', teacherId);
    expect(res.body).toHaveProperty('first_name');
    expect(res.body).toHaveProperty('last_name');
  });

  it('should update teacher info', async () => {
    const res = await request(app)
      .put(`/api/teacher/${teacherId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(testTeacher);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Successful update!');
  });

  it('should delete the teacher', async () => {
    const res = await request(app)
      .delete(`/api/teacher/${teacherId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 400 for invalid login', async () => {
    const res = await request(app).post('/api/teacher/login').send({
      email: 'wrong@example.com',
      password: 'wrongpass',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
