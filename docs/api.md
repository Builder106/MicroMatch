# Public API

## GET /api/tasks
Returns public tasks for listings.

### Response (200)
[
  {
    "id": "string",
    "title": "string",
    "shortDescription": "string",
    "tags": ["string"],
    "estimatedMinutes": 30,
    "language": "English"
  }
]

Notes:
- All fields are public, no auth required.
- Pagination may be added later.