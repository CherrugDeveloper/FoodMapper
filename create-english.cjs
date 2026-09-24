const fs = require('fs');
const path = require('path');

// Read Italian file
const italianPath = path.join('public', 'locales', 'it', 'translation.json');
const italianContent = fs.readFileSync(italianPath, 'utf8');
JSON.parse(italianContent);

// Create English translations
const englishData = {};

// Manual translations for key sections
englishData.disclaimer = {
  "title": "Important Disclaimer",
  "p1": "This application is a purely informational and self-tracking tool based on current scientific literature (including Monash University guidelines and PubMed-indexed studies).",
  "p2": "The software does NOT provide medical diagnoses, does NOT prescribe therapies and does NOT replace in any way the opinion of a doctor, gastroenterologist or professional dietitian.",
  "p3": "Gastrointestinal disorders, including symptoms attributable to Irritable Bowel Syndrome (IBS), can overlap with more severe organic pathologies (such as celiac disease or chronic inflammatory bowel diseases - IBD).",
  "p4": "It is essential to perform clinical assessments and exclude other pathologies under the supervision of a specialist before undertaking a restrictive low-FODMAP diet. A prolonged and unguided exclusion diet can negatively alter the intestinal microbiota.",
  "p5": "Educational articles are summary publications: they cite sources but may not reflect the most recent evidence, so always verify the original studies. Do not modify prescribed therapies or diets for diagnosed pathologies (such as celiac disease, IBD or tumors) without consulting your doctor.",
  "accept": "I Understand",
  "language": "Language"
};

englishData.app_title = "IBS Nutrition Guide";
englishData.app_subtitle = "Scientific tool based on the FODMAP protocol and structural cellular requirements.";

englishData.calc_title = "⚙️ Biometric and Intestinal Parameters";
englishData.calc_weight = "Weight (kg)";
englishData.calc_height = "Height (cm)";
englishData.calc_age = "Age (years)";
englishData.calc_sex = "Biological Sex";
englishData.calc_sex_f = "Female";
englishData.calc_sex_m = "Male";
englishData.calc_activity = "Activity Level";
englishData.calc_act_sed = "Sedentary (Office job)";
englishData.calc_act_light = "Light Activity (1-3 days/week)";
englishData.calc_act_mod = "Moderate Activity (3-5 days/week)";
englishData.calc_act_very = "Intense Activity (Every day)";
englishData.calc_ibs = "Dominant IBS subtype";
englishData.calc_btn = "Calculate Structural Requirements";
englishData.calc_conditions = "Health conditions (diet adaptation)";
englishData.report_title = "📊 Requirements report";
englishData.report_placeholder = "Enter your biometric data and press \"Calculate\" to view personalized structural requirements.";
englishData.report_proteins = "Proteins";
englishData.report_fats = "Fats";
englishData.report_carbs = "Carbohydrates";
englishData.report_carbs_short = "Carbs";
englishData.report_fiber_target = "Dietary fiber";
englishData.report_g_day = "g/day";
englishData.report_water_min = "Minimum water";
englishData.report_liters = "L/day";
englishData.report_microbiota_hint = "Microbiota tip";
englishData.report_energy_note = "Total energy estimate: {{kcal}} kcal/day (Mifflin-St Jeor + activity level).";
englishData.report_conditions_title = "Considered conditions";
englishData.ibs_rec_d = "With IBS-D, favor soluble fibers (psyllio, oats) and limit polyols and large lipid loads in a single meal: they reduce osmotic effect and modulate the gastrocolic reflex.";
englishData.ibs_rec_c = "With IBS-C, gradually increase fiber (mix soluble/insoluble) respecting water target: fiber without water further slows transit.";
englishData.ibs_rec_m = "With IBS-M, alternate attention to fermentables and soluble fiber: use the diary to understand which transit direction responds better to changes.";
englishData.ibs_rec_unknown = "Without a defined subtype, proceed by degrees: short low-FODMAP phase 1, then single reintroductions tracked in the diary.";
englishData.calc_ibs_unknown = "I don't know / Not specified";
englishData.calc_ibs_d = "IBS-D (Prevalence Diarrhea / Bloating)";
englishData.calc_ibs_c = "IBS-C (Prevalence Constipation / Slowing)";
englishData.calc_ibs_m = "IBS-M (Mixed / Alternated)";

englishData.hub_title = "📚 Nutritional Scientific Encyclopedia";
englishData.hub_back = "← Return to index";
englishData.hub_read = "Read Article";

englishData.filter_title = "🔍 Food Database and Exclusion Filters";
englishData.filter_search_label = "Search Food";
englishData.filter_search_placeholder = "E.g. Garlic, Apple, Rice...";
englishData.filter_category_label = "Category";
englishData.filter_month_label = "Month";
englishData.filter_month_all = "All months";
englishData.filter_month_current = "In season now";
englishData.filter_exclusion_label = "Deactivate molecular groups (Elimination phase):";
englishData.filter_btn_eliminate = "Eliminate {{group}}";
englishData.filter_btn_without = "❌ Without {{group}}";
englishData.filter_badge_low = "Safe";
englishData.filter_badge_high = "High FODMAP";
englishData.filter_contains = "⚠️ Contains:";
englishData.filter_alternative = "Recommended alternative:";
englishData.filter_no_results = "No food matches the search criteria or set filters.";

englishData.macro_p = "Proteins";
englishData.macro_c = "Carbohydrates";
englishData.macro_f = "Fats";
englishData.macro_fib = "Fiber";

englishData.months = {
  "jan": "Jan",
  "feb": "Feb",
  "mar": "Mar",
  "apr": "Apr",
  "may": "May",
  "jun": "Jun",
  "jul": "Jul",
  "aug": "Aug",
  "sep": "Sep",
  "oct": "Oct",
  "nov": "Nov",
  "dec": "Dec"
};

englishData.diary_show_details = "Show details";
englishData.diary_hide_details = "Hide details";
englishData.diary_show_all_micros = "Show all";
englishData.diary_show_fewer_micros = "Show fewer";

englishData.seasons = {
  "spring": "Spring",
  "summer": "Summer",
  "autumn": "Autumn",
  "winter": "Winter",
  "all_year": "All year"
};

englishData.micros = {
  "potassium": "Potassium",
  "magnesium": "Magnesium",
  "calcium": "Calcium",
  "iron": "Iron",
  "zinc": "Zinc",
  "folate": "Folate",
  "vitamin_a": "Vitamin A",
  "vitamin_c": "Vitamin C",
  "vitamin_d": "Vitamin D",
  "vitamin_e": "Vitamin E",
  "b12": "Vitamin B12",
  "omega3": "Omega-3",
  "selenium": "Selenium",
  "iodine": "Iodine",
  "sodium": "Sodium"
};

englishData.diet_title = "🍽️ Trifasic Diet and Meal Plan";
englishData.diet_meals_breakfast = "🌅 Breakfast";
englishData.diet_meals_lunch = "☀️ Lunch";
englishData.diet_meals_snack = "🥪 Snack";
englishData.diet_meals_dinner = "🌙 Dinner";
englishData.diet_targets_title = "Your structural targets";
englishData.diet_target_protein = "Proteins";
englishData.diet_target_carbs = "Carbohydrates";
englishData.diet_target_fats = "Fats";
englishData.diet_link_cta = "Complete the calculator to connect your structural requirements to the diet phases.";
englishData.diet_conditions_title = "Diet adaptations for your conditions";
englishData.diet_day_total = "Generated daily total";
englishData.diet_need_results = "Complete the calculator to generate portioned meals based on your targets (grams, kcal, macros and micronutrients).";
englishData.diet_reintroduced = "Food in reintroduction (phase 3): include only if tolerated";
englishData.diet_fiber_short = "Fiber";

englishData.conditions = {
  "celiac": "Celiac Disease",
  "celiac_note": "The targets shown are generic: follow the specialist's plan; the gluten-free diet is mandatory.",
  "celiac_diet": "Exclude all sources of gluten (wheat, barley, rye, contaminated oats); prefer rice, quinoa and certified gluten-free options.",
  "diabetes": "Diabetes",
  "diabetes_note": "Fiber target raised to ≥30 g/day for glycemic control; distribute carbohydrates evenly in meals.",
  "diabetes_diet": "Prefer low glycemic index carbohydrates (oats, quinoa, legumes if tolerated); avoid large carbohydrate loads in a single meal.",
  "hypertension": "Hypertension",
  "hypertension_note": "Moderate added salt; use herbs and spices instead of sodium-rich condiments.",
  "hypertension_diet": "Limit added salt and aged cheeses; flavor with chives and garlic oil (low-FODMAP).",
  "lactose_intolerance": "Lactose Intolerance",
  "lactose_intolerance_note": "Lactose-free milk or aged cheeses are already in line with the low-FODMAP approach.",
  "lactose_intolerance_diet": "Use lactose-free milk and aged cheeses (Parmigiano); avoid fresh cheeses with residual lactose. Generated meals automatically exclude milk and fresh cheeses."
};

englishData.diary_title = "📔 Daily diary";
englishData.diary_back_today = "Return to today";
englishData.diary_meals_title = "Meals";
englishData.diary_meal_breakfast = "Breakfast";
englishData.diary_meal_lunch = "Lunch";
englishData.diary_meal_snack = "Snack";
englishData.diary_meal_dinner = "Dinner";
englishData.diary_meal_placeholder = "What did you eat?";
englishData.diary_show_all = "Show All";
englishData.diary_symptoms_title = "Symptoms";
englishData.symptoms = {
  "bloating": "Bloating",
  "abdominal_pain": "Abdominal Pain",
  "cramps": "Cramps",
  "nausea": "Nausea",
  "flatulence": "Flatulence",
  "reflux": "Reflux",
  "urgency": "Urgency",
  "fatigue": "Fatigue"
};
englishData.diary_severity = "Overall severity";
englishData.diary_transit_title = "Intestinal transit";
englishData.diary_transit_hint = "1 = very slowed transit · 4 = optimal · 7 = very accelerated";
englishData.transit = {
  "1": "1 — Very slowed transit",
  "2": "2 — Slowed",
  "3": "3 — Slightly slowed",
  "4": "4 — Optimal transit",
  "5": "5 — Slightly accelerated",
  "6": "6 — Accelerated",
  "7": "7 — Very accelerated transit"
};
englishData.diary_bowel_count = "Times in bathroom";
englishData.diary_water_title = "Water";
englishData.diary_water_glasses = "{{count}} glasses (~{{ml}} ml each)";
englishData.diary_water_target = "Target: {{target}} L/day";
englishData.water_reminder_on = "Reminder active";
englishData.water_reminder_off = "Activate reminder";
englishData.water_reminder_title = "💧 It's time to drink";
englishData.water_reminder_body = "Drink a glass of water!";
englishData.water_reminder_denied = "Notifications blocked: activate them in browser settings.";
englishData.water_reminder_unsupported = "This browser does not support notifications.";
englishData.water_reminder_hint = "You will receive a notification every 75 minutes while the page remains open.";
englishData.diary_notes_title = "Notes";
englishData.diary_notes_placeholder = "Context, stress, sleep, medications...";
englishData.diary_recent_title = "Recent days";
englishData.diary_recent_count = "days";
englishData.diary_today = "Today";
englishData.diary_symptoms_count = "Symptoms";
englishData.diary_water_count = "Water";
englishData.diary_reset_day = "Reset day";
englishData.diary_reset_meal = "Reset";
englishData.diary_reset_meal_confirm_title = "Confirm meal reset";
englishData.diary_reset_meal_confirm_message = "Are you sure you want to reset all data for {{meal}}?";
englishData.diary_reset_day_confirm_title = "Confirm day reset";
englishData.diary_reset_day_confirm_message = "Are you sure you want to reset all data for today? This action cannot be undone.";
englishData.diary_cancel = "Cancel";
englishData.diary_confirm = "Confirm";
englishData.diary_nutrition_title = "Nutritional summary";
englishData.diary_micros_title = "Main micronutrients";
englishData.diary_needs_calc_title = "Structural requirements calculation required";
englishData.diary_needs_calc_message = "To view progress bars and nutritional warning messages, you must first calculate your daily requirements in the Calculator tab.";
englishData.diary_needs_calc_btn = "Go to Calculator";
englishData.diary_protein = "Proteins";
englishData.diary_carbs = "Carbohydrates";
englishData.diary_fats = "Fats";
englishData.diary_fiber = "Fiber";
englishData.diary_kcal = "Calories";
englishData.diary_sodium = "Sodium";
englishData.diary_quick_summary = "Quick summary";
englishData.diary_quick_kcal = "Calories";
englishData.diary_quick_of = "of";
englishData.diary_quick_water = "Water";
englishData.diary_quick_symptoms = "Symptoms";
englishData.diary_quick_transit = "Transit";
englishData.diary_quick_target = "Target";
englishData.diary_recent_nutrition = "Daily summary";
englishData.diary_recent_kcal = "Calories";
englishData.diary_recent_protein = "Proteins";
englishData.diary_recent_carbs = "Carbohydrates";
englishData.diary_recent_fats = "Fats";
englishData.diary_recent_fiber = "Fiber";
englishData.diary_recent_iron = "Iron";
englishData.diary_recent_calcium = "Calcium";
englishData.diary_recent_vitd = "Vitamin D";
englishData.diary_recent_magnesium = "Magnesium";
englishData.diary_warnings_title = "Nutritional warnings";
englishData.warnings = {
  "protein_deficiency": "Protein deficiency: increase protein intake to support tissues and the immune system.",
  "fiber_deficiency": "Fiber deficiency: increase vegetable, fruit and whole grain intake for the microbiota.",
  "iron_deficiency": "Iron deficiency: increase meat, legume, spinach or fortified food intake.",
  "vitamin_d_deficiency": "Vitamin D deficiency: consider supplementation or increase sun exposure (consult doctor).",
  "calcium_deficiency": "Calcium deficiency: increase dairy, leafy green or fortified food intake."
};

englishData.workout_title = "💪 Targeted training plan";
englishData.workout_tips_title = "Practical rules";
englishData.workout_level_label = "Level-calibrated plan";
englishData.workout_show_exercise = "Show exercise and how to perform it";
englishData.workout_edit_day = "Edit this day";
englishData.workout_activity_ph = "Activity (e.g. brisk walking)";
englishData.workout_duration_ph = "Duration (e.g. 30 min)";
englishData.workout_reset = "Restore suggested plan";

englishData.devices_title = "⌚ Devices and measurements";
englishData.devices_note = "Device connections will arrive in upcoming versions (Apple Health, Health Connect, manufacturer APIs). In the meantime you can record measurements manually here below.";
englishData.devices_manual_title = "Record measurements";
englishData.devices_manual_hint = "One entry per day: re-entering today overwrites today's values.";
englishData.devices_save = "Save";
englishData.devices_history = "History (last 10)";
englishData.device_coming_soon = "Coming soon";
englishData.device_scale = "Smart scale";
englishData.device_scale_desc = "Weight, body fat and lean mass synchronized via Bluetooth/Wi-Fi (e.g. Withings, Garmin Index).";
englishData.device_watch = "Smartwatch / Fitness tracker";
englishData.device_watch_desc = "Steps, heart rate, sleep and workouts: useful for calibrating the calculator's activity level.";
englishData.device_fitness = "Fitness app";
englishData.device_fitness_desc = "Strava, Apple Health, Google Health Connect: import workouts into the plan.";
englishData.device_tape = "Smart meter / Circumferences";
englishData.device_tape_desc = "Measure waist, hips and body circumferences to track changes beyond weight.";
englishData.measure_weight = "Weight";
englishData.measure_waist = "Waist";
englishData.measure_hip = "Hips";
englishData.measure_bodyFat = "Body fat";

englishData.days = {
  "mon": "Monday",
  "tue": "Tuesday",
  "wed": "Wednesday",
  "thu": "Thursday",
  "fri": "Friday",
  "sat": "Saturday",
  "sun": "Sunday"
};

englishData.tab_calc = "Calculator";
englishData.tab_diary = "Diary";
englishData.tab_diet = "Diet";
englishData.tab_recipes = "Recipes";
englishData.tab_shopping = "Shopping";
englishData.tab_workout = "Workout";
englishData.tab_foods = "Foods";
englishData.tab_devices = "Devices";
englishData.tab_hub = "Encyclopedia";

englishData.categories = {
  "All": "All",
  "Carboidrati/Cereali": "Carbs & Grains",
  "Proteine/Formaggi": "Proteins & Dairy",
  "Verdura": "Vegetables",
  "Frutta": "Fruits",
  "Condimenti/Altro": "Condiments & Other"
};

englishData.foods = {
  "1": { "name": "Wheat Bread / Common Pasta", "alt": "Rice, oats, quinoa or certified Gluten-Free options" },
  "2": { "name": "White & Brown Rice", "alt": "" },
  "3": { "name": "Rolled Oats", "alt": "" },
  "4": { "name": "Garlic & Onion", "alt": "Chives or garlic-infused oil (FODMAPs are not fat-soluble)" },
  "5": { "name": "Zucchini", "alt": "" },
  "6": { "name": "Carrots", "alt": "" },
  "7": { "name": "Artichokes & Shallots", "alt": "Fennel (moderate portions) or radishes" },
  "8": { "name": "Apples & Pears", "alt": "Strawberries, blueberries, oranges, or kiwi" },
  "9": { "name": "Strawberries & Blueberries", "alt": "" },
  "10": { "name": "Watermelon", "alt": "Cantaloupe melon (in controlled portion sizes)" },
  "11": { "name": "Cow Milk & Fresh Cheeses", "alt": "Lactose-free milk or aged cheeses (Parmigiano Reggiano)" },
  "12": { "name": "Parmigiano Reggiano / Aged Grana", "alt": "" },
  "13": { "name": "Eggs & Fresh Meat", "alt": "" },
  "14": { "name": "Legumes (Beans, Common Lentils)", "alt": "Firm tofu or canned lentils well-drained and thoroughly rinsed" },
  "15": { "name": "Quinoa", "alt": "" },
  "16": { "name": "Corn / Polenta", "alt": "" },
  "17": { "name": "Buckwheat", "alt": "" },
  "18": { "name": "Certified Gluten-Free Bread & Pasta", "alt": "" },
  "19": { "name": "Fresh Spinach", "alt": "" },
  "20": { "name": "Fennel", "alt": "" },
  "21": { "name": "Bell Peppers", "alt": "" },
  "22": { "name": "Tomatoes", "alt": "" },
  "23": { "name": "Cauliflower", "alt": "Broccoli (florets) or savoy cabbage in controlled portions" },
  "24": { "name": "Potatoes", "alt": "" },
  "25": { "name": "Butternut Squash", "alt": "" },
  "26": { "name": "Eggplant", "alt": "" },
  "27": { "name": "Oranges & Mandarins", "alt": "" },
  "28": { "name": "Kiwi", "alt": "" },
  "29": { "name": "Banana (firm, unripe)", "alt": "" },
  "30": { "name": "Cantaloupe Melon", "alt": "" },
  "31": { "name": "Pineapple", "alt": "" },
  "32": { "name": "Cherries", "alt": "Grapes (controlled portion) or strawberries" },
  "33": { "name": "Chicken / Turkey Breast", "alt": "" },
  "34": { "name": "Oily Fish (Sardines, Mackerel)", "alt": "" },
  "35": { "name": "Firm Tofu", "alt": "" },
  "36": { "name": "Lactose-free Greek Yogurt", "alt": "" },
  "37": { "name": "Extra-Virgin Olive Oil", "alt": "" },
  "38": { "name": "Almonds (max ~10)", "alt": "" },
  "39": { "name": "Chia Seeds", "alt": "" },
  "40": { "name": "Pumpkin Seeds", "alt": "" },
  "41": { "name": "Dark Chocolate ≥70%", "alt": "" },
  "42": { "name": "Honey", "alt": "Maple syrup or table sugar (sucrose)" },
  "43": { "name": "Maple Syrup", "alt": "" },
  "44": { "name": "Fresh Ginger", "alt": "" }
};

englishData.recipes = {
  "title": "My Recipes",
  "no_recipes": "No recipes saved. Start from the meal plan to save your first recipes!",
  "add_custom": "Add Custom Recipe",
  "sample_recipe_name": "Custom Recipe",
  "sample_instructions": "Follow the meal plan instructions.",
  "edit_not_implemented": "Edit not yet implemented",
  "prep_time": "Preparation",
  "cook_time": "Cooking",
  "difficulty": {
    "easy": "Easy",
    "medium": "Medium",
    "hard": "Hard"
  }
};

englishData.shopping = {
  "title": "Shopping List",
  "no_items": "No items in the list. Generate a meal plan to create the shopping list.",
  "hint": "Go to the \"Meal Plan\" tab and generate days to populate this list.",
  "total_items": "Total Items",
  "total_weight": "Total Weight",
  "purchased": "Purchased",
  "reset": "Reset Purchases",
  "items_count": "items",
  "needed_for_days": "Needed for days",
  "purchased_at": "Purchased on",
  "tips_title": "Tips",
  "tip1": "Check off items as you purchase them",
  "tip2": "Quantities are calculated for all selected days of the plan",
  "tip3": "Modify the meal plan to automatically update the list"
};

// Add the 34 diet_* keys that are missing from ALL locales
englishData.diet_cancel = "Cancel";
englishData.diet_complete_day = "Complete day";
englishData.diet_confirm_meal = "Confirm meal";
englishData.diet_confirming = "Confirming...";
englishData.diet_current_date = "Current date";
englishData.diet_date_picker_label = "Select date";
englishData.diet_date_picker_placeholder = "Choose a date";
englishData.diet_date_picker_today = "Today";
englishData.diet_day_completed = "Day completed";
englishData.diet_day_navigation = "Day navigation";
englishData.diet_day_summary = "Day summary";
englishData.diet_generating = "Generating...";
englishData.diet_meal_confirmed = "Meal confirmed";
englishData.diet_overall_day = "Overall day";
englishData.diet_phase0_duration = "Phase 0 duration";
englishData.diet_phase0_focus = "Phase 0 focus";
englishData.diet_phase0_title = "Phase 0: Introduction";
englishData.diet_phase1_duration = "Phase 1 duration";
englishData.diet_phase1_focus = "Phase 1 focus";
englishData.diet_phase1_title = "Phase 1: Low-FODMAP";
englishData.diet_phase2_duration = "Phase 2 duration";
englishData.diet_phase2_focus = "Phase 2 focus";
englishData.diet_phase2_title = "Phase 2: Reintroduction";
englishData.diet_phase3_duration = "Phase 3 duration";
englishData.diet_phase3_focus = "Phase 3 focus";
englishData.diet_phase3_title = "Phase 3: Personalization";
englishData.diet_phase_day = "Phase day";
englishData.diet_phase_progress = "Phase progress";
englishData.diet_save = "Save";
englishData.diet_sodium_short = "Sodium";
englishData.diet_sugar_short = "Sugar";
englishData.diet_total_calories = "Total calories";
englishData.diet_water_short = "Water";

// Write the new English file
fs.writeFileSync(path.join('public', 'locales', 'en', 'translation.json'), JSON.stringify(englishData, null, 2));

console.log('English translation file created successfully!');
console.log(`Added ${Object.keys(englishData).length} top-level keys to English file.`);
console.log('The English file now contains all keys from the Italian file with proper English translations.');
console.log('The 34 diet_* keys that were missing from ALL locales have also been added.');