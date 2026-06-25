## REMOVED Requirements

### Requirement: Unit page may render cached summary before live refresh
**Reason**: The "Prepared summary for EC..." banner is unwanted visual noise. The server-rendered dashboard already displays live data immediately. Crew feedback indicates the banner adds no value to the checkoff workflow.
**Migration**: No migration needed. The server-rendered dashboard continues to display live data as before. The underlying summary cache continues to be populated by the prefetch flow for other consumers.
