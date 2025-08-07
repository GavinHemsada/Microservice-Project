const { ApolloServer } = require("apollo-server");
const { mergeTypeDefs } = require("@graphql-tools/merge");
require("dotenv").config();

const studenttypeDefs = require("./schema/student");
const teachertypeDefs = require("./schema/teacher");
const resulttypeDefs = require("./schema/result");
const couresetypeDefs = require("./schema/courses");


const typeDefs = mergeTypeDefs([
  studenttypeDefs,
  teachertypeDefs,
  resulttypeDefs,
  couresetypeDefs,
]);

const studentResolvers = require("./resolvers/student");
const teacherResolvers = require("./resolvers/teacher");
const resultResolvers = require("./resolvers/result");
const coureseResolvers = require("./resolvers/courses");

const resolvers = {
  Query: {
    ...studentResolvers.Query,
    ...teacherResolvers.Query,
    ...resultResolvers.Query,
    ...coureseResolvers.Query,
  },
  Mutation: {
    ...studentResolvers.Mutation,
    ...teacherResolvers.Mutation,
    ...resultResolvers.Mutation,
    ...coureseResolvers.Mutation,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.split(" ")[1];
    return { token };
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
  console.log("STUDENT_SERVICE_URL:", process.env.JWT_SECRET);
});
