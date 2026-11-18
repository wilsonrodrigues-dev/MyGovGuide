# Persisted scheduler

Start `npm run worker` as a dedicated native Node process. It runs both the job consumer and schedule dispatcher. The web API does not execute scraping in browser requests. Multiple workers are supported through MongoDB compare-and-set claims, transactions and unique keys.

The dashboard stores schedules in `collectionschedules`: name, enabled, frequency, local time, weekday, five-field cron, IANA timezone, source IDs, fixture/live mode, revision, next run, last dispatch and last outcome. Default timezone is `Asia/Kolkata`. Daily/twice-daily/weekly presets generate the cron expression from local time. Twice daily uses the selected hour and twelve hours later. Weekly uses the selected weekday. CUSTOM uses the supplied deterministic five-field expression.

Validation uses cron-parser 5.10.6 with timezone/DST handling. Seconds-level expressions, invalid zones, impossible syntax, random H fields and intervals below a minute are rejected. For example, `0 6 * * *` in Asia/Kolkata runs at 06:00 IST (00:30 UTC). `0 6,18 * * *` runs at 06:00 and 18:00 IST. `0 6 * * 1` runs Mondays.

New schedules default OFF. Validate, save, then turn ON. OFF persists across API/worker restarts and prevents future dispatches. Turning OFF does not cancel an already queued job; cancel that job in history separately. An edit or activation change increments the revision and recalculates next execution. Next/last values are stored as UTC instants and the current dashboard displays timestamps in IST with the configured schedule zone identified beside its cron.

Each dispatcher transaction claims the exact enabled schedule revision and due timestamp, advances nextRun and queues each eligible source with a unique schedule/revision/due/source key. Concurrent ticks cannot queue the same slot twice. A source already queued/running is recorded as skipped overlap. A source losing authorization is blocked even if its schedule remains ON. Live schedules cannot be enabled without an activated, separately validated source plus the server live switch.

On downtime, the dispatcher sends one overdue occurrence at restart and advances to the next future occurrence; it does not flood all missed intervals. Database transactions make slot advancement and queued jobs atomic. Worker process crashes leave leases for safe recovery; SIGINT/SIGTERM stop after the current tick/job. Hard termination is recovered after lease expiry.

For hosted deployment, run the Node worker under the hosting platform's process supervisor. Alternatively, invoke an internal dispatcher command on a fixed external timer, with database-persisted schedules remaining authoritative. Keep that entry private and authenticated; no public unauthenticated cron webhook exists. GitHub Actions cannot dynamically rewrite its cron from this dashboard. The existing Actions workflow is independent of the MongoDB schedule editor and must not be treated as synchronized.
