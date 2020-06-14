'use strict';

const errorMessages = require('./internalErrorMessages.json').errorMessages;

class IntenalError extends Error {
    constructor(message){
        super(message);
        console.log(this.constructor.name);
        this.name = errorMessages[this.constructor.name].name;
        this.message = errorMessages[this.constructor.name][message];
    }

    toString() {
        return this.message;
    }
}

class DatabaseError extends IntenalError {}

class BadInputParameters extends IntenalError {}

class GitError extends IntenalError {}

class DataNotFound extends IntenalError {}

module.exports = {
    DatabaseError,
    BadInputParameters,
    GitError,
    DataNotFound
}