# AI Collaboration Log

**Name:** Angelic Furaha  
**Project:** NYC on a Student Budget  
**Dates:** October 11–17, 2026

## Tools Used

I used ChatGPT for planning, explanations, debugging, code suggestions, and styling. I shared my HTML, CSS, and JavaScript so the assistance could build on my existing project. During the October 17 update, ChatGPT also used web research to check official visitor information and automated tools to check parts of the code. ChatGPT helped organize this log from our conversations.

## Significant Conversations

### 1. Planning the App and Choosing Features
**October 11–12, 2026**

I wanted to create a travel guide for college students visiting New York City alone or with friends. I specifically wanted the app to break down how much each traveler would need to contribute.

I shared ideas about discounts, inexpensive food, free activities, expense tracking, and transportation. I asked:

> “how can i include this into the app”

ChatGPT helped separate manageable features from future additions. We focused on a budget calculator, place listings, category filters, and saving trip information. Live prices, automatic discount searches, and route planning were left for later.

I asked for code based on techniques from my previous projects and labs and wanted instructions explaining where each addition belonged.

### 2. Changing Inputs and Debugging
**October 12–14, 2026 — Debugging session**

My early JavaScript closed `calculateBudget()` before the validation and final results. This left code outside the function trying to use variables declared inside it. I asked:

> “I dont want to delete everything tell me what is missing and or wrong”

ChatGPT explained which duplicate calculation to remove, where the closing brace belonged, and why `return` should stop the function after invalid input. It also suggested using `Number()` instead of `parseInt()` so a decimal traveler count could be rejected instead of shortened to a whole number.

Later, I wanted individual food and activity entries with either per-person or whole-group costs. Removing an input caused another problem because JavaScript still referenced it. ChatGPT helped identify outdated references and missing calculation code.

These exchanges showed why changing a form requires checking its JavaScript references and why the location of a closing brace matters.

### 3. Calculating Lodging and Saving Trips
**October 14, 2026**

I asked for:

> “some thing that can calculate the hotel or airbnb for however many nights”

ChatGPT suggested multiplying the whole group’s nightly lodging price by the number of nights, adding food and activities, and dividing the total among travelers.

I also asked:

> “I want it to have option to save what the user inputs for later use”

ChatGPT provided a Save Trip button and functions using `localStorage`. The code saves the traveler count, expense lists, lodging inputs, and unfinished entries.

The saved plan stays in the same browser. It does not sync across devices, and users need to press Save Trip again after making changes.

### 4. Understanding Links and JSON
**October 14, 2026 — Concept-learning exchange**

I asked how resource links could open separately without replacing the app’s page. ChatGPT explained that `target="_blank"` usually opens a new tab and that this change belongs in HTML. The suggested links also included `rel="noopener noreferrer"`.

When I questioned the mention of JSON because I did not have a JSON file, ChatGPT explained the difference between a separate data file and JavaScript’s JSON methods. `JSON.stringify()` converts trip data into text for storage, and `JSON.parse()` converts it back.

The updated app keeps its place listings in an array inside `app.js`, so it does not require a separate JSON file.

### 5. Improving Explore NYC
**October 17, 2026**

I asked ChatGPT to consider the app from a student traveler’s perspective and make the Explore section more useful. I provided my current HTML, JavaScript, and brown-and-tan CSS and requested updates that fit my existing app.

ChatGPT supplied updated files with:

- Nineteen listings: five stays, six food stops, and eight activities.
- Search and category, area, and cost-type filters.
- Official website links, map-search links, and planning tips.
- Buttons that fill the planner with a selected place.
- An optional lodging name and transportation costs per person.
- Responsive layouts, navigation, and clearer instructions.

The selection buttons fill a draft. Users still check the price and press Add Food or Add Activity before that expense enters the total. Paid prices remain user-entered. Map links open searches rather than calculating daily routes.

ChatGPT preserved the existing expense lists, editing, deletion, and saving functions and removed duplicate lodging event listeners. After receiving downloadable files, I asked for all three files directly in the conversation so I could copy and paste them into my current folder.

## Learning Moments and Challenges

The main challenge was keeping the HTML and JavaScript consistent as the app changed. The explanations covered:

- Matching HTML IDs with JavaScript references.
- Keeping variables and related calculations inside the correct function.
- Using arrays to store multiple expenses and place listings.
- Multiplying per-person expenses by traveler count while counting group expenses once.
- Using filters and DOM methods to display matching places.
- Saving data with `localStorage` and JSON methods.

I chose the audience, destination, group-cost feature, and brown-and-tan design. I also requested more useful Explore listings and preferred explanations tied to my existing code.

## How My Prompting Evolved

My first prompts described a broad idea. Later, I specified inputs, calculations, saving behavior, and problems with particular buttons.

Sharing my actual code made the assistance more specific. I also asked for targeted corrections instead of replacing everything. For the final Explore update, I described the intended user and supplied all three files so the changes could work together.

## Testing and Reviewing the Code

For the October 17 update, ChatGPT reported successful JavaScript syntax and DOM-level checks covering filters, planner selections, calculations, saving and loading, older saved trips, deletion, invalid traveler counts, and corrupted saved data.

One calculation checked four travelers with $25 each for food and $80 total lodging. The expected result was $180 for the group and $45 per person. Adding $10 transportation per person raised those amounts to $220 and $55.

Full visual browser testing was unavailable. These automated checks were performed by ChatGPT, not by me. At the time of this log, I had not reported final browser testing after copying the updated files.

ChatGPT supplied substantial code, and I am responsible for reviewing it, testing the app myself, and being able to explain the code I submit. This log documents the assistance received without claiming that every suggested feature or explanation has been independently verified by me.