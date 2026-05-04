## ADDED Requirements

### Requirement: Passwords stored using bcrypt
The system SHALL hash all passwords using bcrypt before storing them in the database.

#### Scenario: Password hashed before storage
- **WHEN** a user creates or updates a password
- **THEN** the bcrypt hash SHALL be stored in the database
- **AND** the plain text password SHALL never be stored

### Requirement: Password strength validation
The system SHALL enforce minimum password requirements.

#### Scenario: Password meets requirements
- **WHEN** a password is at least 8 characters with uppercase, lowercase, number, and special character
- **THEN** the password SHALL be accepted

#### Scenario: Password too short rejected
- **WHEN** a password is fewer than 8 characters
- **THEN** an error SHALL indicate minimum length requirement

#### Scenario: Password missing complexity
- **WHEN** a password lacks uppercase, lowercase, number, or special character
- **THEN** an error SHALL indicate which requirements are missing

### Requirement: Password verification on login
The system SHALL verify passwords using bcrypt compare.

#### Scenario: Correct password logs in
- **WHEN** a user enters the correct password
- **THEN** bcrypt compare SHALL return true
- **AND** the user SHALL be authenticated

#### Scenario: Incorrect password rejected
- **WHEN** a user enters an incorrect password
- **THEN** bcrypt compare SHALL return false
- **AND** the user SHALL not be authenticated