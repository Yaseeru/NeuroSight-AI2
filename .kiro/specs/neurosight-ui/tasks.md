# Implementation Plan

- [x] 1. Set up project structure and dependencies

  - Initialize React project with Vite and TypeScript
  - Install dependencies: react-router-dom, vitest, @testing-library/react, fast-check, jest-axe
  - Configure Tailwind CSS with custom color palette (blues, teals, whites)
  - Set up folder structure: components/, pages/, utils/, types/
  - _Requirements: 1.4, 7.1_

- [x] 2. Implement core utilities and types





  - [x] 2.1 Create TypeScript type definitions


    - Define AlzheimerStage, DiagnosticResult, DiagnosticFlowState types
    - Define component prop interfaces
    - _Requirements: 5.1_
  - [x] 2.2 Implement file validation utility


    - Create validateFile function accepting File, returning FileValidationResult
    - Validate MIME types (image/jpeg, image/png, image/tiff)
    - Validate file size (max 10MB)
    - _Requirements: 3.3, 3.4_
  - [x] 2.3 Write property tests for file validation


    - **Property 2: Valid image files are accepted**
    - **Property 3: Invalid files are rejected**
    - **Validates: Requirements 3.3, 3.4**

- [x] 3. Implement Landing Page components





  - [x] 3.1 Create HeroSection component


    - Render headline, subheadline, and CTA button
    - Style with calming medical colors
    - Ensure button meets 44x44px minimum touch target
    - _Requirements: 1.1, 1.2, 7.2_

  - [x] 3.2 Create FeaturesGrid component

    - Render 3 feature cards (Speed, Accuracy, Community Support)
    - Each card displays icon, title, description
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Write property test for FeaturesGrid

    - **Property 1: Feature cards contain required elements**
    - **Validates: Requirements 2.3**
  - [x] 3.4 Create LandingPage combining Hero and Features


    - Wire up CTA navigation to dashboard route
    - _Requirements: 1.3_
  - [x] 3.5 Write unit tests for Landing Page


    - Test hero section renders with correct content
    - Test CTA button navigation
    - Test features grid renders 3 cards
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

- [x] 4. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement File Upload components





  - [x] 5.1 Create FileUploadZone component


    - Implement drag-and-drop functionality
    - Show visual feedback on drag over (border color change)
    - Handle file selection via click (input type="file")
    - Call validation utility and show errors for invalid files
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 5.2 Create ImagePreview component


    - Display thumbnail of uploaded MRI image
    - Show remove button to clear selection
    - _Requirements: 3.3_
  - [x] 5.3 Write unit tests for FileUploadZone


    - Test drag-over visual feedback
    - Test valid file acceptance
    - Test invalid file rejection with error message
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 6. Implement Processing and Results components






  - [x] 6.1 Create ProcessingLoader component

    - Display animated loading indicator
    - Show "Analyzing your MRI scan..." message
    - _Requirements: 4.1, 4.3_
  - [x] 6.2 Create ConfidenceBar component


    - Render horizontal bar with width proportional to percentage
    - Display percentage value as text
    - Use gradient fill (teal to blue)
    - _Requirements: 5.2, 5.4_

  - [x] 6.3 Write property test for ConfidenceBar

    - **Property 5: Confidence bar visualization consistency**
    - **Validates: Requirements 5.2, 5.4**
  - [x] 6.4 Create ResultsDisplay component


    - Show prediction as large text
    - Include ConfidenceBar
    - Display disclaimer text
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 6.5 Create SupportWidget component

    - Render "Join our Caregiver Support Group" button
    - Open Discord link in new tab on click
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 6.6 Write unit tests for Results components

    - Test ResultsDisplay shows prediction and confidence
    - Test disclaimer is present
    - Test SupportWidget button opens link in new tab
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 6.3_

- [x] 7. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement Diagnostic Dashboard page






  - [x] 8.1 Create DiagnosticDashboard page with state machine

    - Manage flow states: idle → file-selected → processing → results
    - Coordinate FileUploadZone, ImagePreview, ProcessingLoader, ResultsDisplay
    - Disable controls during processing state
    - _Requirements: 3.1, 3.5, 4.1, 4.2, 5.1_
  - [x] 8.2 Write property test for controls disabled during processing


    - **Property 4: Controls disabled during processing**
    - **Validates: Requirements 4.2**
  - [x] 8.3 Implement mock diagnostic service


    - Create analyzeImage function returning mock DiagnosticResult
    - Simulate 2-3 second processing delay
    - _Requirements: 5.1_


  - [x] 8.4 Write unit tests for DiagnosticDashboard


    - Test state transitions through complete flow
    - Test Analyze button appears after file upload
    - Test loading state displays during processing
    - _Requirements: 3.5, 4.1, 4.2, 4.3_

- [x] 9. Implement routing and app shell

  - [x] 9.1 Set up React Router
    - Configure routes: "/" for Landing, "/dashboard" for DiagnosticDashboard
    - _Requirements: 1.3_
  - [x] 9.2 Create App component

    - Wrap with Router provider
    - Add global styles and layout wrapper
    - _Requirements: 1.3_

- [x] 10. Implement responsive design






  - [x] 10.1 Add responsive breakpoints and layouts

    - Desktop layout (≥1024px): side-by-side components where appropriate
    - Mobile layout (<768px): stacked components
    - Ensure tap-to-upload works on mobile
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 10.2 Write property test for no horizontal overflow

    - **Property 9: No horizontal overflow at any viewport**
    - **Validates: Requirements 8.3**

- [x] 11. Implement accessibility features






  - [x] 11.1 Add accessibility attributes

    - Add alt text to all images
    - Associate labels with form inputs
    - Ensure high contrast text colors
    - Add ARIA labels where needed
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 11.2 Write property tests for accessibility

    - **Property 6: Interactive elements meet touch target size**
    - **Property 7: Images have alt text**
    - **Property 8: Form inputs have associated labels**
    - **Validates: Requirements 7.2, 7.3, 7.4**
  - [x] 11.3 Run jest-axe accessibility audit


    - Verify WCAG AA compliance
    - Fix any violations
    - _Requirements: 7.1_

- [x] 12. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
