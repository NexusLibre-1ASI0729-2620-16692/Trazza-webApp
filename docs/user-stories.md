# User Stories

## Overview
This document contains the user stories and requirement traceability for the Trazza web application built by NexusLibre with Angular and TypeScript. Stories are grouped by bounded context: IAM & Profiles, Matchmaking & Routing, Service Execution & Monitoring, Payment & Billing, Loyalty & Reputation and Shared.

## Requirement Traceability Matrix (RTM)

| User Story | Bounded Context | Implemented Elements |
|:--|:--|:--|
| **US-001: Sign Up as Carrier** | IAM & Profiles | `SignUp`, `IamStore`, `IamApi`, `UsersApiEndpoint`, `CarrierProfilesApiEndpoint`, `SignUpCommand`, `User`, `CarrierProfile`, `Dni`, `Email`, `Phone` |
| **US-002: Sign Up as Merchant** | IAM & Profiles | `SignUp`, `IamStore`, `IamApi`, `MerchantProfilesApiEndpoint`, `SignUpCommand`, `User`, `MerchantProfile`, `Ruc` |
| **US-003: Sign In** | IAM & Profiles | `SignIn`, `IamStore`, `IamApi`, `UsersApiEndpoint`, `SignInCommand`, `UserAssembler`, `User` |
| **US-004: Sign Out** | IAM & Profiles | `SideMenu`, `IamStore` |
| **US-005: Route Protection by Authentication and Role** | IAM & Profiles | `iamGuard`, `publicOnlyGuard`, `iamInterceptor`, `IamStore`, `app.routes` |
| **US-006: Manage Profile** | IAM & Profiles | `Profile`, `ProfileStore`, `IamStore`, `CarrierProfileAssembler`, `MerchantProfileAssembler`, `CarrierProfile`, `MerchantProfile`, `Phone` |
| **US-007: Register a Vehicle** | IAM & Profiles | `VehicleForm`, `ProfileStore`, `CarrierProfile`, `Vehicle`, `LicensePlate`, `LoadCapacity` |
| **US-008: Manage Vehicles** | IAM & Profiles | `VehicleList`, `VehicleCard`, `VehicleForm`, `ProfileStore`, `CarrierProfile`, `Vehicle` |
| **US-009: Publish a Return Route** | Matchmaking & Routing | `ReturnRouteForm`, `MatchmakingStore`, `MatchmakingApi`, `ReturnRoute`, `TimeWindow`, `CargoType`, `Address`, `RouteMatchingService` |
| **US-010: View and Close Return Routes** | Matchmaking & Routing | `ReturnRouteList`, `MatchmakingStore`, `ReturnRoute`, `MatchProposal` |
| **US-011: View Load Suggestions** | Matchmaking & Routing | `LoadSuggestions`, `LoadSuggestionCard`, `MatchmakingStore`, `RouteMatchingService`, `Detour` |
| **US-012: Accept the Rate of a Load** | Matchmaking & Routing | `LoadDetail`, `MatchmakingStore`, `MatchProposal`, `Money` |
| **US-013: Propose Another Rate** | Matchmaking & Routing | `LoadDetail`, `CounterOfferPanel`, `MatchmakingStore`, `MatchProposal` |
| **US-014: Create a Freight Request** | Matchmaking & Routing | `FreightRequestForm`, `AddressFields`, `MatchmakingStore`, `FreightRequest`, `Cargo`, `TimeWindow`, `Money` |
| **US-015: Manage Freight Requests** | Matchmaking & Routing | `FreightRequestList`, `MatchmakingStore`, `FreightRequest`, `MatchProposal` |
| **US-016: Find Carriers and Send an Offer** | Matchmaking & Routing | `FindCarriers`, `CarrierCard`, `OfferAmountDialog`, `MatchmakingStore`, `RouteMatchingService`, `MatchProposal` |
| **US-017: Negotiate an Offer** | Matchmaking & Routing | `OfferList`, `OfferDetail`, `LoadDetail`, `CounterOfferPanel`, `OfferAmountDialog`, `MatchmakingStore`, `MatchProposal`, `ProposalStatus` |
| **US-018: Confirm a Match** | Matchmaking & Routing / Service Execution | `OfferDetail`, `MatchmakingStore`, `ExecutionStore`, `MatchProposal`, `FreightRequest`, `ReturnRoute`, `Shipment` |
| **US-019: Confirm Pickup** | Service Execution & Monitoring | `ActiveTrip`, `ExecutionStore`, `Shipment`, `ShipmentStatus` |
| **US-020: Share Live Location and Detect Deviations** | Service Execution & Monitoring | `ActiveTrip`, `TrackingMap`, `MapProvider`, `ExecutionStore`, `Shipment`, `GeoLocation`, `NotificationStore` |
| **US-021: Confirm Delivery** | Service Execution & Monitoring / Loyalty & Reputation | `ActiveTrip`, `ExecutionStore`, `Shipment`, `RatingDialog` |
| **US-022: Track a Shipment** | Service Execution & Monitoring | `ShipmentTracking`, `ShipmentTimeline`, `TrackingMap`, `MapProvider`, `ExecutionStore`, `Shipment` |
| **US-023: Confirm Reception** | Service Execution & Monitoring | `ShipmentTracking`, `ExecutionStore`, `Shipment`, `RatingDialog` |
| **US-024: Report an Incident** | Service Execution & Monitoring | `IncidentDialog`, `ExecutionStore`, `Shipment`, `Incident`, `IncidentType` |
| **US-025: View Trip and Shipment History** | Service Execution & Monitoring | `TripHistory`, `ShipmentHistory`, `ShipmentHistoryTable`, `ExecutionStore`, `ReputationStore` |
| **US-026: View Plan and Usage** | Payment & Billing | `PlanBilling`, `BillingStore`, `MatchmakingStore`, `SubscriptionPlan` |
| **US-027: Upgrade to Pro** | Payment & Billing | `PlanBilling`, `CheckoutDialog`, `BillingStore`, `PaymentGateway`, `PaymentTransaction`, `PaymentMethod` |
| **US-028: Receive an Electronic Receipt** | Payment & Billing | `ReceiptDialog`, `BillingStore`, `Receipt`, `ReceiptType` |
| **US-029: Enforce the Publication Limit** | Payment & Billing / Matchmaking & Routing | `BillingStore`, `MatchmakingStore`, `SubscriptionPlan` |
| **US-030: Rate the Counterpart** | Loyalty & Reputation | `RatingDialog`, `StarRating`, `ReputationStore`, `Rating`, `Score`, `RatingTarget` |
| **US-031: View Reputation** | Loyalty & Reputation | `RatingList`, `StarRating`, `Profile`, `LoadSuggestionCard`, `CarrierCard`, `ReputationStore` |
| **US-032: View Dashboard** | Shared | `Dashboard`, `MatchmakingStore`, `ExecutionStore`, `ReputationStore` |
| **US-033: Switch Language** | Shared | `LanguageSwitcher`, `TopBar`, `LocaleService`, `TrazzaTitleStrategy`, `public/i18n` |
| **US-034: View Page Not Found** | Shared | `PageNotFound`, `app.routes` |
| **US-035: Receive In-App Alerts** | Shared | `TopBar`, `NotificationStore`, `FeedbackService` |

## US-001: Sign Up as Carrier

**Description:** As a carrier, I want to create an account with my DNI so that I can publish my return trips.

### Acceptance Criteria

#### Scenario 1: Registering with valid data
Given the visitor selects "I'm a Carrier" and enters full name, email, phone, an 8-digit DNI, matching passwords of at least 8 characters and accepts the terms  
When the visitor submits the sign-up form,  
Then the system creates the user and the carrier profile, opens a session and shows the carrier dashboard

#### Scenario 2: Registering with an existing email
Given the email is already registered  
When the visitor submits the sign-up form,  
Then the system rejects the registration and shows "This email is already registered"

#### Scenario 3: Registering with an invalid DNI
Given the DNI does not have 8 digits  
When the visitor submits the sign-up form,  
Then the system rejects the registration and shows that the DNI must have 8 digits

## US-002: Sign Up as Merchant

**Description:** As a merchant, I want to create an account with the RUC of my business so that I can request shipments.

### Acceptance Criteria

#### Scenario 1: Registering with valid data
Given the visitor selects "I'm a Merchant" and enters full name, business name, email, phone and an 11-digit RUC starting with 10 or 20  
When the visitor submits the sign-up form,  
Then the system creates the user and the merchant profile and shows the merchant dashboard

#### Scenario 2: Registering with an invalid RUC
Given the RUC does not follow the RUC format  
When the visitor submits the sign-up form,  
Then the system rejects the registration and shows the RUC format message

## US-003: Sign In

**Description:** As a registered user, I want to sign in with my email so that I can access my account.

### Acceptance Criteria

#### Scenario 1: Signing in with valid credentials
Given the user enters a registered email and the correct password  
When the user submits the sign-in form,  
Then the system opens a session, stores the token and shows the dashboard of the user role

#### Scenario 2: Signing in with wrong credentials
Given the email or the password is incorrect  
When the user submits the sign-in form,  
Then the system shows "Email or password is incorrect" above the button and keeps the values of the fields

## US-004: Sign Out

**Description:** As an authenticated user, I want to sign out so that nobody else can use my session.

### Acceptance Criteria

#### Scenario 1: Signing out
Given the user is signed in  
When the user selects "Sign out",  
Then the system clears the session and the token and shows the sign-in page

## US-005: Route Protection by Authentication and Role

**Description:** As a user, I want pages to be protected according to my session and role so that I only see what applies to my account.

### Acceptance Criteria

#### Scenario 1: Accessing a private route without a session
Given the user is not signed in  
When the user opens any private route,  
Then the system redirects the user to the sign-in page

#### Scenario 2: Accessing a route of the other role
Given a merchant is signed in  
When the merchant opens a carrier route such as My Vehicles,  
Then the system redirects the merchant to the dashboard

#### Scenario 3: Calling the API with a session
Given the user is signed in  
When the application calls the API,  
Then the request includes the Authorization bearer token

## US-006: Manage Profile

**Description:** As a user, I want to update my contact data so that my counterparts can reach me after a match.

### Acceptance Criteria

#### Scenario 1: Updating with valid data
Given the user is on the profile page  
When the user changes the name or phone and saves,  
Then the system updates the profile and the user

#### Scenario 2: Updating with an invalid phone
Given the phone is not a Peruvian mobile number  
When the user saves,  
Then the system rejects the change and shows the phone format message

## US-007: Register a Vehicle

**Description:** As a carrier, I want to register my vehicles with their capacity so that Trazza suggests loads that fit.

### Acceptance Criteria

#### Scenario 1: Registering a vehicle with valid data
Given the carrier enters plate, brand and model, body type, capacity in kg and volume  
When the carrier saves the vehicle,  
Then the system adds the vehicle to the carrier fleet

#### Scenario 2: Registering a duplicated plate
Given the plate already exists in the carrier fleet  
When the carrier saves the vehicle,  
Then the system shows "This plate is already registered"

## US-008: Manage Vehicles

**Description:** As a carrier, I want to edit, activate, deactivate or delete my vehicles so that my fleet stays up to date.

### Acceptance Criteria

#### Scenario 1: Deactivating a vehicle
Given the vehicle is active  
When the carrier selects "Deactivate",  
Then the vehicle becomes inactive and is no longer offered when publishing routes

#### Scenario 2: Deleting a vehicle
Given the carrier confirms the deletion  
When the carrier deletes the vehicle,  
Then the system removes the vehicle from the fleet

## US-009: Publish a Return Route

**Description:** As a carrier, I want to publish where my delivery ends, where I am heading and how much space I have left so that I receive load suggestions on my way back.

### Acceptance Criteria

#### Scenario 1: Publishing a valid route
Given the carrier enters origin, destination, date, time window, an active vehicle, capacity, maximum detour and cargo types  
When the carrier publishes the route,  
Then the system creates an active route with its estimated distance and shows the load suggestions

#### Scenario 2: Exceeding the vehicle capacity
Given the available capacity is greater than the capacity of the selected vehicle  
When the carrier publishes the route,  
Then the system rejects the route and shows "Capacity cannot exceed the vehicle capacity"

#### Scenario 3: Publishing with a past date
Given the departure date is before today  
When the carrier publishes the route,  
Then the system rejects the route

## US-010: View and Close Return Routes

**Description:** As a carrier, I want to see my published routes and close the ones I no longer drive so that I only receive useful suggestions.

### Acceptance Criteria

#### Scenario 1: Viewing routes
Given the carrier has published routes  
When the carrier opens My Return Routes,  
Then the system lists route, date, free capacity, number of suggestions and status

#### Scenario 2: Closing a route
Given the route is active  
When the carrier closes it,  
Then the route becomes closed and its open proposals are closed

## US-011: View Load Suggestions

**Description:** As a carrier, I want to see loads compatible with my return route so that I can fill my empty space.

### Acceptance Criteria

#### Scenario 1: Viewing compatible loads
Given the route has compatible open freight requests  
When the carrier opens Load Suggestions,  
Then the system lists loads with the same date, overlapping window, accepted cargo type, enough capacity and a detour within the limit, showing merchant reputation, rate and detour

#### Scenario 2: Filtering and sorting
Given there are suggestions  
When the carrier filters by cargo type or maximum detour or sorts by detour, rate or weight,  
Then the list is updated

#### Scenario 3: No compatible loads
Given no request is compatible  
When the carrier opens Load Suggestions,  
Then the system shows "No loads match your route yet"

## US-012: Accept the Rate of a Load

**Description:** As a carrier, I want to accept the rate offered by the merchant so that the match can be confirmed quickly.

### Acceptance Criteria

#### Scenario 1: Accepting the published rate
Given the load has an offered rate  
When the carrier selects "Accept S/ X",  
Then the system creates an accepted proposal and shows that it waits for the merchant confirmation

#### Scenario 2: Sending a duplicated offer
Given there is already an open proposal for the load and route  
When the carrier sends another offer,  
Then the system rejects the offer

## US-013: Propose Another Rate

**Description:** As a carrier, I want to propose a different rate so that the price covers my detour.

### Acceptance Criteria

#### Scenario 1: Proposing a rate
Given the load is open  
When the carrier enters another rate and sends it,  
Then the system creates a pending proposal that waits for the merchant

## US-014: Create a Freight Request

**Description:** As a merchant, I want to describe my shipment so that carriers with space on my route can send me offers.

### Acceptance Criteria

#### Scenario 1: Publishing a valid request
Given the merchant enters pickup and delivery addresses, date, window, cargo type, weight and optionally a rate  
When the merchant publishes the request,  
Then the system creates an open request and shows the carriers on the route

#### Scenario 2: Saving a draft
Given the merchant is not ready to publish  
When the merchant selects "Save draft",  
Then the system stores the request as a draft that carriers cannot see

#### Scenario 3: Missing the delivery address
Given the delivery address is empty  
When the merchant publishes,  
Then the system rejects the request and asks for the address

## US-015: Manage Freight Requests

**Description:** As a merchant, I want to edit or publish drafts and cancel requests so that I control my shipments.

### Acceptance Criteria

#### Scenario 1: Publishing a draft
Given the request is a draft  
When the merchant publishes it,  
Then the request becomes open

#### Scenario 2: Cancelling a request
Given the request is open or a draft  
When the merchant cancels it,  
Then the request becomes cancelled and its open proposals are closed

## US-016: Find Carriers and Send an Offer

**Description:** As a merchant, I want to see carriers already heading my way and send them an offer so that I can ship at a lower cost.

### Acceptance Criteria

#### Scenario 1: Finding carriers
Given the merchant has an open request  
When the merchant opens Find Carriers,  
Then the system lists the active return routes of other carriers compatible with the request, with reputation, vehicle, free capacity and detour

#### Scenario 2: Sending an offer
Given a compatible carrier is listed  
When the merchant sends an offer with a rate,  
Then the system creates a pending proposal that waits for the carrier

## US-017: Negotiate an Offer

**Description:** As a carrier or merchant, I want to accept, counter or reject the offers I receive so that we agree a fair rate.

### Acceptance Criteria

#### Scenario 1: Answering an offer
Given the counterpart made the last offer  
When the user accepts, counters with a different rate or rejects,  
Then the proposal becomes accepted, counteroffer or rejected

#### Scenario 2: Answering out of turn
Given the user made the last offer  
When the user tries to answer it,  
Then the system shows that the user must wait for the other party

#### Scenario 3: Countering with the same rate
Given the new rate equals the current rate  
When the user sends the counteroffer,  
Then the system rejects it

## US-018: Confirm a Match

**Description:** As a merchant, I want to confirm the carrier who will move my load so that the shipment starts.

### Acceptance Criteria

#### Scenario 1: Confirming an accepted proposal
Given the proposal is accepted  
When the merchant confirms the match,  
Then the proposal becomes matched, the request becomes matched, the route capacity is reserved, competing proposals are closed and a shipment is opened

#### Scenario 2: Confirming without agreement
Given the proposal is not accepted  
When the merchant tries to confirm,  
Then the system rejects the confirmation

## US-019: Confirm Pickup

**Description:** As a carrier, I want to confirm that I picked up the goods so that the merchant knows the shipment started.

### Acceptance Criteria

#### Scenario 1: Confirming the pickup
Given the shipment is matched  
When the carrier confirms the pickup,  
Then the shipment becomes picked up and the event is added to the tracking history

## US-020: Share Live Location and Detect Deviations

**Description:** As a carrier, I want to share my location so that the merchant can follow the shipment.

### Acceptance Criteria

#### Scenario 1: Sharing the location
Given the goods are on the way  
When the carrier shares the location,  
Then the shipment becomes in transit and the map, distance and ETA are updated

#### Scenario 2: Leaving the planned route
Given the vehicle is more than 2 km away from the planned route  
When the location is updated,  
Then the system records a detour alert and notifies the merchant until the vehicle returns to the route

## US-021: Confirm Delivery

**Description:** As a carrier, I want to confirm the delivery so that the trip is completed.

### Acceptance Criteria

#### Scenario 1: Confirming near the delivery point
Given the vehicle is within 1 km of the delivery point  
When the carrier confirms the delivery,  
Then the shipment becomes delivered and the rating dialog is shown

#### Scenario 2: Confirming far from the delivery point
Given the vehicle is more than 1 km away  
When the carrier confirms the delivery,  
Then the system asks the carrier to check the location and only confirms after "Confirm anyway"

## US-022: Track a Shipment

**Description:** As a merchant, I want to follow my shipment and share a link with my customer so that everyone knows when the goods arrive.

### Acceptance Criteria

#### Scenario 1: Tracking a shipment
Given the merchant has an active shipment  
When the merchant opens Shipment Tracking,  
Then the system shows the stepper, the planned route versus the current position, the carrier contact, ETA, deviation alerts and the tracking history

#### Scenario 2: Sharing the tracking link
Given the shipment is active  
When the merchant copies the link,  
Then the read-only link is copied

## US-023: Confirm Reception

**Description:** As a merchant, I want to confirm that my goods arrived complete so that the shipment is closed.

### Acceptance Criteria

#### Scenario 1: Confirming the reception
Given the shipment is delivered  
When the merchant confirms that the goods arrived complete,  
Then the shipment becomes closed and the rating dialog is shown

## US-024: Report an Incident

**Description:** As a carrier or merchant, I want to report an incident so that Trazza support can help both parties.

### Acceptance Criteria

#### Scenario 1: Reporting a valid incident
Given the shipment is active or was delivered less than 48 hours ago  
When the user selects what happened, describes it and sends the report,  
Then the incident is added to the shipment and the event appears in the history

#### Scenario 2: Reporting after 48 hours
Given the shipment was delivered more than 48 hours ago  
When the user sends the report,  
Then the system rejects the report

#### Scenario 3: Reporting with a short description
Given the description has less than 10 characters  
When the user sends the report,  
Then the system asks for a longer description

## US-025: View Trip and Shipment History

**Description:** As a user, I want to see my finished and cancelled shipments so that I can review my activity.

### Acceptance Criteria

#### Scenario 1: Viewing the history
Given the user has finished shipments  
When the user opens the history,  
Then the system lists date, route, counterpart, weight, rate, status, incidents and the rating given

#### Scenario 2: Filtering the history
Given there are shipments  
When the user searches by route or counterpart, period or status,  
Then the list is updated

## US-026: View Plan and Usage

**Description:** As a user, I want to see my current plan and how many publications I used so that I know when to upgrade.

### Acceptance Criteria

#### Scenario 1: Viewing the Free plan
Given the user has no paid subscription for today  
When the user opens Plan & Billing,  
Then the system shows the Free plan, the publications used out of 5 and the renewal date

## US-027: Upgrade to Pro

**Description:** As a user, I want to pay the Pro plan with my card so that I can publish without limits.

### Acceptance Criteria

#### Scenario 1: Paying with an approved card
Given the card number is valid and not expired  
When the user pays,  
Then the system records a paid transaction for one month, issues the receipt and shows the Pro plan as active

#### Scenario 2: Paying with a declined card
Given the gateway declines the card  
When the user pays,  
Then the system records a failed transaction and shows that the card was declined

#### Scenario 3: Paying with an invalid card number
Given the card number fails the Luhn check  
When the user pays,  
Then the system rejects the payment before calling the gateway

## US-028: Receive an Electronic Receipt

**Description:** As a user, I want a boleta or factura for my payment so that I can support the expense.

### Acceptance Criteria

#### Scenario 1: Issuing a factura
Given the user selects factura and enters a valid RUC  
When the payment is approved,  
Then the system issues an F001 receipt with taxable amount, 18% IGV and total

#### Scenario 2: Issuing a boleta with a RUC
Given the user selects boleta and enters a RUC  
When the user pays,  
Then the system asks for an 8-digit DNI

## US-029: Enforce the Publication Limit

**Description:** As Trazza, I want Free accounts to publish up to 5 routes or requests per month so that the Pro plan has value.

### Acceptance Criteria

#### Scenario 1: Reaching the limit
Given a Free user already published 5 times this month  
When the user publishes again,  
Then the system rejects the publication and suggests upgrading to Pro

## US-030: Rate the Counterpart

**Description:** As a carrier or merchant, I want to rate the other party after a delivery so that the community knows who is reliable.

### Acceptance Criteria

#### Scenario 1: Rating a delivered shipment
Given the shipment was delivered and the user has not rated it  
When the user selects stars, highlights and an optional comment,  
Then the system saves the rating for the counterpart

#### Scenario 2: Rating twice
Given the user already rated the shipment  
When the user tries to rate again,  
Then the system rejects the rating

## US-031: View Reputation

**Description:** As a user, I want to see my average rating and the comments I received so that I can improve my service.

### Acceptance Criteria

#### Scenario 1: Viewing the reputation
Given the user has ratings  
When the user opens Ratings,  
Then the system shows the average, the distribution by stars and the ratings received and given

## US-032: View Dashboard

**Description:** As a user, I want a summary of my activity so that I know what needs my attention.

### Acceptance Criteria

#### Scenario 1: Viewing the carrier dashboard
Given a carrier is signed in  
When the carrier opens the dashboard,  
Then the system shows active routes, pending offers, trips this month, rating, the active trip and new load suggestions

#### Scenario 2: Viewing the merchant dashboard
Given a merchant is signed in  
When the merchant opens the dashboard,  
Then the system shows shipments in transit, open requests, offers to review, rating and recent requests

## US-033: Switch Language

**Description:** As a user, I want to switch between English and Spanish so that I can use Trazza in my language.

### Acceptance Criteria

#### Scenario 1: Switching the language
Given the user selects EN or ES  
When the language changes,  
Then every label, message and validation is shown in the selected language

## US-034: View Page Not Found

**Description:** As a user, I want to see a clear message when a route does not exist so that I can go back to the dashboard.

### Acceptance Criteria

#### Scenario 1: Accessing an invalid route
Given the route does not exist  
When the user opens it,  
Then the system shows the unavailable path and a button to go to the dashboard

## US-035: Receive In-App Alerts

**Description:** As a user, I want to receive alerts about offers, matches, deviations and incidents so that I can react on time.

### Acceptance Criteria

#### Scenario 1: Receiving an alert
Given an offer waits for the user, a match is confirmed, a deviation is detected or an incident is reported  
When the event happens,  
Then the bell shows the number of unread alerts and the panel lists them
