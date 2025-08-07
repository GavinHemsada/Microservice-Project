const { gql } = require("apollo-server");

const resulttypeDefs = gql`
  type Result {
    _id: ID
    student_id: String
    course_id: String
    marks: Int
    grade: String
    semester: String
  }

  type getResultres {
    error: String
    Result: Result
  }

  type getResultsres {
    error: String
    Results: [Result!]!
  }

  type createRespons {
    error: String
    message: String
    id: String
  }

  type updateRespons {
    error: String
    message: String
    Result: Result
  }

  type deleterespons {
    error: String
    message: String
  }

  type Query {
    getResults: getResultsres
    getResultbyStudentID(id: String!): getResultsres
    getResultbyCourseID(id: String!): getResultsres
  }

  type Mutation {
    addResult(
      student_id: String!
      course_id: String!
      marks: Int!
      grade: String!
      semester: String!
    ): createRespons

    updateResult(
      id: ID!
      student_id: String!
      course_id: String!
      marks: Int!
      grade: String!
      semester: String!
    ): updateRespons

    deleteResult(id: ID!): deleterespons
  }
`;

module.exports = resulttypeDefs;
