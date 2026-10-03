# Security Specification for Volmo Electric Firestore

## 1. Data Invariants

1. **Inquiry Validation**: A Price Inquiry must contain valid customer contact details (name and phone), a scooter model name, and a valid creation timestamp. The ID must conform to standard safe identifier patterns (`^[a-zA-Z0-9_\\-]+$`).
2. **Dealership Application Validation**: Dealership applications require authentic applicant identity, verified contact coordinates (email, phone, location), and an initial application status ('applied').
3. **Site Configuration Security**: Site configuration documents are globally readable so all customer devices display the latest electric vehicle specifications, prices, and branding. Updates are validated for allowable length and structure.
4. **Cloud Photo Storage Security**: Uploaded photos must provide a valid data URI, filename, and creation timestamp. Documents cannot exceed Firestore limits and must have sanitized alphanumeric IDs.
5. **PII and Lead Protection**: Lead queries and status modifications must follow strict field validation to prevent ID poisoning and denial-of-wallet payload attacks.

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)

1. **Ghost Field in Inquiry**: An inquiry payload containing undeclared admin escalation fields like `{ "id": "I-123", "isAdmin": true }`.
2. **Invalid ID Format in Inquiry**: An inquiry write to a path with malicious symbols or oversized ID exceeding 128 characters.
3. **Invalid Phone Type**: Submitting non-string or oversized phone numbers (>20 chars).
4. **Invalid Battery Enum**: Setting `batteryType` to `"NUCLEAR"` or unauthorized string values outside `["LA", "LI"]`.
5. **Oversized Message String**: Injecting a 2MB spam string in `message` (exceeds max length limit).
6. **Dealership Fake Status Escalation**: A new dealership application attempting to create with status `"approved"` rather than `"applied"`.
7. **Missing Required Fields**: Submitting a dealership application without `name`, `phone`, or `email`.
8. **Invalid Email Format/Length**: Submitting an email string greater than 100 characters.
9. **Site Config ID Poisoning**: Trying to create a config section with path injection like `../secrets`.
10. **Site Config Oversized Payload**: Submitting a config payload exceeding maximum string boundary (1MB limit).
11. **Cloud Photo Missing Data**: Creating a photo document with null or missing `dataUrl`.
12. **Cloud Photo Malformed Filename**: Creating a photo with an empty or non-string filename.
