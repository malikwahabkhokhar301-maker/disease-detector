/*!
 * MediScan – Human Disease Detector
 * Designed & developed by Ahmad Wahab (BSCS, UCP)
 * Educational rule-based symptom checker. NOT medical advice.
 */
(function () {
  "use strict";

  /* ---------- 1. Symptom catalogue ---------- */
  const SYMPTOMS = [
    // General
    { id: "fever", label: "Fever", cat: "General" },
    { id: "high_fever", label: "High fever (above 39°C / 102°F)", cat: "General" },
    { id: "chills", label: "Chills / shivering", cat: "General" },
    { id: "fatigue", label: "Fatigue / weakness", cat: "General" },
    { id: "body_ache", label: "Body aches", cat: "General" },
    { id: "joint_pain", label: "Joint pain", cat: "General" },
    { id: "weight_loss", label: "Unexplained weight loss", cat: "General" },
    { id: "sweating", label: "Heavy sweating", cat: "General" },
    // Head & throat
    { id: "headache", label: "Headache", cat: "Head & Throat" },
    { id: "severe_headache", label: "Severe / sudden headache", cat: "Head & Throat" },
    { id: "sore_throat", label: "Sore throat", cat: "Head & Throat" },
    { id: "runny_nose", label: "Runny / blocked nose", cat: "Head & Throat" },
    { id: "sneezing", label: "Sneezing", cat: "Head & Throat" },
    { id: "itchy_eyes", label: "Itchy / watery eyes", cat: "Head & Throat" },
    { id: "pain_behind_eyes", label: "Pain behind the eyes", cat: "Head & Throat" },
    { id: "light_sensitivity", label: "Sensitivity to light", cat: "Head & Throat" },
    { id: "neck_stiffness", label: "Stiff neck", cat: "Head & Throat" },
    { id: "blurred_vision", label: "Blurred vision", cat: "Head & Throat" },
    { id: "loss_smell", label: "Loss of smell / taste", cat: "Head & Throat" },
    { id: "dizziness", label: "Dizziness", cat: "Head & Throat" },
    // Chest
    { id: "cough", label: "Cough", cat: "Chest & Breathing" },
    { id: "dry_cough", label: "Dry cough", cat: "Chest & Breathing" },
    { id: "phlegm", label: "Cough with phlegm", cat: "Chest & Breathing" },
    { id: "shortness_breath", label: "Shortness of breath", cat: "Chest & Breathing" },
    { id: "wheezing", label: "Wheezing", cat: "Chest & Breathing" },
    { id: "chest_pain", label: "Chest pain", cat: "Chest & Breathing" },
    // Stomach
    { id: "nausea", label: "Nausea", cat: "Digestive" },
    { id: "vomiting", label: "Vomiting", cat: "Digestive" },
    { id: "diarrhea", label: "Diarrhea", cat: "Digestive" },
    { id: "constipation", label: "Constipation", cat: "Digestive" },
    { id: "abdominal_pain", label: "Abdominal pain / cramps", cat: "Digestive" },
    { id: "loss_appetite", label: "Loss of appetite", cat: "Digestive" },
    { id: "yellow_skin", label: "Yellow skin / eyes (jaundice)", cat: "Digestive" },
    { id: "dark_urine", label: "Dark urine", cat: "Digestive" },
    // Urinary / metabolic
    { id: "burning_urination", label: "Burning when urinating", cat: "Urinary & Metabolic" },
    { id: "frequent_urination", label: "Frequent urination", cat: "Urinary & Metabolic" },
    { id: "excess_thirst", label: "Excessive thirst", cat: "Urinary & Metabolic" },
    { id: "lower_abdominal_pain", label: "Lower abdominal / pelvic pain", cat: "Urinary & Metabolic" },
    // Skin
    { id: "rash", label: "Skin rash", cat: "Skin" },
    { id: "itching", label: "Itchy skin", cat: "Skin" },
    { id: "swelling_legs", label: "Swollen legs / ankles", cat: "Skin" }
  ];

  /* ---------- 2. Condition knowledge base ----------
     weights: 3 = hallmark, 2 = common, 1 = occasional */
  const CONDITIONS = [
    {
      name: "Common Cold", severity: "mild",
      symptoms: { runny_nose: 3, sneezing: 3, sore_throat: 2, cough: 2, headache: 1, fatigue: 1, fever: 1 },
      about: "A mild viral infection of the nose and throat that usually clears in 7–10 days.",
      care: ["Rest and drink plenty of fluids", "Warm saline gargles for sore throat", "Paracetamol for aches or fever if suitable for you"],
      doctor: "See a doctor if symptoms last over 10 days, or you develop breathlessness or high fever."
    },
    {
      name: "Influenza (Flu)", severity: "moderate",
      symptoms: { fever: 3, body_ache: 3, chills: 2, fatigue: 3, dry_cough: 2, headache: 2, sore_throat: 1, runny_nose: 1 },
      about: "A contagious viral illness with sudden fever and strong body aches, more intense than a cold.",
      care: ["Rest, fluids and light meals", "Isolate to avoid spreading it", "Fever reducers such as paracetamol if suitable"],
      doctor: "Seek care if you have breathing difficulty, symptoms improving then worsening, or you are elderly, pregnant or have a chronic illness."
    },
    {
      name: "COVID-19", severity: "moderate",
      symptoms: { fever: 2, dry_cough: 3, loss_smell: 3, fatigue: 2, body_ache: 2, sore_throat: 1, shortness_breath: 2, headache: 1, diarrhea: 1 },
      about: "A respiratory illness caused by SARS-CoV-2. Loss of smell or taste is a distinctive sign.",
      care: ["Isolate and wear a mask around others", "Rest, hydrate, monitor oxygen if you have an oximeter", "Take a test to confirm"],
      doctor: "Seek urgent care for trouble breathing, persistent chest pressure, confusion or bluish lips."
    },
    {
      name: "Allergic Rhinitis (Hay Fever)", severity: "mild",
      symptoms: { sneezing: 3, itchy_eyes: 3, runny_nose: 3, itching: 1, headache: 1 },
      about: "An allergic reaction to pollen, dust or pets. It does not cause fever.",
      care: ["Avoid known triggers and keep windows closed on dusty days", "Saline nasal rinse", "Antihistamines may help (ask a pharmacist)"],
      doctor: "See a doctor if symptoms disrupt sleep or daily life, or if you also wheeze."
    },
    {
      name: "Gastroenteritis (Stomach Flu / Food Poisoning)", severity: "moderate",
      symptoms: { diarrhea: 3, vomiting: 3, nausea: 3, abdominal_pain: 2, fever: 1, loss_appetite: 1, fatigue: 1 },
      about: "Inflammation of the gut from a virus, bacteria or contaminated food or water.",
      care: ["Sip oral rehydration solution (ORS) often", "Eat bland foods once vomiting settles", "Wash hands and avoid preparing food for others"],
      doctor: "See a doctor for blood in stool, signs of dehydration (very dry mouth, little urine, dizziness), or symptoms beyond 3 days."
    },
    {
      name: "Dengue Fever", severity: "serious",
      symptoms: { high_fever: 3, pain_behind_eyes: 3, joint_pain: 3, body_ache: 2, headache: 2, rash: 2, nausea: 1, vomiting: 1, fatigue: 1 },
      about: "A mosquito-borne viral infection common in tropical and subtropical regions, including South Asia.",
      care: ["Rest and drink lots of fluids", "Use paracetamol only; avoid aspirin and ibuprofen", "Prevent mosquito bites to protect others"],
      doctor: "Get a blood test (NS1 / platelet count) promptly. Go to hospital for severe abdominal pain, persistent vomiting, bleeding gums or black stools."
    },
    {
      name: "Malaria", severity: "serious",
      symptoms: { high_fever: 3, chills: 3, sweating: 3, headache: 2, body_ache: 1, nausea: 1, vomiting: 1, fatigue: 2 },
      about: "A mosquito-borne parasitic infection with cycles of chills, fever and sweating.",
      care: ["Do not self-treat; get tested", "Rest and hydrate while arranging care"],
      doctor: "Needs a blood test and prescription treatment. Seek care the same day if you have fever with chills."
    },
    {
      name: "Typhoid Fever", severity: "serious",
      symptoms: { fever: 3, abdominal_pain: 2, headache: 2, constipation: 2, diarrhea: 1, loss_appetite: 2, fatigue: 2, rash: 1 },
      about: "A bacterial infection (Salmonella Typhi) spread through contaminated food and water, with prolonged rising fever.",
      care: ["Drink only safe, boiled or bottled water", "Maintain fluids and nutrition while seeking care"],
      doctor: "Needs a blood or stool test and antibiotics. See a doctor if fever lasts more than 3 days."
    },
    {
      name: "Migraine", severity: "moderate",
      symptoms: { headache: 3, light_sensitivity: 3, nausea: 2, vomiting: 1, dizziness: 1, blurred_vision: 1 },
      about: "A recurring, often one-sided throbbing headache that may come with nausea and light sensitivity.",
      care: ["Rest in a quiet, dark room", "Hydrate and keep regular sleep and meals", "Track triggers (stress, foods, screens)"],
      doctor: "See a doctor if migraines are frequent, or if a headache is the worst of your life or comes with weakness or speech trouble."
    },
    {
      name: "Type 2 Diabetes (warning signs)", severity: "serious",
      symptoms: { excess_thirst: 3, frequent_urination: 3, blurred_vision: 2, fatigue: 2, weight_loss: 2, itching: 1 },
      about: "These symptoms can point to high blood sugar. Only a blood test can confirm diabetes.",
      care: ["Reduce sugary drinks and refined carbs", "Stay active and keep a healthy weight"],
      doctor: "Book a fasting glucose or HbA1c test soon, especially if you have a family history."
    },
    {
      name: "Urinary Tract Infection (UTI)", severity: "moderate",
      symptoms: { burning_urination: 3, frequent_urination: 3, lower_abdominal_pain: 2, fever: 1, dark_urine: 1, nausea: 1 },
      about: "A bacterial infection of the bladder or urinary tract, more common in women.",
      care: ["Drink plenty of water", "Do not hold urine for long periods"],
      doctor: "Usually needs a urine test and antibiotics. Seek care quickly if you have fever, back pain or vomiting."
    },
    {
      name: "Asthma", severity: "moderate",
      symptoms: { wheezing: 3, shortness_breath: 3, dry_cough: 2, chest_pain: 1 },
      about: "A chronic airway condition causing wheeze, cough and breathlessness, often worse at night or with triggers.",
      care: ["Avoid triggers (smoke, dust, cold air)", "Use your prescribed reliever inhaler if you have one", "Sit upright and breathe slowly"],
      doctor: "See a doctor for diagnosis. Seek emergency help if you cannot speak a full sentence or the inhaler is not helping."
    },
    {
      name: "Pneumonia", severity: "serious",
      symptoms: { high_fever: 2, phlegm: 3, shortness_breath: 3, chest_pain: 2, chills: 2, fatigue: 2, cough: 2 },
      about: "An infection that inflames the air sacs in the lungs. It can be serious, especially for children and older adults.",
      care: ["Do not delay medical review", "Rest and hydrate while arranging care"],
      doctor: "Needs a medical assessment (often a chest X-ray) and possibly antibiotics. Seek urgent care if breathing is difficult."
    },
    {
      name: "Hepatitis (liver inflammation)", severity: "serious",
      symptoms: { yellow_skin: 3, dark_urine: 3, fatigue: 2, nausea: 2, abdominal_pain: 1, loss_appetite: 2, fever: 1 },
      about: "Inflammation of the liver, often viral (A, B, C, E) in this region, shown by jaundice and dark urine.",
      care: ["Avoid alcohol and unnecessary medicines", "Drink safe water and eat clean food"],
      doctor: "See a doctor promptly for liver function tests and viral testing."
    },
    {
      name: "Meningitis (possible)", severity: "emergency",
      symptoms: { fever: 2, severe_headache: 3, neck_stiffness: 3, light_sensitivity: 2, vomiting: 1, rash: 1 },
      about: "Inflammation of the membranes around the brain and spinal cord. It is a medical emergency.",
      care: ["Do not wait. Go to the nearest emergency department"],
      doctor: "Seek emergency care immediately."
    }
  ];

  /* ---------- 3. Red-flag rules ---------- */
  const RED_FLAGS = [
    { test: s => s.has("chest_pain") && s.has("shortness_breath"), msg: "Chest pain with shortness of breath can signal a heart or lung emergency." },
    { test: s => s.has("neck_stiffness") && s.has("fever") && s.has("severe_headache"), msg: "Fever, stiff neck and severe headache together can signal meningitis." },
    { test: s => s.has("chest_pain"), msg: "Chest pain should always be taken seriously." },
    { test: s => s.has("shortness_breath") && s.has("high_fever"), msg: "High fever with breathing trouble needs urgent assessment." },
    { test: s => s.has("severe_headache") && s.has("blurred_vision"), msg: "A sudden severe headache with vision changes needs urgent review." }
  ];

  /* ---------- 4. State & DOM ---------- */
  const selected = new Set();
  const $ = id => document.getElementById(id);
  const listEl = $("symptomList");
  const resultsEl = $("results");

  function renderSymptoms(filter = "") {
    const q = filter.trim().toLowerCase();
    listEl.innerHTML = "";
    const cats = [...new Set(SYMPTOMS.map(s => s.cat))];
    cats.forEach(cat => {
      const items = SYMPTOMS.filter(s => s.cat === cat && s.label.toLowerCase().includes(q));
      if (!items.length) return;
      const h = document.createElement("div");
      h.className = "cat"; h.textContent = cat;
      const wrap = document.createElement("div");
      wrap.className = "chips";
      items.forEach(s => {
        const l = document.createElement("label");
        l.className = "chip";
        const cb = document.createElement("input");
        cb.type = "checkbox"; cb.value = s.id; cb.checked = selected.has(s.id);
        cb.addEventListener("change", () => {
          cb.checked ? selected.add(s.id) : selected.delete(s.id);
          updateCount();
        });
        const sp = document.createElement("span");
        sp.textContent = s.label;
        l.append(cb, sp);
        wrap.appendChild(l);
      });
      listEl.append(h, wrap);
    });
    if (!listEl.children.length) listEl.textContent = "No matching symptoms.";
  }

  function updateCount() {
    $("count").textContent = selected.size + " selected";
  }

  /* ---------- 5. Scoring engine ---------- */
  function analyze() {
    const results = [];
    CONDITIONS.forEach(c => {
      const entries = Object.entries(c.symptoms);
      const total = entries.reduce((a, [, w]) => a + w, 0);
      let matchedW = 0; const matched = [];
      entries.forEach(([id, w]) => { if (selected.has(id)) { matchedW += w; matched.push(id); } });
      if (!matched.length) return;
      const hallmark = matched.some(id => c.symptoms[id] === 3);
      if (matched.length < 2 && !(selected.size === 1 && hallmark)) return;
      // coverage = how much of the condition's picture you have; precision = how much of what you reported it explains
      const coverage = matchedW / total;
      const precision = matched.length / selected.size;
      let score = 0.6 * coverage + 0.4 * precision;
      if (hallmark) score += 0.05;
      score = Math.min(score, 0.95);
      results.push({ c, score, matched });
    });
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 5);
  }

  const band = s => (s >= 0.6 ? ["high", "Strong match"] : s >= 0.4 ? ["moderate", "Possible match"] : ["low", "Weak match"]);
  const labelOf = id => (SYMPTOMS.find(s => s.id === id) || {}).label || id;
  const esc = t => String(t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  /* ---------- 6. Rendering results ---------- */
  function showResults() {
    resultsEl.classList.remove("hidden");
    if (selected.size === 0) {
      resultsEl.innerHTML = "<h2>Results</h2><p>Please select at least one symptom first.</p>";
      return;
    }
    const flags = RED_FLAGS.filter(r => r.test(selected)).map(r => r.msg);
    const results = analyze();
    const age = $("age").value, sex = $("sex").value, dur = $("duration").value;
    const profile = [age && "Age " + age, sex, dur && "Started: " + dur].filter(Boolean).join(" · ");

    let html = "<h2>Possible conditions</h2>";
    if (profile) html += `<p class="tags">${esc(profile)}</p>`;
    if (flags.length) {
      html += `<div class="emergency" role="alert">⚠ Seek urgent medical care. ${flags.map(esc).join(" ")}</div>`;
    }
    if (!results.length) {
      html += "<p>No clear match found from these symptoms. Try adding more symptoms, and see a doctor if you are worried.</p>";
    }
    results.forEach((r, i) => {
      const [cls, txt] = band(r.score);
      const pct = Math.round(r.score * 100);
      html += `
      <article class="result">
        <h3><span>${i + 1}. ${esc(r.c.name)}</span><span class="badge ${cls}">${txt} · ${pct}%</span></h3>
        <div class="meter"><i style="width:${pct}%"></i></div>
        <p>${esc(r.c.about)}</p>
        <p class="tags"><strong>Matched:</strong> ${r.matched.map(m => esc(labelOf(m))).join(", ")}</p>
        <p><strong>Self-care</strong></p>
        <ul>${r.c.care.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <p class="doctor"><strong>When to see a doctor:</strong> ${esc(r.c.doctor)}</p>
      </article>`;
    });
    html += `<div class="bar"><span class="tags">Match % reflects symptom overlap, not probability of disease.</span>
      <button class="btn ghost" id="printBtn" type="button">Print / Save PDF</button></div>`;
    resultsEl.innerHTML = html;
    $("printBtn").addEventListener("click", () => window.print());
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- 7. Events ---------- */
  $("search").addEventListener("input", e => renderSymptoms(e.target.value));
  $("analyzeBtn").addEventListener("click", showResults);
  $("clearBtn").addEventListener("click", () => {
    selected.clear(); $("search").value = "";
    renderSymptoms(); updateCount();
    resultsEl.classList.add("hidden");
  });

  renderSymptoms();
  updateCount();
})();
