const { gql } = require("apollo-server");

const resulttypeDefs = gql`
  type Courses {
    _id: ID
    teacher_id: String
    name: String
    description: String
  }

  type Enrollment {
    _id: ID
    student_id: String
    course_id: String
    enrollment_date: String
  }

  type getCoursesres {
    error: String
    Courses: Courses
  }

  type getCoursessres {
    error: String
    Coursess: [Courses!]!
  }

  type getEnrollmentsres {
    error: String
    Enrollments: [Enrollment!]!
  }

  type createRespons {
    error: String
    message: String
    id: String
  }

  type updateCourse {
    error: String
    message: String
    Courses: Courses
  }

  type updateEnrollment {
    error: String
    message: String
    Enrollment: Enrollment
  }

  type deleterespons {
    error: String
    message: String
  }

  type Query {
    getCoursess: getCoursessres
    getCourses(id: String!): getCoursesres
    getCoursesbyTeacherID(id: String!): getCoursessres

    getEnrollments: getEnrollmentsres
    getEnrollmentbyCourseID(id: String!): getEnrollmentsres
    getEnrollmentbyStudentID(id: String!): getEnrollmentsres
  }

  type Mutation {
    addCourse(
      teacher_id: String!
      name: String!
      description: String!
    ): createRespons
    updateCourses(
      _id: ID!
      teacher_id: String!
      name: String!
      description: String!
    ): updateCourse
    deleteCourses(id: ID!): deleterespons

    addEntrollment(
      student_id: String!
      course_id: String!
      enrollment_date: String!
    ): createRespons
    updateEntrollment(
      _id: ID
      student_id: String!
      course_id: String!
      enrollment_date: String!
    ): updateEnrollment
    deleteEntrollment(id: ID!): deleterespons
  }
`;

module.exports = resulttypeDefs;
