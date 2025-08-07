const { gql } = require('apollo-server');

const teachertypeDefs = gql`

  type Address {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

   type Teacher {
    _id: ID
    first_name: String
    last_name: String
    dob: String
    email: String
    gender: String
    phone: String
    address: Address
    subject: String
  }

  type AuthPayload {
    message: String
    token: String
    error: String
  }

  type getTeacherRes{
    error: String
    Teacher: Teacher
  }

  type getTeachersRes{
    error: String
    Teachers: [Teacher!]!
  }
  
  type createRespons{
    error: String
    message: String
    id : String
  }

  type updateRespons{
    error: String
    message: String
    Teacher: Teacher
  }

  type deleterespons{
    error: String
    message: String
  }

  type Query {
    getTeachers: getTeachersRes
    getTeacher(id: String!): getTeacherRes
  }

  type Mutation {
    teacherLogin(email: String!, password: String!): AuthPayload
    createTeacher(
      first_name: String!
      last_name: String!
      dob: String!
      email: String!
      gender: String!
      phone: String!
      password: String!
      subject: String!
      address: AddressInput!
    ): createRespons
    updateTeacher(id: ID!, first_name: String!
      last_name: String!
      dob: String!
      email: String!
      gender: String!
      phone: String!
      password: String!
      subject: String!
      address: AddressInput!
    ): updateRespons
    deleteTeacher(id: ID!): deleterespons
  }

  input AddressInput {
    street: String!
    city: String!
    state: String!
    zipCode: String!
    country: String!
  }
`;

module.exports = teachertypeDefs;