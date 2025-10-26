const Response = require('@aws-lambda/http').Response;

export default {
    success: (body) => {
        return new Response()
            .status(200)
            .body(JSON.stringify(body))
            .header('Content-Type', 'application/json')
            .json();
    },
    created: (body) => {
        return new Response()
            .status(201)
            .body(JSON.stringify(body))
            .header('Content-Type', 'application/json')
            .json();
    },
    redirect: (longUrl) => {
        return new Response()
            .status(301)
            .header('location', longUrl)
            .json();
    },
    validationError: (message) => {
        return new Response()
            .status(400)
            .body(
                JSON.stringify({
                    error: 'ValidationError',
                    message: message,
                    time: new Date().toISOString()
                })
            )
            .header('Content-Type', 'application/json')
            .json();
    },
    notFoundError: (message) => {
        return new Response()
            .status(404)
            .body(
                JSON.stringify({
                    error: 'NotFoundError',
                    message: message,
                    time: new Date().toISOString()
                })
            )
            .header('Content-Type', 'application/json')
            .json();
    },
    serverError: (error) => {
        console.log(error);
        return new Response()
            .status(500)
            .body(
                JSON.stringify({
                    error: error.code,
                    message: error.message,
                    time: error.time
                })
            )
            .header('Content-Type', 'application/json')
            .json();
    }
};
