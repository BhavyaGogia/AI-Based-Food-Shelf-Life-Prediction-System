# 📘 TBI-GEU Summer Internship 2026
## HimShakti Food Processing — Complete Intern Project Guide

> 🔖 **Read this fully before starting your project.**
> This file explains what each intern will build, why the projects are different, and how AI is used in both.

---

## 🏢 About the Company — HimShakti Food Processing

HimShakti is a food processing company in Uttarakhand. They take raw Himalayan ingredients and turn them into packaged products.

**Products they make:**

| 🌾 Millet Snacks | 🍹 Fruit Juices | 🫙 Traditional Pickles |
|:---:|:---:|:---:|
| Jowar, Bajra based | Himalayan fruits | Vegetables + spices |

---

## ❗ Their 2 Big Problems

| # | Problem | Who Suffers |
|:---:|---|:---:|
| 1️⃣ | They make food WITHOUT chemical preservatives but don't know the exact shelf life — so they write wrong expiry dates, which causes food waste and customer complaints | Production Team |
| 2️⃣ | No system to track which batch was made when, from which farmer, and which certificate belongs to which batch | Factory Manager |

> 💡 **Our Job as Interns = Solve these 2 problems using Web Apps + AI**

---

## 👥 Two Interns — Two Different Projects

Both interns work for the **same company** and use the **same AI tool (Gemini API)**.
But each intern solves a **completely different problem** for a **different person** inside the company.

| | 👤 Intern 1 | 👤 Intern 2 |
|:---:|:---:|:---:|
| **Project Name** | AI-Based Food Shelf Life Prediction System | Food Batch Tracking and QR Management System |
| **Solves Problem** | Predicting shelf life of food products | Tracking production batches |
| **App Used By** | Production Team (before packaging) | Factory Manager (after packaging) |
| **AI Does** | Predicts shelf life + suggests improvements | Gives smart dispatch warnings & quality alerts |
| **Main Output** | Shelf life result + expiry date + safety tips | Batch table + QR codes + AI alerts |

---

---

# 👤 INTERN 1 — AI-Based Food Shelf Life Prediction System

## 🎯 What Is It?

An AI-powered tool where production staff enter the **recipe and processing details** of a food product, and AI **predicts exactly how long it will last** — giving the correct expiry date, risk warnings, and suggestions to make it last longer naturally.

> 💡 **This type of tool does NOT exist for small food companies in India. This is real innovation.**

---

## 🔍 Why Is This a Real Problem?

HimShakti makes food **without chemical preservatives**. This means shelf life varies for every batch depending on ingredients, processing, and packaging.

| Current Situation | What Goes Wrong |
|---|---|
| They guess the expiry date | Product goes bad before the date printed on label |
| No formula to calculate shelf life | They throw away good product too early (waste money) |
| Different batches have different shelf life | Cannot give consistent dates to buyers |
| No tool exists for small companies | Large companies use expensive lab testing |

---

## 🔁 How It Works — Step by Step

| Step | Action | Example |
|:---:|---|---|
| **1** | Staff opens the web app | Opens on browser / phone |
| **2** | Selects the product type | Millet Snack / Fruit Pickle / Juice |
| **3** | Enters ingredient details | Salt: 8%, Mustard Oil: 15%, Turmeric: 2% |
| **4** | Selects processing method | Sun-dried 3 days / Steam cooked / Cold pressed |
| **5** | Selects packaging type | Glass jar / Vacuum sealed / Plastic pouch |
| **6** | Enters storage condition | Room temperature / Refrigerated |
| **7** | Clicks **Analyse** button | AI processes all the inputs |
| **8** | AI gives full shelf life report | Expiry date + warnings + improvement tips |

---

## 🤖 What Does AI Do Here?

| AI Input | AI Output |
|---|---|
| Salt % + Oil % + Turmeric % | 📅 Predicted shelf life: **~8 months** at room temperature |
| Processing method (sun-dried) | ⚠️ Risk: "Moisture above 12% reduces shelf life to 4 months" |
| Packaging type (glass jar) | 💡 Suggestion: "Add 2% more vinegar → extends to 11 months" |
| Storage condition | 🏷️ Safe expiry date to print: **"Best Before: March 2027"** |
| Ingredient combination | 🚨 Danger alert: "This combo may cause fermentation — check pH" |

> **Type of AI:** Predictive Analysis using **Google Gemini API (Free)**

---

## 🖥️ App Screen Layout

```
┌──────────────────────────────────────────────────┐
│      🔬  Food Shelf Life Prediction System        │
├──────────────────────────────────────────────────┤
│  Product Type:  [ Millet Pickle  ▼ ]             │
│                                                  │
│  Ingredients:                                    │
│    Salt %:         [ 8%  ]                       │
│    Mustard Oil %:  [ 15% ]                       │
│    Turmeric %:     [ 2%  ]                       │
│    Vinegar %:      [ 5%  ]                       │
│                                                  │
│  Processing:  ● Sun-dried  ○ Steam  ○ Raw        │
│  Packaging:   ● Glass Jar  ○ Vacuum  ○ Plastic   │
│  Storage:     ● Room Temp  ○ Refrigerated        │
│                                                  │
│            [ 🔬 Analyse Shelf Life ]              │
├──────────────────────────────────────────────────┤
│  📅 Predicted Shelf Life:  8 Months              │
│  🏷️  Print on Label:  Best Before March 2027     │
│                                                  │
│  ⚠️  Risk:  "Moisture above 12% = only 4 months" │
│  💡 Tip:   "Add 2% more vinegar → 11 months"    │
│  ✅ Safety: "Ingredient combination looks safe"  │
└──────────────────────────────────────────────────┘
```

---

## 📚 Skills You Will Learn

| Skill | What You Build With It |
|---|---|
| React (Frontend) | Build the ingredient form and result UI |
| Gemini API | Connect AI to predict shelf life from food science data |
| Prompt Engineering | Give AI the right food science context to reason correctly |
| Data Input Design | Multi-field form with sliders, dropdowns, radio buttons |
| UI/UX Design | Make results clear, visual, and easy to act on |

---

## 📦 What You Submit at the End

| Deliverable | Details |
|---|---|
| ✅ Working Web App | React app with full shelf life analysis working |
| ✅ 6 Product Reports | Shelf life analysis for all 6 HimShakti products |
| ✅ AI Accuracy Note | Short document on how AI was prompted and tested |
| ✅ Documentation | User guide for the production team |

---

---

# 👤 INTERN 2 — Food Batch Tracking and QR Management System

## 🎯 What Is It?

An AI-powered batch management system where the factory manager tracks every production batch, **auto-generates a QR code** for each batch, and gets **AI warnings** about expiry and dispatch priority.

---

## 🔁 How It Works — Step by Step

| Step | Action | Example |
|:---:|---|---|
| **1** | Manager opens the web app | Opens on browser / phone |
| **2** | Clicks "Add New Batch" | Fills a form |
| **3** | Enters batch details | Product: Millet Snack, Farmer: Ram Singh, Village: Haldwani, Pack Date: 10 June |
| **4** | App auto-saves and generates a QR code | QR image appears instantly |
| **5** | AI reads the batch data | Gemini API analyzes pack date, yield, product type |
| **6** | AI gives smart suggestions | Warnings about expiry, which batch to send first |
| **7** | Manager marks batch as "Dispatched" | Enters buyer name and date |

---

## 🤖 What Does AI Do Here?

| AI Input | AI Output |
|---|---|
| Pack date + product type | ⚠️ "Batch expires in October — dispatch by September" |
| Yield percentage | ✅ "88% yield — quality is GOOD" or ❌ "Below 70% — check quality" |
| Multiple batch dates | 📦 "Batch #003 is oldest — dispatch THIS FIRST" |

> **Type of AI:** Data Analysis + Smart Recommendations using **Google Gemini API (Free)**

---

## 📱 What is a QR Code? (Simple Explanation)

| Question | Answer |
|---|---|
| **What is a QR Code?** | A picture that stores a website link. When you scan it with a phone, it opens that link. |
| **What link does our QR store?** | The batch detail page. Example: `himshakti.com/batch/001` |
| **Do we print it physically?** | No! For internship demo, we just SHOW the QR image on screen. Manager can download it later. |
| **How do we generate it in code?** | We use a free library called `qrcode` (npm). Just one line of code — the library does all the work. |

**QR Code Flow (Simple):**

| Batch Added | Link Created | QR Generated | Customer Scans |
|:---:|:---:|:---:|:---:|
| Batch #001 Millet Snack | himshakti.com/batch/001 | 📷 QR image appears | Sees farmer name, date, village |

---

## 🖥️ App Screen Layout

```
┌──────────────────────────────────────────────────┐
│    📦  Food Batch Tracking & QR Management        │
├──────────────────────────────────────────────────┤
│  [ + Add New Batch ]                             │
├──────┬───────────────┬──────────┬────────────────┤
│  ID  │  Product      │ Status   │  QR Code       │
├──────┼───────────────┼──────────┼────────────────┤
│ 001  │ Millet Snack  │ ✅ Ready │ [QR] [Download]│
│ 002  │ Fruit Pickle  │ ⚠️ Urgent│ [QR] [Download]│
│ 003  │ Millet Juice  │ 🚚 Sent  │ [QR] [Download]│
├──────┴───────────────┴──────────┴────────────────┤
│  🤖 AI Suggestions:                              │
│  ⚠️  Batch #002 expires soon — dispatch this week│
│  📦  Batch #003 is oldest — prioritize dispatch  │
│  ✅  Batch #001 quality is good — 88% yield      │
└──────────────────────────────────────────────────┘
```

---

## 📚 Skills You Will Learn

| Skill | What You Build With It |
|---|---|
| React (Frontend) | Build the batch table and form |
| Gemini API | Connect AI to analyze batch data |
| QR Code Library | Auto-generate QR for each batch |
| Dashboard Design | Make data look clean and scannable |
| JSON Data Storage | Store batch records without a database |

---

## 📦 What You Submit at the End

| Deliverable | Details |
|---|---|
| ✅ Working Web App | React app with batch table + QR working |
| ✅ AI Suggestions Working | At least 3 types of warnings from AI |
| ✅ QR Download Working | Each batch QR is downloadable |
| ✅ User Guide | Simple guide for the production manager |

---

---

## 🔄 Side-by-Side Comparison — Both Projects

### 🟢 What is the SAME in Both Projects

| Feature | Intern 1 | Intern 2 |
|---|:---:|:---:|
| Company | HimShakti ✅ | HimShakti ✅ |
| AI Tool Used | Gemini API ✅ | Gemini API ✅ |
| Frontend Framework | React ✅ | React ✅ |
| Product Data (millets, pickles, juice) | ✅ | ✅ |
| Brand Colors & Logo | ✅ | ✅ |
| Mobile Responsive App | ✅ | ✅ |

---

### 🔴 What is DIFFERENT in Both Projects

| Feature | 👤 Intern 1 — Shelf Life Prediction | 👤 Intern 2 — Batch Tracking & QR |
|---|---|---|
| **App Purpose** | Predict shelf life BEFORE packaging | Track batches AFTER packaging |
| **Who Uses It** | Production team (recipe stage) | Factory manager (dispatch stage) |
| **AI Role** | Predictive analysis (ingredients → shelf life) | Operational analysis (batch data → dispatch priority) |
| **Main Screen** | Ingredient form + shelf life result | Table of batches + AI alerts |
| **QR Codes** | ❌ Not needed | ✅ Auto-generated for every batch |
| **Batch Tracking** | ❌ Not needed | ✅ Core feature |
| **Expiry Prediction** | ✅ Core feature (AI calculates it) | ❌ Uses expiry date from Intern 1's system |
| **Innovation** | No such tool exists for small Indian food companies | Custom QR traceability for HimShakti |

---

### 🔗 How Both Projects Connect (Without Overlapping)

| Stage | Who Acts | What Happens |
|:---:|---|---|
| **1. Before Production** | Intern 1 — Shelf Life Prediction | Staff enters recipe → AI predicts shelf life → correct expiry date is decided |
| **2. After Production** | Intern 2 — Batch Tracking & QR | Manager adds batch → QR generated → AI warns about dispatch priority |
| **3. Customer Scans QR** | Both projects contribute | QR opens batch page showing farmer, date, and expiry date from Intern 1's system |

---

## 🤝 How Both Interns Can Help Each Other

| ✅ You CAN Share | ❌ You CANNOT Copy |
|---|---|
| Gemini API setup code | Each other's core features |
| React project boilerplate | UI components unique to each project |
| HimShakti product list (data) | Logic or algorithms of the other project |
| Brand colors and logo files | Entire pages or screens |
| Bug fixes in React / API | Final output or deliverable |

> **Simple Rule: Help with setup. Not with features.**

---

## 🛠️ Tech Stack — Same for Both

| Technology | What It Is | Why We Use It |
|---|---|---|
| **React + Vite** | JavaScript framework | Fast, modern, industry standard |
| **Gemini API** | Google's free AI | Powers the AI features in both apps |
| **qrcode (npm)** | QR code library | Only Intern 2 needs this |
| **CSS / Tailwind** | Styling tool | Makes the app look good |
| **JSON File** | Data storage format | Simple, no database needed |
| **GitHub Pages** | Free web hosting | Easy to deploy and share a live link |

---

## 📅 6-Week Timeline — For Both Interns

| Week | Focus | What To Do |
|:---:|---|---|
| **Week 1** | Setup & Research | Understand HimShakti, set up React project, explore Gemini API |
| **Week 2** | Input UI | Build the main form and input screens |
| **Week 3** | AI Integration | Connect Gemini API and make AI work correctly |
| **Week 4** | Output UI | Build the result screen / dashboard, polish the design |
| **Week 5** | Extra Features | Intern 1: multiple product types + improvement suggestions · Intern 2: QR download, dispatch flow |
| **Week 6** | Final Polish | Test everything, write docs, prepare demo presentation |

---

## ✅ Final Submission Checklist

### 👤 Intern 1 — AI-Based Food Shelf Life Prediction System

| # | Task | Done? |
|:---:|---|:---:|
| 1 | Ingredient input form works (all fields) | ☐ |
| 2 | Gemini API connected and returning shelf life prediction | ☐ |
| 3 | At least 3 product types work (Snack, Pickle, Juice) | ☐ |
| 4 | Predicted shelf life result displays correctly | ☐ |
| 5 | AI risk warnings display correctly | ☐ |
| 6 | AI improvement suggestions display correctly | ☐ |
| 7 | Safe expiry date (label-ready) is shown | ☐ |
| 8 | 6 product reports generated for HimShakti's real products | ☐ |
| 9 | App works on mobile screen | ☐ |
| 10 | Documentation / user guide written for production team | ☐ |

---

### 👤 Intern 2 — Food Batch Tracking and QR Management System

| # | Task | Done? |
|:---:|---|:---:|
| 1 | Add new batch form works completely | ☐ |
| 2 | Batch table displays all entries correctly | ☐ |
| 3 | QR code auto-generates for each new batch | ☐ |
| 4 | QR code download button works | ☐ |
| 5 | Gemini API connected and giving AI suggestions | ☐ |
| 6 | At least 3 AI warning types work (expiry, priority, quality) | ☐ |
| 7 | Mark as Dispatched feature works | ☐ |
| 8 | App works on mobile screen | ☐ |
| 9 | User guide written for production manager | ☐ |

---

## 🎯 One-Line Summary (Use This in Your Presentation)

| Intern | What to Say |
|---|---|
| **Intern 1** | *"I built an AI-powered shelf life prediction tool for HimShakti that analyses food ingredients and processing methods to predict exact expiry dates — helping the company reduce food waste and label their products correctly, without expensive lab testing."* |
| **Intern 2** | *"I built an AI-powered batch tracking system for HimShakti that auto-generates QR codes for every production batch and provides smart dispatch warnings using Google Gemini API."* |

---

> 📌 *Document prepared for TBI-GEU Summer Internship Program 2026 — HimShakti Food Processing Track*
> 📌 *Both interns must read this document fully before starting their project.*
