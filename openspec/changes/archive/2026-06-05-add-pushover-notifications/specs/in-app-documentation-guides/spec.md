## ADDED Requirements

### Requirement: Admin guide includes Pushover setup instructions
The admin guide SHALL document how admins configure Pushover push notifications, including obtaining a User Key, enabling notifications, and selecting alert types.

#### Scenario: Admin reads Pushover setup guidance
- **WHEN** an admin opens `ADMINGUIDE.md` through the admin guide viewer or download
- **THEN** the guide SHALL include a Pushover section covering:
  - how to create a Pushover account and obtain a User Key
  - how to install the Pushover app on devices
  - where to enter the User Key in the admin panel
  - which alert types are available and what they mean
  - how to test Pushover delivery
  - quiet hours policy (0800-2200 ET, test sends always allowed)
