// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock AWS Amplify for all tests
jest.mock('aws-amplify/auth', () => ({
  signInWithRedirect: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  fetchUserAttributes: jest.fn(),
  signUp: jest.fn(),
  signIn: jest.fn(),
  confirmSignUp: jest.fn(),
  resendSignUpCode: jest.fn(),
  resetPassword: jest.fn(),
  confirmResetPassword: jest.fn(),
}));

// Mock AWS Amplify configuration
jest.mock('aws-amplify', () => ({
  configure: jest.fn(),
  Amplify: {
    configure: jest.fn(),
  },
}));



 