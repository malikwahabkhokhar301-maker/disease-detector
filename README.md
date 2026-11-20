# ⚕ MediScan – Human Disease Detector

A lightweight, privacy-friendly web app that suggests **possible conditions** from the symptoms you select, with self-care tips and clear guidance on **when to see a doctor**.

> **⚠ Medical disclaimer:** MediScan is an educational project. It does **not** diagnose disease and is **not** a substitute for professional medical advice, diagnosis or treatment. In an emergency, call your local emergency number or go to the nearest hospital.

---

## ✨ Features

- **40+ selectable symptoms**, grouped by body system, with live search
- **15 conditions** in the knowledge base, including ones common in South Asia (Dengue, Malaria, Typhoid, Hepatitis)
- **Weighted scoring engine** that ranks the top 5 matches with a confidence meter
- **Red-flag detection** that shows an emergency alert for combinations such as chest pain with breathlessness
- **Self-care tips** and a "When to see a doctor" note for every result
- Optional **age / sex / symptom duration** context
- **Print / Save as PDF** of your results
- **Dark mode** (follows system setting), responsive and accessible
- **100% client-side**: no server, no tracking, no data leaves your device

## 🚀 Quick start

No installation or build step is needed.

```bash
# Option 1: just open the file
open index.html            # macOS
start index.html           # Windows
xdg-open index.html        # Linux

# Option 2: serve locally
python -m http.server 8000
# then visit http://localhost:8000
```

## 📁 Project structure

```
mediscan/
├── index.html   # Page layout and markup
├── styles.css   # Responsive styling + dark mode
├── app.js       # Symptom data, scoring engine, UI logic
└── README.md
```

## 🧠 How it works

Every condition lists its symptoms with a weight: **3** = hallmark, **2** = common, **1** = occasional.

For each condition the app computes:

| Metric | Meaning |
|---|---|
| **Coverage** | Share of the condition's weighted symptoms you reported |
| **Precision** | Share of your selected symptoms that the condition explains |

```
score = 0.6 × coverage + 0.4 × precision   (+0.05 if a hallmark symptom matches, capped at 95%)
```

Conditions with fewer than two matching symptoms are filtered out, and the top five are shown. A separate **red-flag rule set** checks symptom combinations that need urgent care.

## 🔧 Customizing

**Add a symptom** in `app.js`:
```js
{ id: "ear_pain", label: "Ear pain", cat: "Head & Throat" }
```

**Add a condition**:
```js
{
  name: "Ear Infection", severity: "mild",
  symptoms: { ear_pain: 3, fever: 1, dizziness: 1 },
  about: "…",
  care: ["…"],
  doctor: "…"
}
```

**Add a red-flag rule** in the `RED_FLAGS` array.

> Have a qualified clinician review any medical content you add before using this beyond learning purposes.

## 🗺 Roadmap ideas

- Backend API with a database of conditions
- Machine-learning model trained on a public symptom dataset
- Urdu / multi-language support
- Nearby clinic and hospital finder
- Symptom history and progress tracker
- PWA / offline install

## 🛠 Tech stack

HTML5 · CSS3 (custom properties, grid) · Vanilla JavaScript (ES6)

## 👤 Credits

**Designed & developed by Ahmad Wahab**
BSCS Student, University of Central Punjab (UCP)
📧 malikwahabkhokhar301@gmail.com

If you use or adapt this project, please keep this credit line.

## 📄 License

Released under the **MIT License**. Copyright © 2026 Ahmad Wahab.

```
Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to
the inclusion of the above copyright notice and this permission notice in all copies.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```
