require('dotenv').config();
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const http = require('http');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./db/connect');
const swaggerJsDoc = require('./utils/swagger');
const Router = require('./routes');

// apollo server
const { ApolloServer } = require('apollo-server-express');
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');

const app = express();
const httpServer = http.createServer(app);
app.use(express.json());
// extra security package
app.use(helmet());
app.use(cors());
app.use(xss());

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    // graphql
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      csrfPrevention: true,
      cache: 'bounded',
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
    });
    await server.start();
    server.applyMiddleware({ app });

    // mongodb
    await connectDB(process.env.MONGO_URI);

    // express
    app.listen(port, () => {
      console.log(`Started at: http://localhost:${port}/api-docs/`);
      console.log(`Graphql at: https://studio.apollographql.com/sandbox`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

// routes
app.use('/api', Router);
// health check api
app.get('/health-check', (req, res) => res.status(200).send({ message: 'healthy' }));
// swagger api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));
