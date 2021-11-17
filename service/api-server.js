require('dotenv').config({ path: './.env.local' });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { displayStateMap, jwtAuthz } = require('express-jwt-aserto');

const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const port = process.env.API_PORT || 3001;
const baseUrl = process.env.AUTH0_BASE_URL;
const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
const audience = process.env.AUTH0_AUDIENCE;
const isNetlify = process.env.NETLIFY || process.env.REACT_APP_NETLIFY;
const routerBasePath = isNetlify ? '/.netlify/functions/api-server' : '/';

//Aserto authorizer configuration
const authzOptions = {
    authorizerServiceUrl: process.env.AUTHORIZER_SERVICE_URL,
    policyId: process.env.POLICY_ID,
    policyRoot: process.env.POLICY_ROOT,
    authorizerApiKey: process.env.AUTHORIZER_API_KEY,
    tenantId: process.env.TENANT_ID
};

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuerBaseUrl}/.well-known/jwks.json`
    }),
    audience: audience,
    issuer: `${issuerBaseUrl}/`,
    algorithms: ['RS256']
});

if (!baseUrl || !issuerBaseUrl) {
    throw new Error('Please make sure that the file .env.local is in place and populated');
}

if (!audience) {
    console.log('AUTH0_AUDIENCE not set in .env.local. Shutting down API server.');
    process.exit(1);
}

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({ origin: baseUrl }));
app.use(bodyParser.json());
// Set up middleware to return the display state map for this service
app.use(displayStateMap(authzOptions));

//Aserto authorizer middleware function
const checkAuthz = jwtAuthz(authzOptions)

router.get('/api/shows', checkJwt, checkAuthz, (req, res) => {
    res.send({
        msg: 'Your access token was successfully validated!'
    });
});


app.use(routerBasePath, router);

if (isNetlify) {
    const serverless = require("serverless-http");
    exports.handler = serverless(app);
} else {
    const server = app.listen(port, () => console.log(`API Server listening on port ${port}`));
    process.on('SIGINT', () => server.close());
}
