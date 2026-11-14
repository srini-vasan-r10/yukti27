# OPERATIONS — SOP
## YUKTI ’27: Standard Operating Procedure & Technical Architecture Rulebook
**Thiagarajar School of Management (TSM), Madurai**  
**Document Classification:** Internal Technical & Event Operations Rulebook  
**Last Updated:** November 14, 2026  

---

## 1. Executive Process Overview & Core Principles

The YUKTI ’27 event management ecosystem is engineered around an **offline-resilient, two-channel registration pipeline** connecting directly to a central Supabase PostgreSQL database via Vercel Serverless APIs, with a designated Local Event Server acting as the venue authority.

```
                             [ PARTICIPANTS ]
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
  [ ONLINE REGISTRATION ]                         [ SPOT REGISTRATION ]
    • Public Web Form                               • Venue Desk Volunteer Form
    • Gateway: Razorpay / Direct UPI                • Payment: Razorpay / UPI / Fallback
    • Server-side Verification                      • Volunteer Account Verification
    • Permanent ID: Y27-ON-XXXX                     • Permanent ID: Y27-SP-XXXX
    • Thermal Receipt + A4 Pass                     • Manual Email Template Dispatch
            │                                               │
            └───────────────────────┬───────────────────────┘
                                    ▼
                 [ CENTRAL DATABASE — SUPABASE POSTGRESQL ]
                                    ▲
                                    │ Bidirectional Synchronization (Sync Logs)
                                    ▼
                 [ LOCAL EVENT SERVER / REGISTRATION HUB ]
                                    │
                                    ▼
                       [ EVENT-DAY GATE ADMISSION ]
          Delegate ID Lookup ──> Payment Verification ──> Member Check-in
```

### Core Tenets:
1. **Channel-Specific Delegate IDs:** Strict separation of online entrants (`Y27-ON-XXXX`) and on-campus spot registrants (`Y27-SP-XXXX`).
2. **Permanent ID Generation on Verified Credit Only:** No permanent Delegate ID is ever minted prior to verified monetary credit.
3. **One Registration ID, Multi-Member Check-in:** A single payment covers the entire contingent/team under one Delegate ID, while check-ins are recorded per individual participant.
4. **Offline-First Venue Reliability:** Operations must continue with zero degradation during campus-wide network or wide-area internet failure.

---

## 2. Delegate ID & Registration Model

### 2.1 Identifier Structure
* **Online Entry Prefix:** `Y27-ON-0001` through `Y27-ON-9999`
* **Spot Entry Prefix:** `Y27-SP-0001` through `Y27-SP-9999`
* **Storage Entity:** Managed via an atomic PostgreSQL sequence to eliminate race conditions and collisions.

### 2.2 Team vs. Individual Allocation
* **Registration Level:** A single registration record holds the docket, the verified payment, the arena entry, and the master `Delegate ID`.
* **Member Level:** Every team member is registered individually in the `registration_members` entity.
* **Gate Check-in Distinction:** When a team pass (`Y27-ON-XXXX`) is scanned at the gate:
  - The volunteer interface displays a roster of all members under that docket.
  - The volunteer selects the checkbox for the specific member(s) standing at the gate.
  - An independent `checkin` record is created for each admitted human with a unique timestamp.
  - Arrival of one team member does **not** mark the remaining team members as admitted.

---

## 3. Payment Processing & Verification SOP

### 3.1 Online Payment Pipeline
1. **Order Creation:** Client requests an order via `/api/create-order.js` (Razorpay Orders API).
2. **Dual-Channel Confirmation:**
   - **Channel A (Frontend Callback):** Browser posts payload to `/api/verify-payment.js`.
   - **Channel B (Asynchronous Webhook):** Razorpay server posts directly to `/api/razorpay-webhook.js`.
3. **Idempotency Guarantee:** Both endpoints verify the cryptographic HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`. The first to arrive transitions the payment state to `PAID` and provisions `Y27-ON-XXXX`. The subsequent call detects the completed state and safely returns the existing record.
4. **Failure Handling:** Failed attempts remain logged in the `payments` entity as `FAILED`, retaining the master record as `PENDING_PAYMENT` to permit clean retries without orphaned registrations.

### 3.2 Spot Registration & Offline Fallback Protocol
```
                   [ SPOT REGISTRATION AT DESK ]
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [ GATEWAY OPERATIONAL ]           [ GATEWAY OUTAGE ]
       • Collect via Razorpay / UPI      • Attempt alternate UPI QR
       • Instant server verification     • If gateways down: Emergency Personal Account
       • Status: PAID                    • MANDATORY: Verify bank credit via SMS/App
                                         • Upload payment screenshot to Google Drive
                                         • Record volunteer ID in offline ledger
```
* **Strict Operational Rule:** A transaction screenshot shown by a delegate is **supporting evidence only**, never proof of credit. The volunteer must verify actual credit in the destination bank account before marking a payment as verified.

---

## 4. QR Security & Authenticated Cryptography

### 4.1 Cryptographic Standard: AES-256-GCM
Pass QR codes do not expose raw names, phone numbers, or emails. The QR encodes an authenticated encrypted token:

```
[ A4 Pass QR Data ] ──> AES-256-GCM (Payload + 12-byte IV + 16-byte Auth Tag)
                                   │
                                   ▼
                       [ Gate Phone Scanner ]
                                   │
                                   ▼
                    [ POST /api/gate/verify ]
                                   │
                                   ▼
               Server Decrypts & Validates Auth Tag
                                   │
                                   ▼
           Retrieves & Displays Registration Roster in DB
```

* **Payload Structure:**
  ```json
  {
    "did": "Y27-ON-0042",
    "tid": "uuid-v4-token-identifier",
    "iat": 1794646800
  }
  ```
* **Nonce Integrity:** Every encryption call uses a cryptographically secure 12-byte initialization vector (`iv`).
* **Hardware Compatibility:** The 1D barcode on the pass outputs a pure **Code 128 (Subset B)** character sequence containing the alphanumeric Delegate ID, calibrated with compliant quiet margins for handheld laser scanners.

---

## 5. Offline-First Venue Architecture

### 5.1 Central Local Event Server (Architecture Model A)
During event days, registration desks and gate scanners connect to a dedicated **Local Event Server** over an isolated venue Wi-Fi network (LAN), independent of WAN internet status.

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 CENTRAL CLOUD (Supabase)                    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │ Internet Available
                                 ▼ (Sync Queue)
  ┌─────────────────────────────────────────────────────────────┐
  │        LOCAL EVENT SERVER / VENUE AUTHORITY (LAN HUB)       │
  │  • Embedded PostgreSQL / SQLite Local Cache                 │
  │  • Local Atomic Sequence: Y27-SP-XXXX                       │
  │  • Real-Time Check-In State Machine                         │
  └──────────────┬───────────────────────────────┬──────────────┘
                 │ Local Wi-Fi (Offline Capable) │
                 ▼                               ▼
      [ REGISTRATION DESKS ]             [ GATE ADMISSION PHONES ]
      • Spot Form Entry                  • Camera QR / Barcode Scan
      • Mobile Duplicate Detection       • Member Checkbox Check-in
      • Offline Ledger Entry             • Duplicate Entry Lockout
```

### 5.2 Pre-Event Operational Checklist
1. **Database Snapshot:** Export all confirmed online registrations, payment states, and cryptographic verification keys from Supabase to the Local Server.
2. **Sequence Pre-Allocation:** Reserve offline blocks for spot IDs (`Y27-SP-0001` upwards).
3. **Local Network Lockdown:** Verify all gate phones and desk laptops can access the local server IP with static DHCP leases.

### 5.3 Duplicate Check-in Prevention
* Check-in queries are evaluated against the Local Server's live state.
* If a pass is scanned a second time:
  - System immediately triggers: `ALREADY CHECKED IN — PLEASE WAIT FOR COORDINATOR`.
  - Displays the exact time and gate where the previous check-in occurred.
  - Entry is locked until an authorized coordinator issues an override.

### 5.4 Re-Synchronization Protocol
* All offline transactions, check-ins, and spot creations write to a local `sync_logs` table.
* Once WAN connectivity is restored, the synchronization engine executes an idempotent batch upsert to Supabase PostgreSQL.
* Conflicted records (e.g. duplicate payments) are flagged for coordinator review.

---

## 6. Logical Database Schema Architecture

The database comprises eight normalized entities:

| Entity | Primary Key | Critical Foreign Keys | Purpose & Constraints |
| :--- | :--- | :--- | :--- |
| **`registrations`** | `id` (UUID) | `delegate_id` | Master docket, college, arena, status (`PENDING_PAYMENT`, `PAID`, `CANCELLED`), channel (`online`, `spot`). |
| **`registration_members`** | `id` (UUID) | `registration_id` | Individual member names, roles (`Leader`, `Member`), phone, email, college ID number. |
| **`payments`** | `id` (UUID) | `registration_id` | 1-to-Many attempts: mode (`Razorpay`, `UPI`, `Fallback`), amount, txn ref, verification status, verified by. |
| **`delegate_ids`** | `delegate_id` | `registration_id` | Atomic sequence and mapping registry for `Y27-ON-XXXX` and `Y27-SP-XXXX`. |
| **`checkins`** | `id` (UUID) | `member_id` | Admission timestamps, gate location, scanning volunteer account. |
| **`volunteers`** | `id` (UUID) | — | Staff accounts with role-based access (`gate_scanner`, `desk_operator`, `coordinator`). |
| **`audit_logs`** | `id` (UUID) | `volunteer_id` | Immutable historical tracking (`action`, `target_table`, `previous_value`, `new_value`, `timestamp`). |
| **`sync_logs`** | `id` (UUID) | `record_id` | Offline synchronization state (`pending`, `synced`, `conflict`), payload, retry counters. |

---

## 7. Operational Roles & Security Governance

### 7.1 Gate Volunteer Permissions
* **Permitted:** Scan QR/barcode, enter Delegate ID manually, view participant status, check in individual members.
* **Prohibited:** Cannot edit participant details, cannot mark unpaid records as paid, cannot reverse a check-in.

### 7.2 Registration Desk Volunteer Permissions
* **Permitted:** Create spot registrations, perform duplicate phone lookups, search forgotten IDs by name/college, mark manual UPI/fallback payments after verifying account credit.
* **Prohibited:** Cannot delete registrations or reverse check-in states.

### 7.3 Coordinator Permissions
* **Full Administrative Authority:** Correct mistaken participant data, re-assign arenas, verify uncertain payments, reverse accidental check-ins.
* **Accountability:** Every coordinator action triggers an automatic row in `audit_logs`.

---

## 8. Development & Rollout Roadmap

* **Phase 1: Database Schema & Migrations** — Supabase PostgreSQL migration script incorporating all 8 tables, foreign key constraints, and sequential ID functions.
* **Phase 2: Backend APIs & Payment Processing** — Order generation, server-side HMAC verification, and idempotency.
* **Phase 3: Webhook & Payment Reconciliation** — Razorpay webhook integration and automated state reconciliation.
* **Phase 4: Credentials, Passes & Receipts** — True A4 print calibration, thermal receipt docking, and AES-256-GCM QR generation.
* **Phase 5: Offline-First Local Server** — Local hub daemon, LAN synchronization service, and sync conflict resolver.
* **Phase 6: Gate Admission Interface** — Mobile browser camera scanner, live member checklist, and duplicate check-in lockout.
* **Phase 7: Spot Desk & Coordinator Portal** — Spot registration wizard, forgotten ID search, financial ledger, and live counters.
* **Phase 8: Venue Stress Testing** — Simulated gateway outages, network disconnections, concurrent scans, and payment retries.
