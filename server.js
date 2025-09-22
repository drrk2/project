"use strict";
import { payment } from "./index.js";
import express from "express";
import cors from "cors";

const LISTEN_PORT = 3000;

const app = express();

// Enable CORS for all origins (for development or specific use cases)
app.use(cors());

// Enable unpacking of json body in POST requests
// NOTE: requests must have a "content-type" header with value "application/json"
app.use(express.json());

// HANDLE THE REQUESTS

// Example of get request without parameters
// call like: GET http://localhost:3000/
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Example of get request with parameters
// call like: GET http://localhost:3000/example_params?name=pedro
app.get("/example_params", async(req, res) => {
    // extract and validate query parameter
    await payment();
    res.send(`Hello ${inputParam}!`);
});

// Example of POST request
// call like: POST http://localhost:3000/example_post
// a body object must be included and a "content-type" header with value "application/json" included
app.post("/example_post", (req, res) => {
    // extract body object
    const inputBodyObj = req.body;
    if (!inputBodyObj || Object.keys(inputBodyObj).length === 0) {
        return res.status(400).send("Please include a non-empty object in the post request");
    }
    res.send("Hello, this is your object: " + JSON.stringify(inputBodyObj, null, 2));
});

// Not found handler, this will catch requests that are not caught
// by other routes, should be at the end
app.use((req, res) => {
    res.status(404).send("Not Found");
});

// Start the server listening on TCP port defined by LISTEN_PORT
app.listen(LISTEN_PORT, (error) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(`Example app listening on port ${LISTEN_PORT}`);
});
// Fetch 