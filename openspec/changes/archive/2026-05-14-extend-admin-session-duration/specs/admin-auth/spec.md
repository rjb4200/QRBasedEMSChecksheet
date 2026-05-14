## MODIFIED Requirements

### Requirement: Admin session persists for 180 days
The admin authentication session SHALL persist for 180 days from creation, after which the browser cookie SHALL expire and the server SHALL reject the HMAC-signed session value.

#### Scenario: Admin signs in
- **WHEN** an admin successfully signs in with valid credentials
- **THEN** the session cookie SHALL be set with a maxAge of 180 days
- **AND** the HMAC session payload SHALL carry a 180-day expiration timestamp

#### Scenario: Admin returns within 180 days
- **WHEN** an admin with a valid session cookie visits the admin area within 180 days of sign-in
- **THEN** the session SHALL be accepted without requiring re-authentication

#### Scenario: Session exceeds 180 days
- **WHEN** an admin visits the admin area more than 180 days after sign-in
- **THEN** the session SHALL be rejected
- **AND** the admin SHALL be redirected to the login page

#### Scenario: Admin explicitly signs out
- **WHEN** an admin clicks Sign Out
- **THEN** the session cookie SHALL be deleted immediately
- **AND** the session SHALL be terminated regardless of remaining duration
