export const MessageConstants = {
  SUCCESS: {
    // General
    SAVED_SUCCESSFULLY: 'Saved successfully',
    DELETED_SUCCESSFULLY: 'Deleted successfully',
    UPDATED_SUCCESSFULLY: 'Updated successfully',
    
    // Excel
    EXCEL_DOWNLOAD_SUCCESS: 'Excel file downloaded successfully',
    
    // Dealer Management
    DEALER_ASSIGNED: 'Area assigned successfully',
    DEALER_ASSIGNMENT_UPDATED: 'Assignment updated successfully',
    DEALER_ASSIGNMENT_DELETED: 'Assignment deleted successfully',
    DEALER_PRODUCT_ADDED: 'Product added successfully',
    DEALER_PRODUCT_UPDATED: 'Product updated successfully',
    DEALER_PRODUCT_DELETED: 'Product deleted successfully',
    DEALER_VERIFIED: 'Dealer verified successfully',
    DEALER_DISTRIBUTION_SUBMITTED: 'Distribution proof submitted successfully',
    DEALER_DISTRIBUTION_VERIFIED: 'Distribution verified successfully',
  },
  
  ERROR: {
    // General
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    
    // Excel
    EXCEL_DOWNLOAD_FAILED: 'Failed to generate Excel file. Please try again.',
    EXCEL_NO_DATA: 'No data available to export.',
    
    // Dealer Management
    DEALER_ASSIGNMENT_FAILED: 'Failed to assign area',
    DEALER_ASSIGNMENT_UPDATE_FAILED: 'Failed to update assignment',
    DEALER_ASSIGNMENT_DELETE_FAILED: 'Failed to delete assignment',
    DEALER_PRODUCT_ADD_FAILED: 'Failed to add product',
    DEALER_PRODUCT_UPDATE_FAILED: 'Failed to update product',
    DEALER_PRODUCT_DELETE_FAILED: 'Failed to delete product',
    DEALER_VERIFICATION_FAILED: 'Failed to verify dealer',
    DEALER_DISTRIBUTION_SUBMIT_FAILED: 'Failed to submit distribution proof',
    DEALER_DISTRIBUTION_VERIFY_FAILED: 'Failed to verify distribution',
  },
  
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_FORMAT: 'Invalid format',
    MIN_LENGTH: 'Value is too short',
    MAX_LENGTH: 'Value is too long',
    SELECT_AT_LEAST_ONE: 'Please select at least one option',
    INVALID_FILE: 'Invalid file or file is empty',
  }
};
