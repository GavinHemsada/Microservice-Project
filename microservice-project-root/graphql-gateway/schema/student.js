const { gql } = require('apollo-server');

const studenttypeDefs = gql`

  type Address {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

   type Student {
    _id: ID
    first_name: String
    last_name: String
    dob: String
    email: String
    gender: String
    phone: String
    address: Address
  }

  type AuthPayload {
    message: String
    token: String
    error: String
  }

  type getStudentres{
    error: String
    Student: Student
  }

  type getStudentsres{
    error: String
    Students: [Student!]!
  }
  
  type createRespons{
    error: String
    message: String
    id : String
  }

  type updateRespons{
    error: String
    message: String
    student: Student
  }

  type deleterespons{
    error: String
    message: String
  }

  type Query {
    getStudents: getStudentsres
    getStudent(id: String!): getStudentres
  }

  type Mutation {
    studentLogin(email: String!, password: String!): AuthPayload
    createStudent(
      first_name: String!
      last_name: String!
      dob: String!
      email: String!
      gender: String!
      phone: String!
      password: String!
      address: AddressInput!
    ): createRespons
    updateStudent(id: ID!, 
      first_name: String!
      last_name: String!
      dob: String!
      email: String!
      gender: String!
      phone: String!
      password: String!
      address: AddressInput!
    ): updateRespons
    deleteStudent(id: ID!): deleterespons
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }
`;

module.exports = studenttypeDefs;