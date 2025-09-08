import { expect } from 'chai';
import sinon from 'sinon';
import ErrorHandler from '../error-handler.js';
import CustomError from '../custom-error.js';
import type { Request, Response, NextFunction } from 'express';

describe('ErrorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    mockNext = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  context('with a generic Error', () => {
    it('should respond with 500 and a generic message in production', () => {
      const handler = new ErrorHandler({});
      const error = new Error('Something broke!');

      handler.handleError(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockResponse.status as sinon.SinonStub).calledWith(500)).to.be.true;
      expect((mockResponse.json as sinon.SinonStub).calledWith({ message: 'Something went wrong' })).to.be.true;
    });

    it('should respond with 500 and the error message in development', () => {
      const handler = new ErrorHandler({ isDevelopment: true });
      const error = new Error('Something broke!');

      handler.handleError(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockResponse.status as sinon.SinonStub).calledWith(500)).to.be.true;
      expect((mockResponse.json as sinon.SinonStub).calledWith({ message: 'Something broke!' })).to.be.true;
    });
  });

  context('with a CustomError', () => {
    it('should use the statusCode and message from the CustomError', () => {
      const handler = new ErrorHandler({});
      const error = new CustomError('TestError', 'A specific problem occurred', 404);

      handler.handleError(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockResponse.status as sinon.SinonStub).calledWith(404)).to.be.true;
      expect((mockResponse.json as sinon.SinonStub).calledWith({ message: 'A specific problem occurred' })).to.be.true;
    });

    it('should include the error payload in development mode', () => {
      const handler = new ErrorHandler({ isDevelopment: true });
      const errorPayload = { details: 'some data' };
      const error = new CustomError('TestError', 'A specific problem', 400, errorPayload);

      handler.handleError(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockResponse.status as sinon.SinonStub).calledWith(400)).to.be.true;
      expect((mockResponse.json as sinon.SinonStub).calledWith({ 
        message: 'A specific problem',
        error: errorPayload 
      })).to.be.true;
    });
  });

  context('with errorTypes configuration', () => {
    const errorTypes = {
      ValidationError: {
        statusCode: 422,
        message: 'Validation failed.',
      },
    };

    it('should handle an error defined in errorTypes', () => {
      const handler = new ErrorHandler({ errorTypes });
      const error = new Error('Validation failed detail');
      error.name = 'ValidationError';

      handler.handleError(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockResponse.status as sinon.SinonStub).calledWith(422)).to.be.true;
      expect((mockResponse.json as sinon.SinonStub).calledWith({ message: 'Validation failed.' })).to.be.true;
    });
  });

  context('logging', () => {
    it('should call a custom log function if provided', () => {
      const logSpy = sinon.spy();
      const handler = new ErrorHandler({ log: logSpy });
      const error = new Error('An error to log');

      handler.handleError(error, mockRequest as Request, mockResponse as Response, mockNext);

      expect(logSpy.calledOnce).to.be.true;
      expect(logSpy.calledWith(error)).to.be.true;
    });

    it('should not log in production by default', () => {
        const consoleErrorStub = sinon.stub(console, 'error');
        const handler = new ErrorHandler({ isDevelopment: false });
        const error = new Error('An error not to log');
  
        handler.handleError(error, mockRequest as Request, mockResponse as Response, mockNext);
  
        expect(consoleErrorStub.notCalled).to.be.true;
      });
  });
});
