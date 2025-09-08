import { expect } from 'chai';
import CustomError from '../custom-error.js';

describe('CustomError', () => {
  it('should create an error with the correct properties', () => {
    const errorName = 'TestError';
    const errorMessage = 'This is a test error.';
    const statusCode = 404;

    const err = new CustomError(errorName, errorMessage, statusCode);

    expect(err).to.be.an.instanceOf(Error);
    expect(err).to.be.an.instanceOf(CustomError);
    expect(err.name).to.equal(errorName);
    expect(err.message).to.equal(errorMessage);
    expect(err.statusCode).to.equal(statusCode);
    expect(err.isOperational).to.be.true;
  });

  it('should default to statusCode 500 if not provided', () => {
    const err = new CustomError('DefaultError', 'A default error.');

    expect(err.statusCode).to.equal(500);
  });
});
