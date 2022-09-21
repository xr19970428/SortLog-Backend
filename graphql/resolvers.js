const resolvers = {
  Query: {
    hello: () => {
      var a = 'Hello';
      var b = ' World';
      return a + b;
    },
  },
};
