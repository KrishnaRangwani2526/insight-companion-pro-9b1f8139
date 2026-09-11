# Artisan Ally

okay so my main work and idea is to make a vast , featurefull mobile app handling all these smoothly , its primary feature can be . a dashboard of simplified mobile app providing feasibility analysis, local market research, competitor mapping, SWOT, pricing, risks, scheme routing, loan calculation, EMI, and moratorium planning. , AI product image enhancement, multilingual voice-based cataloging, professional descriptions, and dynamic pricing for digital commerce. text/documents/images/videos/context and transforms the same source into selected outputs such as videos, LinkedIn posts, X threads, advisories, infographics, executive summaries, and presentations provde that content trasnformation which is helpfull for ai based advertisement and promotions , blogging and catalouging , so here my main idea is first feature . give them there local language support , multilingual , also various format conversions like voice to text and text to voice .finance dashboard for rural artisians , helpfull to promote and enagage ,a nd all together in one app , ai based content formation , generative ai tranformation of content , helpfull for them for advertisements and regulation , in stock catalouging ,dynamic pricing engine helpfull to decide fair price , profit and loss calcualtor , learning feature to shift on e-commerce , drop shipping , , digital workplace supported both mobile and pc features , b2b connections - connecting their catalougue to big b2b like flipkart , amazon , and indian own b2b digital market , inventory management , ai demand predictor , . offline first architecture design . and here comes my mvp , after the salesman fills all the details , basic image uploads , make some adds , contents , catalouging and pricing , here i am providing him self one tap designed, owned e-commerce website. so here my plan is to make simple e-commerce website having plain dashboard , same basic e-commerce features , and then to conect this e-commerece to local nearby logistic company , these logistics will handle backend of delivery and this e-commerce will be the online inventory . now comes to the mvp . every user will have feature to build its own e-commerce , by one tap ou server will make designs , customs , extract feature from its sign up and cataloge and descriptions , and then customise that simple dashboard of e-commerce to that personalize dashboard , and now that dashboard is connected to its phone . okay so for now as of my basic e-commerce is already deployed and hosted with lets say my app name--@business.com then there website link will automaticalyy will be .. www.theirbusinessname@business.com . from therer they can make there own custom featue of advertisement and inventory make , i am simplifying there process and smplifying the workflow , with all required basic features ,super coll ai features , there advertisement push , own app will also have , social media pages , and these local venors will get chance to make reel of their product and post to us , and we will post on our social media pages , from there they get free marketing . nd lets say they are growing and need persoanl insta page , we can collabrate in this case . there main advertisement , digital reach , google lisitng , logistich connections and - and also connects and make them learn to lsit them to bigger platforms . supports heritage and culture to grow . ..# MASTER BUILD PROMPT

## AI-Powered Rural Artisan & Micro-Business Digital Platform

Build a complete **mobile-first Progressive Web App (PWA)** prototype for an AI-powered platform that helps rural artisans, craftsmen, weavers, micro-entrepreneurs, local vendors and small businesses digitize, manage, promote and grow their businesses.

The product should feel like a **real production application**, not a generic admin dashboard.

The prototype must have:

* Excellent mobile UI/UX
* Responsive desktop/tablet layout
* Simple language
* Large touch-friendly controls
* Minimal typing wherever possible
* Local-language/multilingual support
* Voice-first interactions where appropriate
* AI-assisted workflows
* Beautiful cards, dashboards and visual summaries
* Functional navigation between pages
* Working forms
* Working calculators
* Mock AI outputs
* Mock inventory/order data
* Mock storefront generation
* Mock integrations
* Clear "Coming Soon" states for features that are not implemented

The prototype should prioritize **visual quality + working user flows + feature discoverability**.

---

# 1. PRODUCT VISION

The platform should act as a:

> **Digital Business Manager + AI Consultant + Marketing Assistant + Financial Assistant + E-Commerce Builder**

for people who may have limited digital literacy.

The core philosophy:

**"Tell us about your business. We help you run it."**

The user should be able to go from:

Business registration
→ Product catalogue
→ Product photography
→ AI description
→ Pricing
→ Inventory
→ Finance
→ Marketing
→ Own online store
→ Orders
→ Logistics
→ Business growth

without needing technical knowledge.

---

# 2. TECHNICAL STACK

Use:

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Lucide React icons
* Recharts for charts
* React Hook Form where useful
* Zod for validation where useful

### PWA

Implement:

* Installable PWA
* Manifest
* Service worker
* Offline fallback
* Responsive mobile-first design
* App-like navigation
* Bottom navigation on mobile
* Sidebar navigation on desktop

### State

Use a simple client-side state architecture suitable for a prototype.

Use localStorage for prototype persistence.

Do NOT require a real backend to demonstrate the prototype.

Create mock service layers so real APIs can later replace them.

Example:

services/

* aiService.ts
* pricingService.ts
* financeService.ts
* inventoryService.ts
* marketingService.ts
* ecommerceService.ts
* logisticsService.ts

---

# 3. DESIGN LANGUAGE

The application must NOT look like a corporate banking dashboard.

It should feel:

* warm
* trustworthy
* modern
* simple
* local
* human
* accessible
* premium but not intimidating

Use a clean Indian rural-business aesthetic.

Use:

* soft rounded cards
* generous spacing
* large icons
* simple illustrations
* readable typography
* large buttons
* clear status indicators
* subtle gradients
* simple charts
* product imagery
* cultural/handicraft visual elements where appropriate

Avoid:

* excessive tables
* dense information
* tiny text
* complicated menus
* excessive animations
* overwhelming dashboards

---

# 4. USER TYPES

Primary:

### Artisan

Examples:

* Weaver
* Potter
* Handicraft maker
* Embroidery worker
* Woodcraft artisan
* Jewellery maker

### Rural Micro-Entrepreneur

Examples:

* Dairy
* Retail
* Food processing
* Tailoring
* Small manufacturing
* Local services

### Local Vendor

Examples:

* Grocery
* Clothing
* Handicrafts
* Home products

Design the system so all three can use the same platform.

---

# 5. APP INFORMATION ARCHITECTURE

Create these major sections:

1. Home
2. My Business
3. Products
4. Inventory
5. AI Studio
6. Marketing
7. Finance
8. Business Advisor
9. My Store
10. Orders
11. Customers
12. Logistics
13. B2B Marketplace
14. Learning
15. Analytics
16. Profile
17. Settings

Mobile bottom navigation:

**Home | Products | AI Studio | Orders | More**

"More" opens:

* Inventory
* Marketing
* Finance
* Business Advisor
* My Store
* Customers
* Logistics
* B2B
* Learning
* Analytics
* Profile

---

# 6. ONBOARDING

Create a beautiful onboarding flow.

## Screen 1

Logo + platform name.

Headline:

**"Your business. Your digital shop. Your growth partner."**

Buttons:

* Get Started
* Login

---

## Screen 2 — Choose Language

Options:

* English
* हिन्दी
* ਪੰਜਾਬੀ
* मराठी
* ગુજરાતી
* বাংলা
* தமிழ்
* తెలుగు
* Kannada
* Other

Allow language switching later.

---

## Screen 3 — Business Type

Cards:

* Artisan
* Farmer
* Manufacturer
* Retailer
* Service Provider
* Other

---

## Screen 4 — Business Details

Fields:

* Business name
* Owner name
* Village
* Block
* District
* State
* PIN code
* Business category

Voice input button:

**🎙️ Tell us about your business**

---

## Screen 5 — Products

Allow:

* Add product
* Take photo
* Upload photo
* Record voice description

---

## Screen 6 — Business Goal

Cards:

* Sell locally
* Sell online
* Find B2B buyers
* Get better pricing
* Get financial support
* Promote my business
* Learn digital business

---

## Completion

Show:

**"Your Digital Business is Ready!"**

Then show generated business profile.

CTA:

**Open My Dashboard**

---

# 7. HOME DASHBOARD

This is the most important screen.

Header:

Business logo/avatar

"Good morning, [Business Name]"

Language selector.

Notification icon.

---

## Business Health Card

Show:

**Business Health: 78/100**

Breakdown:

* Sales
* Inventory
* Marketing
* Finance
* Digital Presence

CTA:

**View Business Health**

---

## Quick Actions

Large cards:

### Add Product

### Create Advertisement

### Check Price

### Record Sale

### Check Finance

### Generate Content

---

## Today's Business Snapshot

Cards:

* Today's Sales
* Orders
* Products
* Low Stock
* Pending Payments

---

## AI Assistant

Floating card:

**"What would you like help with?"**

Examples:

"Find a fair price for my product"

"Create an advertisement"

"How can I increase sales?"

"Can I afford this loan?"

"Which products should I promote?"

Button:

**Ask AI**

Voice button:

**🎙️ Speak**

---

# 8. MY BUSINESS

Create business profile dashboard.

Sections:

### Business Information

### Location

### Business Category

### About Business

### Products

### Digital Presence

### Business Goals

### Verification Status

Button:

**Edit Business**

---

# 9. PRODUCTS / CATALOGUE

Create product grid.

Each product card contains:

* Image
* Product name
* Category
* Price
* Stock
* Sales
* Status

Buttons:

* Add Product
* Edit
* Duplicate
* Share
* Generate Content
* Change Price

---

# 10. ADD PRODUCT

Provide extremely simple product creation.

Step 1:

### Product Photo

Buttons:

* Take Photo
* Upload Photo

Then AI automatically displays:

**AI Product Studio**

Options:

* Remove Background
* Improve Lighting
* Enhance Image
* Crop
* Create E-commerce Image

---

Step 2:

### Product Details

Fields:

* Product name
* Category
* Material
* Size
* Colour
* Quantity
* Raw material cost
* Production cost
* Other cost

Voice button:

**Describe your product**

---

# 11. MULTILINGUAL AUTO-CATALOGER

Allow voice input.

Example:

User speaks in Hindi/Punjabi/regional language.

Show:

### Your description

Then AI-generated:

### Product Title

### Short Description

### Full Description

### SEO Keywords

### Hindi Description

### English Description

Buttons:

* Regenerate
* Edit
* Translate
* Save Product

---

# 12. AI IMAGE STUDIO

Create dedicated page.

Title:

**AI Product Studio**

Upload product image.

Show before/after preview.

Tools:

* Remove Background
* Improve Lighting
* Sharpen
* Remove Clutter
* White Background
* Marketplace Format
* Social Media Format
* Generate Product Banner

Button:

**Apply Changes**

Mock AI processing animation.

---

# 13. DYNAMIC PRICING ASSISTANT

Create pricing page.

Input:

* Product
* Raw Material Cost
* Labour Cost
* Packaging
* Transportation
* Desired Margin
* Local Market

AI analyzes:

* Cost
* Market price
* Demand
* Product category
* Quality
* Competitor prices

Output:

### Suggested Fair Price

Example:

₹1,249

Show:

* Minimum viable price
* Recommended price
* Premium price

Also show:

**Expected Profit: ₹349**

and:

**Recommended selling price: ₹1,249**

Buttons:

* Use Recommended Price
* Compare Market
* View Pricing Explanation

---

# 14. INVENTORY

Create inventory dashboard.

Cards:

* Total Products
* Total Stock
* Low Stock
* Out of Stock
* Inventory Value

Product list.

Each product:

* Stock quantity
* Stock value
* Reorder level
* Status

Actions:

* Add Stock
* Remove Stock
* Edit
* View Product

AI card:

**"3 products may run out of stock soon."**

CTA:

**View Forecast**

---

# 15. AI DEMAND PREDICTOR

Create page.

Show charts:

* Sales history
* Demand prediction
* Seasonal trend

Example:

"Demand for handmade baskets may increase by 32% next month."

Recommendations:

* Increase production
* Promote product
* Maintain current stock

---

# 16. FINANCE DASHBOARD

Create simple financial dashboard.

Cards:

### Total Sales

### Expenses

### Profit

### Pending Payments

### Cash Flow

### Inventory Value

Charts:

* Revenue
* Expenses
* Profit

Date filters:

* Today
* Week
* Month
* Year

---

# 17. PROFIT & LOSS CALCULATOR

Inputs:

Revenue

Raw material

Labour

Transportation

Packaging

Rent

Utilities

Marketing

Other expenses

Output:

Revenue

− Expenses

= Net Profit

Also show:

Profit Margin %

Break-even estimate.

---

# 18. SMART SCHEME CALCULATOR

Create dedicated page:

### "How much funding can I qualify for?"

Input:

**Available Margin Capital**

Example:

₹1,00,000

Calculation:

Margin = 10%

Project Cost:

₹1,00,000 / 10%

= ₹10,00,000

Maximum Loan:

₹9,00,000

---

## Scheme Routing

If Project Cost <= ₹1.40 lakh:

Show:

### Micro Finance Scheme

Interest:

6.5%

Tenure:

3 years

Moratorium:

3 months

Maximum agency funding:

₹1.25 lakh

---

If Project Cost > ₹1.40 lakh and <= ₹50 lakh:

Show:

### Term Loan Scheme

Interest:

8%

Tenure:

7 years

Moratorium:

6 months

Maximum agency funding:

₹45 lakh

---

If calculated project cost exceeds ₹50 lakh:

Show:

### Project exceeds current scheme limit

Recommend:

Reduce project size / explore other financing.

---

# 19. EMI CALCULATOR

Inputs:

* Loan amount
* Interest rate
* Tenure
* Moratorium

Show:

* Monthly EMI
* Quarterly payment estimate
* Total interest
* Total repayment
* First repayment date
* Moratorium period

Also provide a simple visual repayment timeline.

Do not present financial calculations as guaranteed government approval.

Label:

**"Estimated based on the scheme parameters entered."**

---

# 20. BUSINESS FEASIBILITY ADVISOR

Create page:

### "Is this business right for my area?"

Inputs:

* Village
* Block
* District
* Business category
* Available capital

Generate a mock AI feasibility report.

Sections:

### Market Reach

Estimated population/consumer base.

### Local Demand

Demand score.

### Opportunity

Underserved niches.

### SWOT

Strengths

Weaknesses

Opportunities

Threats

### Competitors

Estimated competitor density.

### Pricing

Suggested local price range.

### Local Risks

Supply chain

Seasonality

Competition

Single-buyer dependency

### Recommendation

Overall feasibility:

**Good / Moderate / High Risk**

Show explanation.

---

# 21. LOCAL MARKET RESEARCH

Create separate page.

Show:

* Local population
* Consumer segments
* Nearby markets
* Demand indicators
* Competitor density
* Distribution channels
* Local price range

Use map placeholder.

Show:

**5 km radius**

**10 km radius**

Buttons:

* 5 km
* 10 km

---

# 22. COMPETITOR MAPPING

Map-style UI.

Show mock competitor pins.

Each competitor:

* Category
* Approximate distance
* Estimated price
* Rating
* Product type

Summary:

**12 similar businesses detected**

**3 direct competitors**

**4 underserved opportunities**

---

# 23. MARKETING / AI STUDIO

Create marketing hub.

Main buttons:

### Create Advertisement

### Create Social Post

### Create Reel

### Create Product Caption

### Create Blog

### Create WhatsApp Promotion

### Create Poster

### Create Flyer

### Create Product Catalogue

---

# 24. AI CONTENT TRANSFORMATION ENGINE

This is a major feature.

Create page:

### "Create Anything From Your Content"

Input sources:

* Text
* Document
* Image
* Video
* Voice
* Prompt

Upload buttons:

**Upload File**

**Take Photo**

**Record Voice**

**Paste Text**

---

Then:

### What do you want to create?

Selectable cards:

* Advertisement
* Instagram Post
* Facebook Post
* LinkedIn Post
* X/Twitter Post
* WhatsApp Promotion
* Reel
* Video
* Blog
* Product Description
* Catalogue
* Advisory
* Infographic
* Executive Summary
* Presentation

Allow multiple selections.

---

## Generation Parameters

* Language
* Audience
* Tone
* Length
* Objective
* Style

Button:

**Generate**

---

# 25. ADVERTISEMENT GENERATOR

Input:

Product

Image

Offer

Target audience

Language

Generate:

* Headline
* Primary text
* CTA
* Social caption
* Poster copy
* WhatsApp message

Buttons:

* Regenerate
* Edit
* Copy
* Share
* Save

---

# 26. REEL GENERATOR

Show:

### Reel Concept

### Hook

### Scene 1

### Scene 2

### Scene 3

### Voiceover

### Subtitles

### Music recommendation

### Caption

### Hashtags

Button:

**Create Reel**

For prototype, use mock generation.

---

# 27. VOICE FEATURES

Throughout the application provide microphone buttons.

Voice functions:

### Voice → Text

### Voice → Product Description

### Voice → Advertisement

### Voice → Business Query

### Text → Voice

Allow user to select language.

Show audio playback UI.

---

# 28. MY STORE

This is the most important MVP feature.

Create:

### "Build My Online Store"

Button:

**Create My Store**

Show generated preview.

---

## Store Generation

Automatically use:

* Business name
* Logo
* Business category
* Product catalogue
* Product images
* Product descriptions
* Prices
* Business location

Generate:

### Store Name

### Store URL

Example:

**[businessname@business.com](mailto:businessname@business.com)**

For the prototype, use a safe placeholder such as:

**businessname.business.com**

Do NOT imply that arbitrary subdomains are automatically available unless the real backend/domain system supports them.

---

# 29. STORE CUSTOMIZATION

Allow:

* Select theme
* Select layout
* Logo
* Banner
* About section
* Featured products
* Contact details
* WhatsApp button
* Location
* Social links

Templates:

* Artisan
* Minimal
* Traditional
* Modern
* Local Store

Button:

**Publish Store**

---

# 30. STORE PREVIEW

Show actual e-commerce storefront.

Include:

* Header
* Logo
* Search
* Categories
* Product grid
* Product page
* Price
* Add to Cart
* Buy Now
* WhatsApp
* Contact
* About
* Location
* Reviews

---

# 31. MOBILE ↔ STORE SYNCHRONIZATION

The prototype should demonstrate:

Phone app:

Product price ₹1,249

Store:

Product price ₹1,249

If user edits stock/price in app, update the local prototype store state.

Show status:

**Synced**

---

# 32. ORDERS

Create order dashboard.

Cards:

* New Orders
* Processing
* Shipped
* Delivered
* Cancelled

Order details:

* Customer
* Products
* Amount
* Address
* Payment
* Status

Buttons:

* Accept
* Pack
* Mark Shipped
* Contact Customer

---

# 33. LOGISTICS

Create logistics page.

Show:

### Connect Local Logistics

Search:

* Nearby courier
* Local delivery partner
* Pickup service

Show mock partners.

Each:

* Name
* Service area
* Estimated delivery
* Cost
* Status

CTA:

**Connect**

For prototype, use mock integration state.

---

# 34. B2B MARKETPLACE

Create page:

### "Sell Beyond Your Village"

Show marketplace cards:

* Amazon
* Flipkart
* Government marketplace
* Indian B2B marketplaces
* Local B2B buyers

Do not claim direct API integration unless implemented.

Use:

**Connect Marketplace**

and show:

**Integration Coming Soon**

where appropriate.

---

# 35. GOOGLE / LOCAL DIGITAL PRESENCE

Create page:

### "Get Found Online"

Cards:

* Google Business Profile
* WhatsApp Business
* Instagram
* Facebook
* Own Store
* Marketplace

Show:

**Digital Presence Score: 62%**

Recommendations:

* Add business hours
* Add location
* Add 5 product photos
* Add business description

---

# 36. SOCIAL MEDIA PROMOTION

Create:

### Platform Promotion

User can submit products/content for promotion.

Options:

* Submit Product
* Submit Reel
* Submit Story
* Submit Festival Offer

Show:

**Platform Promotion Queue**

Status:

Pending

Approved

Published

This demonstrates the concept where the platform can promote local artisans through its own social channels.

---

# 37. LEARNING CENTER

Create a simple learning platform.

Categories:

### Start Selling Online

### Product Photography

### Pricing

### Inventory

### Finance

### Digital Marketing

### E-commerce

### B2B Selling

### Logistics

### Social Media

### AI Tools

Use short cards:

"5 min lesson"

"10 min lesson"

"Beginner"

Progress:

**4/10 completed**

---

# 38. ANALYTICS

Create simple analytics dashboard.

Metrics:

* Revenue
* Orders
* Customers
* Best-selling products
* Slow-moving products
* Profit
* Marketing reach
* Store visits

AI insight:

**"Your blue cotton shawls are selling 2.4× faster than your other products."**

---

# 39. CUSTOMER MANAGEMENT

Create:

* Customer list
* Customer profile
* Purchase history
* Total spending
* Last purchase
* Contact button

AI recommendations:

* Returning customers
* Customers to re-engage
* Potential bulk buyers

---

# 40. NOTIFICATIONS

Create notification center.

Examples:

"Your product is running low."

"Your store received a new order."

"Demand for this product is increasing."

"Your EMI estimate is ready."

"Your advertisement is ready."

"New B2B opportunity available."

---

# 41. AI BUSINESS ASSISTANT

Create persistent AI assistant.

Floating button:

**Ask AI**

The assistant should understand context.

Example:

User:

"How much should I charge for this?"

AI:

"Based on your cost of ₹800 and the current estimated market range, a selling price around ₹1,150–₹1,250 may provide a reasonable margin."

Other queries:

"Which product should I promote?"

"Why are my sales falling?"

"Can I afford this project?"

"Create an ad for this product."

"Explain my EMI."

"How do I sell online?"

Provide:

* Text input
* Voice input
* Suggested prompts
* Language selection

---

# 42. OFFLINE-FIRST EXPERIENCE

The app should demonstrate offline-first behavior.

Cache:

* Business profile
* Product catalogue
* Inventory
* Draft advertisements
* Store data
* Learning progress

Show offline indicator:

**You're offline**

Allow:

* View products
* View inventory
* Create draft
* Record sale
* Edit product

When connection returns:

**Syncing...**

then:

**All changes synced**

For the prototype, simulate this behavior locally.

---

# 43. PROFILE / SETTINGS

Include:

* Personal information
* Business information
* Language
* Voice settings
* Notifications
* Store settings
* Connected marketplaces
* Connected logistics
* Social accounts
* Privacy
* Help
* Logout

---

# 44. HELP / DIGITAL ASSISTANCE

Create simple help center.

Categories:

* Using the app
* Adding products
* Pricing
* Finance
* Store
* Orders
* Marketing
* Logistics

Include:

**Talk to Support**

and:

**Ask AI**

---

# 45. MVP PRIORITY

The prototype must make these features actually demonstrable.

## MUST WORK IN MVP

1. Onboarding
2. Multilingual UI selection
3. Business profile
4. Product catalogue
5. Product image upload
6. AI image enhancement mock flow
7. Voice-to-text mock flow
8. AI product description generation
9. Dynamic pricing calculator
10. Inventory
11. Finance dashboard
12. P&L calculator
13. Scheme calculator
14. EMI calculator
15. Business feasibility report
16. Local market analysis UI
17. Competitor mapping UI
18. SWOT
19. AI content transformation
20. Advertisement generator
21. Social content generator
22. Product catalogue generator
23. My Store generation
24. Store customization
25. Store preview
26. App ↔ Store synchronization
27. Orders
28. Logistics connection mock
29. B2B marketplace connection mock
30. Learning center
31. Analytics
32. AI assistant
33. Offline state simulation

---

# 46. UPCOMING FEATURES

Do NOT fake real integrations.

Create dedicated pages/cards for future functionality.

Label clearly:

### Coming Soon

Potential upcoming integrations:

* Real Amazon integration
* Real Flipkart integration
* Government marketplace integration
* Real payment gateway
* Real logistics APIs
* Google Business Profile API
* Instagram publishing API
* Facebook publishing API
* WhatsApp Business API
* Real-time market-price APIs
* Real demographic datasets
* Real competitor intelligence
* Real demand forecasting model
* Real AI image generation/editing backend
* Production speech-to-text
* Production text-to-speech
* Real B2B buyer network
* GST/accounting integrations
* Banking integrations
* Credit/loan application integrations

The UI should show these as planned expansion rather than pretending they already work.

---

# 47. NAVIGATION REQUIREMENT

Every major feature must be reachable.

No dead-end buttons.

Every button should either:

1. Navigate somewhere
2. Open a modal
3. Change state
4. Perform a calculation
5. Generate mock AI output
6. Show a meaningful Coming Soon screen

Avoid buttons that do nothing.

---

# 48. DEMO DATA

Create realistic demo business:

Business:

**Mitti & Dhaga Crafts**

Category:

Handicrafts / Textiles

Location:

A fictional rural Indian location.

Products:

* Handwoven Cotton Shawl
* Terracotta Vase
* Embroidered Bag
* Handmade Basket
* Traditional Dupatta

Use realistic prices and inventory numbers.

Create:

* orders
* customers
* sales
* expenses
* inventory
* competitor data
* market data

so dashboards do not look empty.

---

# 49. IMPORTANT UX RULE

The user should NEVER feel:

"Where do I click?"

Every page must answer:

### What is this?

### Why do I need it?

### What should I do next?

Use simple CTA labels.

Bad:

"Initialize Market Intelligence"

Good:

**Check Local Market**

Bad:

"Generate Multimodal Communication Artefact"

Good:

**Create Advertisement**

---

# 50. AI OUTPUT DESIGN

AI responses should not look like a chatbot wall of text.

Use:

* cards
* scores
* badges
* bullet points
* charts
* recommendations
* expandable explanations
* action buttons

Example:

### Business Opportunity

**82 / 100**

"Demand appears strong in the nearby market."

Then:

**Why?**

* Limited direct competition
* Good local demand
* Suitable raw materials
* Accessible distribution

CTA:

**View Full Report**

---

# 51. ACCESSIBILITY

Support:

* large fonts
* high contrast
* large touch targets
* icon + text buttons
* simple vocabulary
* voice interaction
* multilingual UI
* clear error messages

Do not rely on color alone to communicate status.

---

# 52. RESPONSIVE DESIGN

Mobile:

Bottom navigation.

Tablet:

Hybrid navigation.

Desktop:

Left sidebar + dashboard.

The application must still look like the same product on every screen size.

---

# 53. COMPONENT SYSTEM

Create reusable components:

* AppShell
* MobileBottomNav
* DesktopSidebar
* Header
* PageHeader
* StatCard
* FeatureCard
* ProductCard
* OrderCard
* AIInsightCard
* VoiceButton
* UploadBox
* EmptyState
* ComingSoonCard
* ProgressCard
* PriceCard
* FinanceCard
* SchemeCard
* ChartCard
* LanguageSelector
* BusinessHealthCard
* Modal
* BottomSheet
* Toast
* LoadingState

---

# 54. MOCK AI ARCHITECTURE

Create mock services.

Example:

aiService.generateProductDescription()

aiService.generateAdvertisement()

aiService.generateBusinessReport()

aiService.generateSWOT()

aiService.generatePricingRecommendation()

aiService.generateReelScript()

aiService.generateCatalogue()

The UI should call these functions rather than hardcoding responses directly inside components.

This makes it easy to replace them later with:

* OpenAI
* Gemini
* Claude
* local LLM
* LangChain
* RAG pipeline
* custom ML models

---

# 55. FUTURE BACKEND ARCHITECTURE

Design frontend APIs so they can eventually connect to:

Frontend:

React + TypeScript + PWA

↓

API Gateway

↓

Backend

↓

Services:

AI Service

Finance Service

Inventory Service

E-commerce Service

Marketing Service

Pricing Service

Recommendation Service

Notification Service

Logistics Service

B2B Service

↓

Database

Potential future technologies:

* Node.js / FastAPI
* PostgreSQL
* Redis
* Object storage
* Vector database
* AI model APIs
* Maps APIs
* Logistics APIs
* Marketplace APIs

Do not implement all of this now.

The current objective is a convincing frontend prototype.

---

# 56. ROUTES

Create routes similar to:

/

/onboarding

/dashboard

/business

/products

/products/add

/products/:id

/ai-studio

/ai-studio/image

/ai-studio/catalog

/ai-studio/content

/marketing

/marketing/advertisement

/marketing/reel

/inventory

/inventory/forecast

/finance

/finance/pnl

/finance/scheme

/finance/emi

/advisor

/advisor/market

/advisor/competitors

/advisor/swot

/store

/store/create

/store/customize

/store/preview

/orders

/customers

/logistics

/b2b

/learning

/analytics

/notifications

/profile

/settings

---

# 57. LANDING / DEMO EXPERIENCE

The prototype should be demoable from start to finish.

Recommended demo flow:

1. Open app
2. Choose Hindi/English
3. Create business
4. Add product
5. Upload product photo
6. AI enhances image
7. Speak product description
8. AI generates catalogue
9. AI suggests price
10. Add product to inventory
11. Generate advertisement
12. Generate social content
13. Check local business feasibility
14. Calculate financing
15. Generate EMI estimate
16. Build online store
17. Preview store
18. Change product price
19. Show synchronized store
20. Create test order
21. Show logistics
22. Show business analytics

This flow should feel like a single connected ecosystem.

---

# 58. CORE PRODUCT LOOP

The most important loop is:

**Create Business**

↓

**Add Product**

↓

**AI Enhances Product**

↓

**AI Creates Catalogue**

↓

**AI Suggests Price**

↓

**Add Inventory**

↓

**AI Creates Marketing**

↓

**Publish to Store**

↓

**Receive Order**

↓

**Manage Delivery**

↓

**Track Sales**

↓

**Understand Profit**

↓

**Improve Business**

This should be visually and technically coherent throughout the prototype.

---

# 59. FINAL PROTOTYPE QUALITY BAR

The finished prototype should feel like a startup product that could be demonstrated at SIH.

It should NOT feel like:

* a school project
* a generic CRUD dashboard
* a collection of disconnected pages
* a template admin panel

It should feel like:

**"A complete AI-powered digital operating system for rural micro-businesses and artisans."**

Prioritize:

1. Excellent mobile UI
2. Smooth navigation
3. Strong visual hierarchy
4. Working calculations
5. Working product workflow
6. Working store generation flow
7. AI feature demonstrations
8. Clear MVP
9. Clear future integrations
10. Strong SIH demo experience

Build the application incrementally, but ensure the final navigation and feature architecture supports the complete vision.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/95fffbae-ea71-454b-9e01-d62fac494116).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
