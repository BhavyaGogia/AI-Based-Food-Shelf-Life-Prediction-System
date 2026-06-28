# 📋 Intern 1 — Detailed Form Specification
## AI-Based Food Shelf Life Prediction System
### HimShakti Food Processing | TBI-GEU Summer Internship 2026

> **Document Type:** Form Design & Requirements Specification  
> **SDLC Phase:** Requirements Analysis → System Design  
> **Author Role:** Senior Product Manager + Frontend Architect  
> **Status:** Draft v1.0 — For Intern Review  
> **Last Updated:** June 2026

---

## 📌 Document Purpose

This document defines every field, section, validation rule, and interaction behavior for the **main input form** in Intern 1's Shelf Life Prediction App.

This is not just a list of fields. It is a production-grade form specification that tells the intern:
- What fields exist
- Why each field is needed
- What data type and input type to use
- What validation rules apply
- How the form flows from section to section
- How the collected data feeds into the Gemini AI prompt
- What the AI returns and how to display it

---

## 🗂️ Form Overview

| Property | Value |
|---|---|
| **Form Name** | Shelf Life Prediction Form |
| **Used By** | Production Staff at HimShakti Food Processing |
| **Triggered When** | Staff wants to determine shelf life BEFORE packaging |
| **Output** | Full AI-generated shelf life report (sealed + unsealed timelines, risks, tips) |
| **Total Sections** | 6 Sections |
| **Total Fields** | ~35 Fields |
| **Submission** | Single "Analyse Shelf Life" button at the end |
| **Layout** | Vertical scrollable form, grouped by section |

---

## 🧭 Form Flow (Section Navigation)

```
┌─────────────────────────────────────────────────────────┐
│  SECTION 1 → Product Identity                           │
│  SECTION 2 → Raw Material Sourcing                      │
│  SECTION 3 → Ingredient Composition                     │
│  SECTION 4 → Processing Method                         │
│  SECTION 5 → Packaging & Storage                       │
│  SECTION 6 → Additional Notes                          │
│                                                         │
│              [ 🔬 Analyse Shelf Life ]                  │
└─────────────────────────────────────────────────────────┘
```

> 💡 All 6 sections are visible at once (no multi-step wizard). Staff can fill in any order. Only the Analyse button triggers validation.

---

---

# 📂 SECTION 1 — Product Identity

> **Purpose:** Identify what product is being analysed so AI has the right category context.

---

### Field 1.1 — Product Name

| Property | Value |
|---|---|
| **Label** | Product Name |
| **Input Type** | Text Input |
| **Placeholder** | e.g., Himalayan Millet Pickle |
| **Required** | ✅ Yes |
| **Max Length** | 80 characters |
| **Validation** | Cannot be empty. No special characters except hyphen and space. |
| **Why Needed** | Used as the report heading. Helps AI identify the product during response generation. |

---

### Field 1.2 — Product Category

| Property | Value |
|---|---|
| **Label** | Product Category |
| **Input Type** | Dropdown (Select) |
| **Required** | ✅ Yes |
| **Options** | See table below |
| **Default** | — Select Product Category — |
| **Why Needed** | AI uses category to apply the correct food science baseline for prediction. |

**Dropdown Options:**

| Option Value | Display Label |
|---|---|
| `millet_snack` | 🌾 Millet Snack (Jowar / Bajra based) |
| `fruit_pickle` | 🫙 Fruit Pickle (Himalayan fruit + spices) |
| `vegetable_pickle` | 🫙 Vegetable Pickle (Vegetables + spices) |
| `fruit_juice` | 🍹 Fruit Juice (Cold pressed / Fresh) |
| `mixed_millet_product` | 🌾 Mixed Millet Product |
| `other` | 🔖 Other (describe in notes) |

**Conditional Logic:**
- If `other` is selected → show a text input for the user to describe the product type.

---

### Field 1.3 — Batch Reference Number *(Optional)*

| Property | Value |
|---|---|
| **Label** | Batch Reference No. (Optional) |
| **Input Type** | Text Input |
| **Placeholder** | e.g., BATCH-2026-042 |
| **Required** | ❌ No |
| **Max Length** | 30 characters |
| **Why Needed** | Allows cross-referencing this shelf life report with Intern 2's Batch Tracking system. Not used by AI. |

---

### Field 1.4 — Analysis Date

| Property | Value |
|---|---|
| **Label** | Analysis Date |
| **Input Type** | Date Picker |
| **Default** | Today's date (auto-filled) |
| **Required** | ✅ Yes |
| **Why Needed** | Used to calculate the exact "Best Before" calendar date from the predicted shelf life duration. |

---

---

# 📂 SECTION 2 — Raw Material Sourcing

> **Purpose:** Capture where ingredients come from. This data feeds AI to adjust shelf life prediction based on sourcing quality, altitude, freshness, and transit risk.

---

### Field 2.1 — Primary Ingredient / Crop Name

| Property | Value |
|---|---|
| **Label** | Primary Ingredient |
| **Input Type** | Dropdown with "Add Custom" option |
| **Required** | ✅ Yes |
| **Why Needed** | AI needs to know the main crop/ingredient to apply sourcing-based adjustment rules. |

**Dropdown Options (Pre-filled from HimShakti supplier data):**

| Option Value | Display Label |
|---|---|
| `jowar` | Jowar (Sorghum) |
| `bajra` | Bajra (Pearl Millet) |
| `himalayan_apricot` | Himalayan Apricot |
| `wild_turmeric` | Wild Himalayan Turmeric |
| `mustard` | Mustard (Seed / Oil) |
| `rock_salt` | Rock Salt (Sendha Namak) |
| `custom` | + Add Custom Ingredient |

If `custom` is selected → show text input for custom name.

---

### Field 2.2 — Farmer / Supplier Name

| Property | Value |
|---|---|
| **Label** | Farmer / Supplier Name |
| **Input Type** | Dropdown with "Enter Manually" option |
| **Required** | ✅ Yes |
| **Why Needed** | Used in the report for traceability. AI uses name to associate with known supplier quality data. |

**Dropdown Options (Pre-filled from HimShakti supplier list):**

| Supplier Name | Auto-fills Village + District |
|---|---|
| Dinesh Rawat | Lansdowne, Pauri Garhwal |
| Meera Devi | Kotdwar, Pauri Garhwal |
| Suresh Bisht | Bageshwar, Bageshwar |
| Kamla Negi | Munsiyari, Pithoragarh |
| Prakash Joshi | Almora, Almora |
| Kumaon Naturals (Supplier) | Haldwani, Nainital |
| Enter Manually | → Shows manual fields |

> 💡 **Smart Auto-fill:** When staff selects a known farmer from the dropdown, the Village, District, and Altitude fields auto-populate. Staff can override if needed.

---

### Field 2.3 — Village / Location

| Property | Value |
|---|---|
| **Label** | Village / Location |
| **Input Type** | Text Input |
| **Placeholder** | e.g., Munsiyari |
| **Required** | ✅ Yes |
| **Auto-fill** | Yes — filled automatically when farmer is selected from dropdown |
| **Why Needed** | Location helps AI understand regional climate conditions. |

---

### Field 2.4 — District

| Property | Value |
|---|---|
| **Label** | District |
| **Input Type** | Dropdown |
| **Required** | ✅ Yes |
| **Auto-fill** | Yes — filled automatically when farmer is selected |

**Dropdown Options:**

| District |
|---|
| Pithoragarh |
| Bageshwar |
| Almora |
| Pauri Garhwal |
| Chamoli |
| Nainital |
| Dehradun |
| Uttarkashi |
| Other (Uttarakhand) |
| Other (Outside Uttarakhand) |

---

### Field 2.5 — Farm Altitude (metres above sea level)

| Property | Value |
|---|---|
| **Label** | Farm Altitude (metres) |
| **Input Type** | Number Input with Slider |
| **Range** | 200 m — 3500 m |
| **Default** | 1200 m |
| **Step** | 50 m |
| **Required** | ✅ Yes |
| **Auto-fill** | Yes — from known farmer data |
| **Why Needed** | Higher altitude = lower bacterial load, lower moisture. AI gives +5% shelf life bonus for altitude > 1500m. |

**UI Guidance Label (shown below slider):**
```
< 800m  : Plains / Valley crop  
800–1500m : Mid-Himalayan crop  
> 1500m : High Himalayan crop ✅ (Better shelf life)
```

---

### Field 2.6 — Harvest Date

| Property | Value |
|---|---|
| **Label** | Ingredient Harvest Date |
| **Input Type** | Month + Year Picker |
| **Required** | ✅ Yes |
| **Validation** | Cannot be a future date. Cannot be older than 12 months. |
| **Why Needed** | Freshness calculation. AI applies shelf life reduction if ingredient is older than 30 days at the time of processing. |

**AI Rule (display as tooltip):**
```
✅ Harvested within 30 days → Full shelf life applies  
⚠️ Harvested 31–60 days ago → Mild reduction  
🚨 Harvested > 60 days ago → AI issues degradation warning
```

---

### Field 2.7 — Transport Distance (farm to factory, in km)

| Property | Value |
|---|---|
| **Label** | Distance from Farm to Factory (km) |
| **Input Type** | Number Input |
| **Range** | 1 — 1000 km |
| **Required** | ✅ Yes |
| **Placeholder** | e.g., 120 |
| **Why Needed** | Longer transit = higher contamination exposure risk. AI reduces shelf life estimate for distances > 200 km. |

---

### Field 2.8 — Storage Before Delivery

| Property | Value |
|---|---|
| **Label** | How long was ingredient stored before delivery to factory? |
| **Input Type** | Radio Buttons |
| **Required** | ✅ Yes |
| **Options** | See below |

**Options:**

| Value | Label |
|---|---|
| `same_day` | Same day (harvested and delivered same day) |
| `1_day` | 1 day storage |
| `2_3_days` | 2–3 days storage |
| `1_week` | About 1 week |
| `more_than_week` | More than 1 week ⚠️ |

---

---

# 📂 SECTION 3 — Ingredient Composition

> **Purpose:** Capture the recipe's ingredient percentages. This is the most critical section for AI shelf life prediction. The preservative effect of salt, oil, vinegar, turmeric, and sugar determines how long the product will last.

---

### 3A — Preservative Ingredients

> These ingredients directly extend shelf life. AI gives each a preservative power score.

---

### Field 3.1 — Salt Percentage (%)

| Property | Value |
|---|---|
| **Label** | Salt Content (%) |
| **Input Type** | Slider + Number Input |
| **Range** | 0% — 25% |
| **Step** | 0.5% |
| **Default** | 5% |
| **Required** | ✅ Yes |
| **Why Needed** | Salt is the most common natural preservative. Higher salt = longer shelf life. |

**AI Guidance Tooltip:**
```
< 3%   : Low preservation — shelf life under 2 months  
3–8%   : Moderate — 3–6 months  
8–15%  : High — 6–12 months  
> 15%  : Very high — pickles only, not snacks
```

---

### Field 3.2 — Oil Content (%)

| Property | Value |
|---|---|
| **Label** | Mustard Oil / Cooking Oil Content (%) |
| **Input Type** | Slider + Number Input |
| **Range** | 0% — 40% |
| **Step** | 1% |
| **Default** | 0% |
| **Required** | ❌ No (0 = not used) |
| **Why Needed** | Oil creates an oxygen barrier in pickles, extending shelf life significantly. |

---

### Field 3.3 — Vinegar / Acetic Acid (%)

| Property | Value |
|---|---|
| **Label** | Vinegar / Acetic Acid Content (%) |
| **Input Type** | Slider + Number Input |
| **Range** | 0% — 10% |
| **Step** | 0.5% |
| **Default** | 0% |
| **Required** | ❌ No |
| **Why Needed** | Lowers pH → prevents bacterial growth. Key for pickles and preserved juices. |

---

### Field 3.4 — Sugar Content (%)

| Property | Value |
|---|---|
| **Label** | Sugar / Jaggery Content (%) |
| **Input Type** | Slider + Number Input |
| **Range** | 0% — 60% |
| **Step** | 1% |
| **Default** | 0% |
| **Required** | ❌ No |
| **Why Needed** | High sugar acts as preservative (jams, chutneys). But moderate sugar + moisture = fermentation risk. AI checks this. |

---

### Field 3.5 — Turmeric Percentage (%)

| Property | Value |
|---|---|
| **Label** | Turmeric Content (%) |
| **Input Type** | Number Input |
| **Range** | 0% — 10% |
| **Step** | 0.5% |
| **Default** | 0% |
| **Required** | ❌ No |
| **Why Needed** | Turmeric has natural antimicrobial properties. Used in HimShakti's Himalayan pickles. |

---

### Field 3.6 — Other Spices / Natural Preservatives

| Property | Value |
|---|---|
| **Label** | Other Spices or Natural Preservatives (%) |
| **Input Type** | Text Input + Percentage |
| **Required** | ❌ No |
| **Max Entries** | 5 additional spices |
| **Placeholder** | e.g., Fenugreek 1.5%, Black Pepper 0.5% |
| **Why Needed** | Captures the full recipe for AI. Individual spices may have minor preservative effects. |

---

### 3B — Moisture Content

---

### Field 3.7 — Estimated Moisture Content (%)

| Property | Value |
|---|---|
| **Label** | Estimated Moisture Content of Final Product (%) |
| **Input Type** | Slider + Number Input |
| **Range** | 0% — 80% |
| **Step** | 1% |
| **Required** | ✅ Yes |
| **Why Needed** | **Most critical shelf life factor.** High moisture = bacterial growth = short shelf life. AI's primary decay predictor. |

**UI Guidance Label:**
```
< 10%  : Dry product (snacks) — very long shelf life possible  
10–25% : Semi-moist — moderate risk  
25–50% : Moist (chutneys, pickles) — refrigeration may be needed  
> 50%  : High moisture (juices) — short shelf life, refrigeration required
```

---

### Field 3.8 — Water Activity Estimate

| Property | Value |
|---|---|
| **Label** | Water Activity (Aw) — Estimated |
| **Input Type** | Dropdown |
| **Required** | ❌ No (advanced field) |
| **Default** | Not sure — let AI estimate |
| **Why Needed** | Water activity is the scientific measure of free water. More accurate than moisture % alone. Optional for advanced users. |

**Dropdown Options:**

| Value | Label |
|---|---|
| `not_sure` | Not sure — let AI estimate from moisture % |
| `below_0.6` | Below 0.6 — Very dry (nuts, dried grains) |
| `0.6_0.75` | 0.60–0.75 — Low moisture foods |
| `0.75_0.85` | 0.75–0.85 — Intermediate moisture |
| `0.85_0.95` | 0.85–0.95 — Semi-moist / pickles |
| `above_0.95` | Above 0.95 — High moisture (juices, fresh foods) |

---

### 3C — Total Percentage Validator

> ⚠️ **UI Rule:** A live total counter must display at the bottom of Section 3:

```
┌─────────────────────────────────────────┐
│  Total Ingredient % so far:  73.5%      │
│  ⚠️ Note: Percentages need not total    │
│  exactly 100% — remaining % is base     │
│  ingredient (grain, fruit, vegetable).  │
└─────────────────────────────────────────┘
```

---

---

# 📂 SECTION 4 — Processing Method

> **Purpose:** How the product is prepared directly affects moisture, enzyme activity, microbial load, and therefore shelf life. AI uses this to apply processing-based modifiers.

---

### Field 4.1 — Primary Processing Method

| Property | Value |
|---|---|
| **Label** | How is this product processed? |
| **Input Type** | Radio Buttons (Single Select) |
| **Required** | ✅ Yes |

**Options:**

| Value | Label | AI Effect |
|---|---|---|
| `sun_dried` | ☀️ Sun-dried (Traditional outdoor drying) | Removes moisture; variable quality based on weather |
| `machine_dried` | 🔧 Machine-dried (Dehydrator / Oven) | Consistent moisture removal; more reliable |
| `steam_cooked` | 💨 Steam Cooked | Kills surface bacteria; high moisture retained |
| `boiled` | 🫕 Boiled / Pressure Cooked | Pasteurization effect; high moisture retained |
| `cold_pressed` | 🧊 Cold Pressed (Juices) | No heat; no preservation; very short shelf life |
| `roasted` | 🔥 Roasted / Dry Roasted (Snacks) | Low moisture; reduces bacteria; good for snacks |
| `raw` | 🌿 Raw / Minimal Processing | No preservation; very short shelf life |
| `fermented` | 🧫 Fermented | Complex preservation; AI evaluates pH and salt together |

---

### Field 4.2 — Processing Duration

| Property | Value |
|---|---|
| **Label** | How long is the product processed? |
| **Input Type** | Number Input + Unit Dropdown |
| **Unit Options** | Hours / Days |
| **Range** | 1 Hour — 30 Days |
| **Required** | ✅ Yes |
| **Why Needed** | Longer sun-drying = lower moisture = longer shelf life. AI uses duration with method to calculate effectiveness. |

---

### Field 4.3 — Processing Temperature (if applicable)

| Property | Value |
|---|---|
| **Label** | Processing Temperature (°C) |
| **Input Type** | Number Input |
| **Placeholder** | e.g., 60 |
| **Required** | ❌ No |
| **Show Condition** | Shown only when processing method is NOT sun_dried or raw |
| **Why Needed** | Temperature determines pasteurization effect. Above 70°C kills most pathogens. |

---

### Field 4.4 — Is the product cooked before final packaging?

| Property | Value |
|---|---|
| **Label** | Is the product cooked / heat-treated before sealing? |
| **Input Type** | Toggle (Yes / No) |
| **Required** | ✅ Yes |
| **Default** | No |
| **Why Needed** | Final heat treatment (e.g., boiling a pickle before sealing) significantly extends shelf life by killing microbes. |

---

### Field 4.5 — pH Level (if known)

| Property | Value |
|---|---|
| **Label** | pH of Final Product (if tested or estimated) |
| **Input Type** | Dropdown |
| **Required** | ❌ No |
| **Default** | Not tested — let AI estimate |

**Options:**

| Value | Label | AI Implication |
|---|---|---|
| `not_tested` | Not tested — let AI estimate | AI uses vinegar % and salt % to estimate |
| `below_3.5` | Below 3.5 (Very Acidic) | Excellent preservation — bacteria cannot survive |
| `3.5_4.5` | 3.5–4.5 (Acidic) | Good preservation for pickles |
| `4.5_6` | 4.5–6.0 (Mildly Acidic) | Moderate — additional preservatives needed |
| `6_7` | 6.0–7.0 (Near Neutral) | Low preservation — short shelf life |
| `above_7` | Above 7.0 (Alkaline) | Risky — bacteria thrive; very short shelf life |

---

---

# 📂 SECTION 5 — Packaging & Storage

> **Purpose:** The packaging type and storage environment are the final determinants of shelf life. This section is split by **Sealed** and **Post-Opening** to produce two separate lifecycle timelines in the AI report.

---

### Field 5.1 — Packaging Type

| Property | Value |
|---|---|
| **Label** | Packaging Type |
| **Input Type** | Radio Buttons with Icons |
| **Required** | ✅ Yes |

**Options:**

| Value | Label | Icon | AI Effect |
|---|---|---|---|
| `glass_jar` | Glass Jar (with metal lid) | 🫙 | Best oxygen barrier; longest shelf life |
| `vacuum_sealed_pouch` | Vacuum Sealed Plastic Pouch | 🛍️ | Excellent for dry snacks; no oxygen |
| `plastic_bottle` | Plastic Bottle (PET / HDPE) | 🍶 | Good for juices; moderate barrier |
| `regular_plastic_pouch` | Regular Plastic Pouch (unsealed) | 🛍️ | Poor barrier; shortest shelf life |
| `tin_can` | Tin / Metal Can | 🥫 | Excellent barrier; rarely used by HimShakti |
| `paper_bag` | Paper Bag / Packet | 📦 | Very short shelf life; moisture ingress |

---

### Field 5.2 — Is the packaging airtight / vacuum sealed?

| Property | Value |
|---|---|
| **Label** | Is the packaging airtight? |
| **Input Type** | Toggle (Yes / No) |
| **Required** | ✅ Yes |
| **Default** | No |
| **Why Needed** | Airtight packaging prevents oxidation and moisture ingress — critical shelf life extender. |

---

### Field 5.3 — Storage Condition (Sealed / Before Opening)

| Property | Value |
|---|---|
| **Label** | Where will the sealed product be stored? |
| **Input Type** | Radio Buttons |
| **Required** | ✅ Yes |
| **Label Header** | 🔒 Sealed Package Storage Condition |

**Options:**

| Value | Label |
|---|---|
| `room_temp_dry` | Room Temperature — Dry Place (15–25°C) |
| `room_temp_humid` | Room Temperature — Humid / Kitchen Area |
| `cool_room` | Cool Room / Pantry (10–15°C) |
| `refrigerated` | Refrigerated (2–8°C) |
| `frozen` | Frozen (below 0°C) |

---

### Field 5.4 — Storage Condition (After Opening)

| Property | Value |
|---|---|
| **Label** | Where will product be stored after opening? |
| **Input Type** | Radio Buttons |
| **Required** | ✅ Yes |
| **Label Header** | 🔓 After-Opening Storage Condition |

**Options:**

| Value | Label |
|---|---|
| `room_temp` | Room Temperature (customer keeps on shelf) |
| `refrigerated` | Refrigerated (customer puts in fridge) |
| `not_specified` | Not specified / varies by customer |

---

### Field 5.5 — Estimated Humidity of Storage Environment

| Property | Value |
|---|---|
| **Label** | Humidity of Likely Storage Location |
| **Input Type** | Dropdown |
| **Required** | ❌ No |
| **Default** | Moderate (40–60% RH) |

**Options:**

| Value | Label |
|---|---|
| `low` | Low Humidity — < 40% RH (hill stations, dry areas) |
| `moderate` | Moderate — 40–60% RH (standard storage) |
| `high` | High Humidity — > 60% RH (plains, monsoon, coastal) |

---

### Field 5.6 — Expected Distribution Channel

| Property | Value |
|---|---|
| **Label** | Where will this product be sold / distributed? |
| **Input Type** | Checkbox (Multi-select) |
| **Required** | ❌ No |

**Options:**

| Value | Label |
|---|---|
| `local_market` | Local Haat / Village Market |
| `city_retail` | City Retail Stores |
| `online` | Online (Shipped across India) |
| `export` | Export / Interstate Shipping |
| `institutional` | Institutional / Bulk Supply |

> ⚠️ AI uses this to flag transit duration risks. Online + high moisture = ⚠️ warning.

---

---

# 📂 SECTION 6 — Additional Notes

> **Purpose:** Free-text context for the AI to factor in observations the form fields cannot capture.

---

### Field 6.1 — Special Observations / Notes

| Property | Value |
|---|---|
| **Label** | Any special observations about this batch? |
| **Input Type** | Textarea |
| **Max Length** | 500 characters |
| **Required** | ❌ No |
| **Placeholder** | e.g., "Batch made during monsoon season, higher humidity than usual", "Turmeric was locally sourced wild variety with stronger colour", "Oil was cold-pressed this time" |
| **Why Needed** | Allows staff to give AI qualitative context that sliders and dropdowns cannot capture. AI includes these observations in its reasoning. |

---

### Field 6.2 — Known Batch Issues (if any)

| Property | Value |
|---|---|
| **Label** | Any known quality issues with ingredients? |
| **Input Type** | Checkbox (Multi-select) |
| **Required** | ❌ No |

**Options:**

| Value | Label | AI Effect |
|---|---|---|
| `none` | No known issues | No reduction |
| `slight_discolor` | Slight discoloration noticed | Minor quality flag |
| `unusual_smell` | Unusual smell in raw ingredient | ⚠️ AI reduces estimate + adds risk warning |
| `excess_moisture` | Ingredient felt wetter than usual | ⚠️ AI reduces estimate significantly |
| `old_stock` | Some ingredient was older stock | ⚠️ Degradation warning |
| `pest_exposure` | Possible pest exposure at farm | 🚨 AI recommends testing before use |

---

---

# 🔬 SUBMIT SECTION

### Submit Button

| Property | Value |
|---|---|
| **Button Label** | 🔬 Analyse Shelf Life |
| **Position** | Sticky bottom bar OR end of form |
| **Color** | Deep Forest Green (#2D6A2D) — aligns with HimShakti brand |
| **Disabled State** | Button greyed out until all required fields are filled |
| **Loading State** | Shows "🤖 AI is analysing your product..." with animated loader |
| **Error State** | Highlights all empty required fields in red with error messages |

---

### Pre-Submission Validation Checklist (Client-side)

| Validation | Rule | Error Message |
|---|---|---|
| Product Name | Not empty | "Please enter a product name." |
| Product Category | Selected | "Please select a product category." |
| Analysis Date | Not empty | "Please select today's date or analysis date." |
| Primary Ingredient | Selected | "Please select the main ingredient." |
| Farmer/Supplier | Selected or entered | "Please enter the farmer or supplier name." |
| Salt % | Filled | "Please enter salt content (enter 0 if no salt)." |
| Moisture % | Filled | "Please estimate moisture content." |
| Processing Method | Selected | "Please select the processing method." |
| Processing Duration | Filled | "Please enter how long the product is processed." |
| Packaging Type | Selected | "Please select a packaging type." |
| Sealed Storage Condition | Selected | "Please select where the sealed product is stored." |
| After-Opening Storage | Selected | "Please select the after-opening storage condition." |

---

---

# 🤖 AI PROMPT ARCHITECTURE

> **Purpose:** Define exactly how the collected form data is converted into a Gemini AI prompt. This ensures consistent, accurate, food-science-grounded responses.

---

## Prompt Template (System Role)

```
You are a food science expert specialising in natural preservation of traditional 
Indian Himalayan foods. You work for HimShakti Food Processing, a company that 
produces millet snacks, pickles, and juices WITHOUT chemical preservatives.

Your task is to predict the shelf life of a product based on the data provided.
You MUST:
1. Give a shelf life estimate for the SEALED package
2. Give a separate shelf life estimate for AFTER OPENING
3. Identify at least 2 risk factors
4. Give at least 2 practical improvement suggestions
5. Calculate and state the exact "Best Before" date to print on the label
6. Flag any dangerous ingredient combinations (fermentation risk, botulism risk, etc.)

Respond in structured JSON format only.
```

---

## Prompt Data Injection (User Role)

```
Analyse the shelf life of the following food product:

PRODUCT IDENTITY:
- Product Name: {field_1.1}
- Category: {field_1.2}
- Analysis Date: {field_1.4}

RAW MATERIAL SOURCING:
- Main Ingredient: {field_2.1}
- Farmer/Supplier: {field_2.2}
- Village: {field_2.3}, District: {field_2.4}
- Farm Altitude: {field_2.5} metres above sea level
- Harvest Date: {field_2.6}
- Days since harvest (calculated): {auto_calculated}
- Transport Distance: {field_2.7} km
- Pre-delivery Storage: {field_2.8}

INGREDIENT COMPOSITION:
- Salt: {field_3.1}%
- Oil: {field_3.2}%
- Vinegar: {field_3.3}%
- Sugar: {field_3.4}%
- Turmeric: {field_3.5}%
- Other: {field_3.6}
- Moisture Content: {field_3.7}%
- Water Activity (Aw): {field_3.8}

PROCESSING:
- Method: {field_4.1}
- Duration: {field_4.2}
- Temperature: {field_4.3}°C
- Final heat treatment before sealing: {field_4.4}
- pH Level: {field_4.5}

PACKAGING & STORAGE:
- Package Type: {field_5.1}
- Airtight/Vacuum Sealed: {field_5.2}
- Sealed Storage Condition: {field_5.3}
- After-Opening Storage: {field_5.4}
- Storage Humidity: {field_5.5}
- Distribution Channel: {field_5.6}

ADDITIONAL CONTEXT:
- Staff Notes: {field_6.1}
- Known Issues: {field_6.2}
```

---

## Expected AI Response Format (JSON)

```json
{
  "product_name": "...",
  "analysis_date": "...",
  "sealed_shelf_life": {
    "duration_months": 8,
    "duration_display": "8 months",
    "best_before_date": "February 2027",
    "storage_condition": "Room temperature, dry place",
    "confidence": "High"
  },
  "after_opening_shelf_life": {
    "room_temp_days": 21,
    "refrigerated_days": 45,
    "display_room_temp": "3 weeks",
    "display_refrigerated": "6 weeks",
    "label_instruction": "Use within 3 weeks of opening. Refrigerate after opening."
  },
  "risk_factors": [
    {
      "severity": "warning",
      "message": "Moisture above 15% may reduce shelf life to 5 months in humid storage."
    },
    {
      "severity": "danger",
      "message": "Sugar + moisture combination may cause fermentation within 6 weeks. Monitor packaging integrity."
    }
  ],
  "improvement_suggestions": [
    "Add 2% more vinegar to lower pH below 4.0 — this can extend shelf life by 2–3 months.",
    "Switch from regular plastic pouch to vacuum-sealed pouch — adds 4 months to sealed shelf life."
  ],
  "sourcing_adjustment": {
    "applied": true,
    "reason": "High altitude sourcing (2200m, Munsiyari) — +5% shelf life bonus applied.",
    "adjustment_percent": 5
  },
  "label_ready_text": "Best Before: February 2027 | Use within 3 weeks of opening | Store in cool, dry place",
  "safety_alert": null
}
```

---

---

# 🖥️ UPDATED APP SCREEN LAYOUT (With All Sections)

```
┌──────────────────────────────────────────────────────────────┐
│    🌿 HimShakti — Food Shelf Life Prediction System          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ── SECTION 1: PRODUCT IDENTITY ─────────────────────────── │
│  Product Name:         [ Himalayan Millet Pickle           ] │
│  Product Category:     [ Fruit Pickle (Himalayan)     ▼   ] │
│  Batch Reference:      [ BATCH-2026-042      (optional)    ] │
│  Analysis Date:        [ 11 June 2026    📅             ]   │
│                                                              │
│  ── SECTION 2: RAW MATERIAL SOURCING ────────────────────── │
│  Primary Ingredient:   [ Wild Himalayan Turmeric      ▼   ] │
│  Farmer/Supplier:      [ Kamla Negi (Munsiyari)       ▼   ] │
│  Village/Location:     [ Munsiyari          ] (auto-filled)  │
│  District:             [ Pithoragarh        ] (auto-filled)  │
│  Farm Altitude:        [====●=====] 2200m                    │
│  Harvest Date:         [ April 2026  📅                   ] │
│  Transport Distance:   [ 185 ] km                           │
│  Pre-delivery Storage: ● Same day  ○ 1 day  ○ 2–3 days      │
│                                                              │
│  ── SECTION 3: INGREDIENT COMPOSITION ───────────────────── │
│  Salt:         [===●=====] 9%                               │
│  Mustard Oil:  [=====●===] 18%                              │
│  Vinegar:      [==●======] 3%                               │
│  Sugar:        [●========] 0%                               │
│  Turmeric:     [=●=======] 2%                               │
│  Moisture:     [======●==] 25%                              │
│  Water Activity: [ Not tested — let AI estimate       ▼   ] │
│  Total so far: 57%  (remaining % is base fruit/vegetable)    │
│                                                              │
│  ── SECTION 4: PROCESSING METHOD ────────────────────────── │
│  Method:  ○ Sun-dried  ● Boiled  ○ Cold Pressed  ○ Roasted  │
│  Duration: [ 2 ] [ Hours ▼ ]                                │
│  Temperature: [ 90 ] °C                                     │
│  Heat treated before sealing? [✅ Yes]                       │
│  pH Level: [ 3.5–4.5 (Acidic — good for pickles)     ▼   ] │
│                                                              │
│  ── SECTION 5: PACKAGING & STORAGE ──────────────────────── │
│  Packaging: ● Glass Jar  ○ Vacuum Pouch  ○ Plastic Bottle   │
│  Airtight / Vacuum Sealed? [✅ Yes]                          │
│                                                              │
│  🔒 Sealed Storage:  ● Room Temp Dry  ○ Refrigerated         │
│  🔓 After Opening:   ○ Room Temp  ● Refrigerated            │
│  Humidity: [ Moderate 40–60% RH                       ▼   ] │
│  Distribution: [✅ Local Market] [✅ City Retail] [ ] Online  │
│                                                              │
│  ── SECTION 6: ADDITIONAL NOTES ─────────────────────────── │
│  Notes: [Batch made just after monsoon, slightly wetter    ] │
│  Issues: [✅ None]                                           │
│                                                              │
│          [ 🔬  Analyse Shelf Life  ]                         │
└──────────────────────────────────────────────────────────────┘
```

---

---

# 📊 FIELD SUMMARY TABLE

| # | Section | Field Name | Type | Required |
|---|---|---|---|---|
| 1.1 | Product Identity | Product Name | Text | ✅ |
| 1.2 | Product Identity | Product Category | Dropdown | ✅ |
| 1.3 | Product Identity | Batch Reference | Text | ❌ |
| 1.4 | Product Identity | Analysis Date | Date | ✅ |
| 2.1 | Sourcing | Primary Ingredient | Dropdown | ✅ |
| 2.2 | Sourcing | Farmer / Supplier | Dropdown + Manual | ✅ |
| 2.3 | Sourcing | Village / Location | Text (auto-fill) | ✅ |
| 2.4 | Sourcing | District | Dropdown (auto-fill) | ✅ |
| 2.5 | Sourcing | Farm Altitude | Slider + Number | ✅ |
| 2.6 | Sourcing | Harvest Date | Month/Year | ✅ |
| 2.7 | Sourcing | Transport Distance | Number (km) | ✅ |
| 2.8 | Sourcing | Storage Before Delivery | Radio | ✅ |
| 3.1 | Ingredients | Salt % | Slider | ✅ |
| 3.2 | Ingredients | Oil % | Slider | ❌ |
| 3.3 | Ingredients | Vinegar % | Slider | ❌ |
| 3.4 | Ingredients | Sugar % | Slider | ❌ |
| 3.5 | Ingredients | Turmeric % | Number | ❌ |
| 3.6 | Ingredients | Other Spices | Text + % | ❌ |
| 3.7 | Ingredients | Moisture Content % | Slider | ✅ |
| 3.8 | Ingredients | Water Activity (Aw) | Dropdown | ❌ |
| 4.1 | Processing | Processing Method | Radio | ✅ |
| 4.2 | Processing | Processing Duration | Number + Unit | ✅ |
| 4.3 | Processing | Processing Temperature | Number | ❌ |
| 4.4 | Processing | Heat Treated Before Sealing? | Toggle | ✅ |
| 4.5 | Processing | pH Level | Dropdown | ❌ |
| 5.1 | Packaging | Packaging Type | Radio | ✅ |
| 5.2 | Packaging | Airtight / Vacuum Sealed? | Toggle | ✅ |
| 5.3 | Storage | Sealed Storage Condition | Radio | ✅ |
| 5.4 | Storage | After-Opening Storage | Radio | ✅ |
| 5.5 | Storage | Storage Humidity | Dropdown | ❌ |
| 5.6 | Storage | Distribution Channel | Checkbox | ❌ |
| 6.1 | Notes | Staff Observations | Textarea | ❌ |
| 6.2 | Notes | Known Batch Issues | Checkbox | ❌ |

**Total Fields: 32 | Required: 18 | Optional: 14**

---

---

# ✅ ACCEPTANCE CRITERIA

The form is considered complete and ready for implementation when:

| # | Criteria |
|---|---|
| 1 | All 6 sections render correctly on desktop and mobile screens |
| 2 | All 18 required fields show error messages when empty on submit |
| 3 | Farmer dropdown auto-fills Village, District, and Altitude correctly |
| 4 | Sliders update number inputs in real time (and vice versa) |
| 5 | Processing Temperature field shows ONLY when relevant method is selected |
| 6 | The AI prompt is correctly constructed from all form values before calling Gemini API |
| 7 | AI returns both sealed and after-opening shelf life timelines |
| 8 | Best Before date is correctly calculated and displayed |
| 9 | Risk warnings render with correct severity icons (⚠️ / 🚨) |
| 10 | Improvement suggestions are displayed clearly |
| 11 | Form works on mobile screen (responsive layout) |
| 12 | Loading state shows while AI is processing |

---

> 📌 *This document is part of TBI-GEU Summer Internship 2026 — HimShakti Food Processing Track*  
> 📌 *Refer to `TBI-GEU-Intern-Project-Guide.md` for full project context and lifecycle details.*  
> 📌 *Intern 1 must implement this form exactly as specified. Deviations must be documented and justified.*
