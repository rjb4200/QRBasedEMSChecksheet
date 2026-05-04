## Context

The admin panel provides comprehensive fleet management capabilities including unit configuration, equipment management, checksheet handling, and user administration. New administrators need detailed guidance to understand each page and perform common tasks correctly.

## Goals / Non-Goals

**Goals:**
- Create comprehensive admin guide for system administrators
- Document all admin panel pages and their functionality
- Provide step-by-step instructions for common tasks
- Include Do's and Don'ts for proper system administration
- Explain system features: units, fleet, checksheets, equipment catalog, user management

**Non-Goals:**
- User-facing documentation (separate USERGUIDE.md)
- Technical architecture details
- Troubleshooting for system failures

## Decisions

### 1. Document Structure

**Decision:** Structure the admin guide with these main sections:
1. Introduction - Admin responsibilities and access
2. Admin Panel Overview - Description of each page
3. Do's and Don'ts - Rules for administrators
4. Common Tasks - Step-by-step guides for frequent operations
5. System Features - Detailed explanation of all capabilities

**Rationale:** This structure allows administrators to quickly find information for their immediate needs while having comprehensive reference material.

### 2. Task Coverage

**Decision:** Include detailed guides for:
- Adding new equipment to the catalog
- Creating new units
- Building compartments with equipment items
- Linking compartments for synchronized configuration
- Printing daily checksheets and historical records
- Managing unit status (active, OOS, archived)
- Exporting and importing truck layouts

**Rationale:** These are the most frequent administrative tasks and require clear guidance.

### 3. Content Level

**Decision:** Write at a level appropriate for system administrators - detailed, technical but practical language.

**Rationale:** Administrators need to understand system behavior to make proper configuration decisions.

## Risks / Trade-offs

- **Outdated Information:** System updates may make guide outdated. Mitigated by keeping guide in version control.
- **Length:** Comprehensive guide will be lengthy. Mitigated by using clear section headers and table of contents.

## Migration Plan

1. Write initial draft of ADMINGUIDE.md
2. Review for accuracy and completeness
3. Add to project repository
4. Update as system features change

## Open Questions

- Should admin guide be separate from user guide? (Yes, they serve different audiences)