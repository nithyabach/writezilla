// Mock AWS Amplify functions for testing
export const mockAmplifyFunctions = {
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
};

// This file is not a test suite, it's a utility file
export default {};

// Default mock implementations
export const setupDefaultMocks = () => {
  mockAmplifyFunctions.signInWithRedirect.mockResolvedValue({ success: true });
  mockAmplifyFunctions.signOut.mockResolvedValue({});
  mockAmplifyFunctions.getCurrentUser.mockResolvedValue({ 
    username: 'test@example.com',
    userId: 'test-user-id'
  });
  mockAmplifyFunctions.fetchUserAttributes.mockResolvedValue({
    email: 'test@example.com',
    name: 'Test User'
  });
  mockAmplifyFunctions.signUp.mockResolvedValue({
    userId: 'test-user-id',
    isSignUpComplete: false
  });
  mockAmplifyFunctions.signIn.mockResolvedValue({
    isSignedIn: true,
    nextStep: { signInStep: 'DONE' }
  });
  mockAmplifyFunctions.confirmSignUp.mockResolvedValue({
    isSignUpComplete: true
  });
  mockAmplifyFunctions.resendSignUpCode.mockResolvedValue({});
  mockAmplifyFunctions.resetPassword.mockResolvedValue({
    nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' }
  });
  mockAmplifyFunctions.confirmResetPassword.mockResolvedValue({});
};

// Mock error scenarios
export const setupErrorMocks = () => {
  mockAmplifyFunctions.signInWithRedirect.mockRejectedValue(
    new Error('Failed to sign in with Google')
  );
  mockAmplifyFunctions.getCurrentUser.mockRejectedValue(
    new Error('User not authenticated')
  );
};

// Reset all mocks
export const resetMocks = () => {
  Object.values(mockAmplifyFunctions).forEach(mock => mock.mockReset());
}; 