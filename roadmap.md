# Cyberelay — Product & Development Roadmap

> Used-computer discovery, comparison, and pricing intelligence platform.

**Website:** cyberelay.ca  
**Stack:** Next.js · TypeScript · Supabase · PostgreSQL · Vercel  
**Repository:** Cyberelay GitHub repository

---

# Project Status

Current stage:

**V1 — Core Marketplace Infrastructure**

Current milestone:

**Listing Images implementation and production verification**

Progress legend:

- ✅ Completed
- 🟡 In Progress / Current
- ⬜ Planned
- 🔵 Future
- 💡 Optional / dependent on product validation

---

# Phase 0 — Project Foundation

## 0.1 Product Definition

- [x] Define Cyberelay concept
- [x] Focus initial marketplace on used computers/laptops
- [x] Define seller → Cyberelay → Facebook Marketplace workflow
- [x] Define structured computer specifications
- [x] Define V1 boundaries
- [x] Decide not to process payments in V1
- [x] Decide not to provide shipping in V1
- [x] Decide not to provide buyer protection in V1
- [x] Decide not to scrape Facebook Marketplace
- [x] Define long-term PC Value direction

**Status: ✅ Complete**

---

# Phase 1 — Public Cyberelay V1 Website

## 1.1 Application Foundation

- [x] Create Next.js application
- [x] Configure TypeScript
- [x] Use Next.js App Router
- [x] Create responsive site layout
- [x] Create navigation/header
- [x] Deploy application to Vercel
- [x] Connect GitHub repository to Vercel
- [x] Verify automatic deployment workflow

## 1.2 Public Pages

- [x] Homepage
- [x] Browse Computers page
- [x] Computer detail pages
- [x] Sell page placeholder
- [x] About page

## 1.3 Demo Inventory

- [x] Add initial demo computer inventory
- [x] Computer cards
- [x] Computer specification display
- [x] Price display
- [x] Location display
- [x] Facebook Marketplace outbound link

## 1.4 Computer Search & Filtering

- [x] Search
- [x] Brand filter
- [x] CPU filter
- [x] RAM filter
- [x] Storage filter
- [x] Condition filter
- [x] Price filter
- [x] AND logic between selected filters
- [x] Clear/reset filters
- [x] No-results state
- [x] Correct RAM/storage exact-match behaviour

**Status: ✅ Complete**

---

# Phase 2 — Production Infrastructure

## 2.1 GitHub / Deployment Infrastructure

- [x] Create dedicated Cyberelay GitHub account
- [x] Configure Cyberelay repository
- [x] Connect ChatGPT development workflow to Cyberelay GitHub
- [x] Verify repository read access
- [x] Verify repository write access
- [x] Create dedicated Cyberelay Vercel setup
- [x] Connect repository to Vercel
- [x] Verify production deployment
- [x] Connect and verify `cyberelay.ca` production domain

## 2.2 Supabase Project

- [x] Create Cyberelay Supabase project
- [x] Enable Data API
- [x] Configure publishable API credentials
- [x] Add Supabase environment variables to Vercel

Environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 2.3 Database Schema

- [x] Create `profiles`
- [x] Create `listings`
- [x] Create `listing_images`
- [x] Create `listing_price_history`
- [x] Create structured enums
- [x] Add database validation constraints
- [x] Add database indexes
- [x] Add automatic `updated_at` handling
- [x] Add automatic profile creation trigger
- [x] Add automatic price-history tracking
- [x] Protect original asking price

## 2.4 Database Security

- [x] Enable Row Level Security
- [x] Configure public active-listing access
- [x] Configure seller ownership policies
- [x] Prevent sellers from modifying other sellers' listings
- [x] Restrict direct price-history modification
- [x] Keep service/secret credentials out of frontend

## 2.5 Supabase Application Connection

- [x] Install/configure Supabase client
- [x] Connect Next.js application to Supabase
- [x] Use environment variables
- [x] Preserve existing V1 behaviour
- [x] Verify production build
- [x] Push Supabase integration to `main`
- [x] Verify Vercel deployment
- [x] Configure production authentication URLs
- [x] Configure Resend custom SMTP and domain authentication

**Status: ✅ Complete**

---

# Phase 3 — Seller Authentication

## 3.1 Authentication

- [x] Seller sign-up
- [x] Seller login
- [x] Seller logout
- [x] Email confirmation handling
- [x] Auth session persistence
- [x] Secure server-side authentication
- [x] Authentication redirects

## 3.2 Seller Profile

- [x] Verify automatic profile creation after registration in production
- [x] Pass seller display name to Supabase Auth metadata
- [x] Verify Auth user → profile relationship in production
- [ ] Seller profile management

## 3.3 Protected Seller Area

- [x] Create `/seller` protected placeholder
- [x] Protect seller routes
- [x] Redirect unauthenticated users to login
- [x] Redirect authenticated sellers appropriately

**Status: ✅ Complete — production authentication flow verified**

---

# Phase 4 — Seller Dashboard

> 🚩 CURRENT DEVELOPMENT PHASE

## 4.1 Dashboard Foundation

- [x] Seller dashboard layout
- [x] Display authenticated seller's listings
- [x] Load seller profile and display-name welcome
- [x] Display status summary counts
- [x] Empty and database-error states
- [x] Verify profile welcome, zero counts, empty state, and logout in production
- [ ] Active listings section
- [ ] Draft listings section
- [ ] Sold listings section
- [ ] Expired listings section
- [ ] Archived listings section

## 4.2 Listing Management

- [x] Create private draft listing
- [x] Edit listing
- [x] Publish listing
- [x] Mark listing as sold
- [x] Archive listing
- [x] Reactivate eligible listing

## 4.3 Seller Listing Status

Supported lifecycle:

`draft → active → sold / expired / archived`

- [x] Draft publish control
- [x] Published date
- [x] Active listing mark-sold control
- [x] Sold date
- [x] Sold price
- [ ] Availability confirmation

**Status: 🟡 Current / In Progress**

---

# Phase 5 — Structured Listing Form

## 5.1 Computer Specifications

Create controlled/standardized inputs for:

- [x] Brand
- [x] Model
- [x] CPU brand
- [x] CPU family
- [x] CPU model
- [x] RAM
- [x] Storage capacity
- [x] Storage type
- [x] GPU type
- [x] GPU brand
- [x] GPU model
- [x] Screen size
- [x] Resolution
- [x] Operating system
- [x] Condition
- [x] Battery health
- [x] Price
- [x] City
- [x] Province
- [x] Facebook Marketplace URL
- [x] Description
- [x] Cosmetic notes

## 5.2 Validation

- [x] Controlled RAM values
- [x] Controlled storage values
- [x] Controlled storage types
- [x] Controlled condition values
- [x] CPU brand/family normalization
- [x] Filter CPU family choices by selected CPU brand
- [x] Use Apple M-series chip choices without a duplicate CPU model field
- [x] GPU type/brand normalization
- [x] Battery health 0–100 validation
- [x] Positive price validation stored as integer cents
- [x] Facebook Marketplace URL validation
- [x] Required-field validation
- [x] Server-side validation

## 5.3 Structured Data Rules

Important filterable data must remain standardized.

Examples:

`16GB RAM → ram_gb = 16`

`1TB NVMe SSD → storage_gb = 1024 + storage_type = nvme_ssd`

Seller-entered free text must not directly create filter values.

**Status: 🟡 Implementation complete — production draft verified; ownership/RLS verification pending**

---

# Phase 6 — Listing Images

## 6.1 Supabase Storage

- [x] Create listing-images storage bucket
- [x] Configure Storage RLS
- [x] Seller-owned image permissions
- [x] Image upload
- [x] Image deletion
- [x] Image replacement through delete and upload

## 6.2 Image Management

- [x] Multiple images per listing
- [x] Primary image
- [x] Image ordering
- [x] File-type validation
- [x] File-size limits
- [x] Browser-side resize and WebP conversion strategy

**Status: 🟡 Current / In Progress — core flow verified; WebP and isolation production tests pending**

---

# Phase 7 — Database-Driven Public Inventory

This is the point where demo/hard-coded inventory is removed.

## 7.1 Inventory Migration

- [ ] Replace `data/computers.ts`
- [ ] Query active listings from Supabase
- [ ] Update `/computers`
- [ ] Update computer detail pages
- [ ] Handle loading/error/empty states

## 7.2 Dynamic Filters

Generate filter options from standardized values present in active inventory.

Example:

If inventory contains:

`256GB / 512GB / 1024GB`

display:

`256GB / 512GB / 1TB`

- [ ] Dynamic brand options
- [ ] Dynamic CPU options
- [ ] Dynamic RAM options
- [ ] Dynamic storage options
- [ ] Dynamic condition options
- [ ] Dynamic location options where appropriate
- [ ] Preserve AND filter logic
- [ ] Preserve clear/reset filters

**Status: ⬜ Planned**

---

# Phase 8 — Listing Freshness & Marketplace Link Health

Cyberelay should not assume that Facebook Marketplace listings remain active forever.

## 8.1 Seller Availability Confirmation

- [ ] Track `availability_confirmed_at`
- [ ] Allow seller to confirm "Still Available"
- [ ] Display stale-listing warnings where appropriate
- [ ] Expire listings after defined inactivity rules

## 8.2 Facebook Marketplace Link Health

Existing database fields:

- `facebook_last_checked_at`
- `facebook_link_status`
- `facebook_check_failures`
- `availability_confirmed_at`

Planned statuses:

- `unknown`
- `reachable`
- `unreachable`
- `needs_review`

## 8.3 Scheduled Checks

- [ ] Create server-side link-health endpoint
- [ ] Configure scheduled job
- [ ] Run approximately daily
- [ ] Select listings due for a 15-day check
- [ ] Process checks in controlled batches
- [ ] Record check result
- [ ] Retry temporary failures
- [ ] Flag repeated failures for seller review

Important:

**A failed Facebook URL check must NOT automatically mean the computer is sold.**

Cyberelay will not scrape Marketplace page content to determine listing status.

**Status: ⬜ Planned**

---

# Phase 9 — Marketplace Analytics

## 9.1 Listing Analytics

- [ ] Listing view tracking
- [ ] Facebook Marketplace outbound-click tracking
- [ ] Listing age
- [ ] Days on market
- [ ] Price-change history
- [ ] Seller availability confirmations

## 9.2 Sales Data

Preserve:

- [ ] Original asking price
- [ ] Current asking price
- [ ] Sold price
- [ ] Sold date
- [ ] Sale channel
- [ ] Days to sale

## 9.3 Internal Data

Where applicable:

- [ ] Acquisition/purchase cost
- [ ] Internal margin information

Internal business data must not be exposed publicly.

**Status: 🔵 V1.5**

---

# Phase 10 — Search & Discovery Improvements

- [ ] Improved search
- [ ] Multi-select filters
- [ ] Sorting
- [ ] Price low → high
- [ ] Price high → low
- [ ] Newest listings
- [ ] Recently updated
- [ ] Pagination / infinite loading
- [ ] Location-based discovery
- [ ] SEO-friendly listing pages
- [ ] Structured metadata
- [ ] Better mobile filtering UX

**Status: 🔵 Future**

---

# Phase 11 — Computer Comparison

One of Cyberelay's major differentiators from generic classified sites.

- [ ] Add to Compare
- [ ] Compare 2–4 computers
- [ ] CPU comparison
- [ ] RAM comparison
- [ ] Storage comparison
- [ ] GPU comparison
- [ ] Display comparison
- [ ] Battery comparison
- [ ] Condition comparison
- [ ] Price comparison
- [ ] Highlight specification differences
- [ ] Price/performance indicators

**Status: 🔵 Future**

---

# Phase 12 — PC Value Data Foundation

Before building valuation models, Cyberelay needs sufficient clean historical data.

Required datasets:

- [ ] Structured specifications
- [ ] Asking-price history
- [ ] Sold-price history
- [ ] Listing age
- [ ] Days on market
- [ ] Condition
- [ ] Battery health
- [ ] Location
- [ ] Price reductions
- [ ] Seller-confirmed sale data

**Status: 🔵 Data Collection Phase**

---

# Phase 13 — PC Value V1

Major future Cyberelay feature.

Potential outputs:

- [ ] Fair-market value
- [ ] Quick-sale value
- [ ] Recommended listing price
- [ ] Buyer deal score
- [ ] Comparable computers
- [ ] Price history
- [ ] Estimated time to sell

Example:

Cyberelay PC Value

Fair Market Value: $525  
Quick Sale: $475  
Recommended Listing: $549  
Current Asking Price: $450  
Deal Score: 9.1 / 10

PC Value should initially prioritize explainable comparable-based valuation rather than unnecessarily complex ML.

**Status: 🔵 V3**

---

# Phase 14 — Multi-Seller Platform

Once the core listing workflow has been validated:

- [ ] Expanded seller profiles
- [ ] Seller listing management
- [ ] Seller reputation signals
- [ ] Seller analytics
- [ ] Seller inventory tools
- [ ] Dealer/business accounts
- [ ] Moderation tools
- [ ] Listing reporting
- [ ] Abuse prevention
- [ ] Admin management tools

**Status: 🔵 V2 / V4 depending on feature**

---

# Phase 15 — Dealer / Business Tools

Potential professional seller functionality:

- [ ] Bulk inventory management
- [ ] CSV/import tools
- [ ] Inventory analytics
- [ ] Pricing recommendations
- [ ] Aging inventory reports
- [ ] Dealer dashboards
- [ ] Market pricing intelligence
- [ ] Inventory valuation
- [ ] API/integration possibilities

**Status: 🔵 V4**

---

# Phase 16 — Potential Full Marketplace

Only build this if Cyberelay has validated demand and sufficient scale.

Potential functionality:

- [ ] Native buyer/seller messaging
- [ ] Offers
- [ ] Transactions
- [ ] Payments
- [ ] Seller payouts
- [ ] Shipping
- [ ] Buyer protection
- [ ] Dispute handling
- [ ] Fraud controls

These systems are explicitly **out of scope for current V1**.

**Status: 💡 V5 / Product-validation dependent**

---

# High-Level Roadmap

## V1 — Core Platform

Public website  
→ Structured database  
→ Seller authentication  
→ Seller dashboard  
→ Structured Add Listing
→ Edit / Publish / Mark Sold
→ Image upload  
→ Database-driven inventory  
→ SEO & AI Discovery Foundation
→ Acquisition / Analytics
→ PC Value

## V1.5 — Data & Analytics

Views  
→ Outbound clicks  
→ Price history  
→ Sold data  
→ Days on market  
→ Better search/discovery

## V2 — Multi-Seller Platform

Seller ecosystem  
→ Moderation  
→ Seller tools  
→ Platform scaling

## V3 — PC Value

Comparable computers  
→ Fair-market value  
→ Quick-sale value  
→ Recommended price  
→ Deal score  
→ Time-to-sell estimates

## V4 — Business / Dealer Tools

Inventory analytics  
→ Pricing intelligence  
→ Bulk management  
→ Dealer tools

## V5 — Potential Full Marketplace

Only if justified by demand:

Transactions  
→ Payments  
→ Shipping  
→ Buyer protection

---

# Current Position

As of the current development state:

Phase 0 — Foundation                 ██████████ 100%
Phase 1 — Public V1                 ██████████ 100%
Phase 2 — Infrastructure            ██████████ 100%
Phase 3 — Seller Authentication     ██████████ 100%
Phase 4 — Seller Dashboard          █████████░  90%
Phase 5 — Structured Listing Form   █████████░  90%  ← VERIFY IN PRODUCTION
Phase 6 — Images                    █████████░  90%  ← CURRENT
Phase 7 — Database Inventory        ░░░░░░░░░░   0%
Phase 8 — Listing Freshness         ░░░░░░░░░░   0%

Current development path:

YOU ARE HERE
     ↓
Seller Authentication ✅
     ↓
Seller Dashboard ← YOU ARE HERE
     ↓
Structured Add Listing
     ↓
Edit / Publish / Mark Sold
     ↓
Photo Upload
     ↓
Database-Driven Inventory
     ↓
SEO & AI Discovery Foundation
     ↓
Acquisition / Analytics
     ↓
PC Value
     ↓
Dealer Tools
     ↓
Potential Full Marketplace

---

# Development Principles

1. GitHub is the source of truth for production code.
2. Production changes flow through GitHub → Vercel.
3. Important computer specifications use standardized structured data.
4. Seller free text must not directly create filter values.
5. Preserve historical listing and pricing data where practical.
6. Do not expose private seller or internal business information.
7. Do not scrape Facebook Marketplace.
8. Do not prematurely build payments/shipping/transaction infrastructure.
9. Build clean data foundations before PC Value.
10. Keep V1 architecture simple while preserving a path toward the long-term platform.

---

# Next Milestone

## Production Verification — Structured Add Listing

Seller Dashboard Foundation now includes:

- Server-verified protected dashboard
- Seller profile welcome with safe fallback
- Seller-owned listing query protected by RLS
- Active, draft, sold, expired, and archived summary counts
- Lightweight listing cards
- Empty and database-error states
- Responsive Cyberelay styling
- Production verification of profile welcome, zero counts, empty state, and logout

Structured Add Listing implementation now includes:

- Controlled computer specification inputs
- Server-side validation and normalization
- Integer-cent pricing with original-price preservation
- Server-generated listing title from normalized specifications
- CPU family choices filtered by selected CPU brand
- Apple M-series chip selection without duplicate CPU model entry
- Server-generated unique slug
- Authenticated `seller_id` assignment
- Private draft creation through existing RLS
- Dashboard draft count and listing display

Before Edit / Publish / Mark Sold, verify in production:

- [x] Create a draft from `/seller/listings/new`
- [ ] Confirm the draft belongs to the authenticated seller
- [x] Confirm another seller cannot open the seller-owned edit page (404)
- [ ] Confirm another seller cannot directly modify the draft
- [ ] Confirm dashboard draft count, price, status, dates, and location
- [ ] Confirm invalid data is rejected without creating a row

Edit / Publish / Mark Sold implementation now includes:

- Seller-owned edit route using the structured listing form
- Server-side validation for listing updates
- Draft → active publishing with `published_at`
- Active → sold transition with seller-entered sold price and `sold_at`
- Server authentication, seller ownership filters, and existing RLS on every mutation
- Original asking price remains unchanged when the current asking price is edited

Production tests still required:

- [x] Edit a seller-owned draft and confirm dashboard changes
- [x] Publish a draft and confirm active status and published date
- [x] Mark an active listing sold and confirm sold price/date
- [x] Confirm another seller cannot access the listing edit route (404)
- [ ] Confirm another seller cannot directly publish, archive, reactivate, or mark the listing sold
- [ ] Confirm sold and archived listings cannot be edited

Archive / Reactivate implementation now includes:

- Draft, active, and expired listings can be archived
- Archived listings restore safely as private drafts
- Expired listings can reactivate as active with refreshed availability confirmation
- Sold listings cannot be restored or reactivated
- Every transition checks the server session, seller ownership, current status, and existing RLS

Production tests required:

- [x] Archive a draft and confirm the archived count
- [x] Restore an archived listing and confirm it becomes a private draft
- [x] Archive an active listing
- [x] Reactivate an expired listing
- [ ] Confirm another seller cannot perform any lifecycle action

**After verification, begin Listing Images.**

Listing Images implementation now includes:

- Private `listing-images` bucket with 5 MB JPEG, PNG, and WebP restrictions
- Seller/listing-scoped Storage paths and existing RLS enforcement
- Up to eight images per listing
- Server-generated short-lived signed image URLs
- Upload, delete, primary-image selection, and ordering controls
- Automatic primary fallback after deleting the primary image
- Primary image displayed on the seller dashboard
- Browser-side resize to a maximum 1,600px dimension
- Automatic WebP conversion at 0.82 quality before Storage upload
- No public inventory migration and no service-role key

Production tests required:

- [x] Upload one valid image to a seller-owned listing
- [x] Upload multiple images successfully
- [x] Confirm the eight-image limit
- [x] Reject an unsupported format or image larger than 5 MB
- [x] Change the primary image
- [x] Reorder images
- [x] Delete a primary and non-primary image
- [x] Confirm the dashboard displays the primary image
- [ ] Confirm a new JPEG or PNG upload is stored as `.webp`
- [ ] Confirm an image larger than 1,600px is resized correctly
- [ ] Confirm portrait orientation and acceptable visual quality
- [ ] Confirm another seller cannot view or modify private listing images

**After WebP and isolation verification, begin Database-driven Inventory.**
