const form = document.getElementById('budget-form');
const budgetDisplay = document.getElementById('budget-display');
const entryMessage = document.getElementById('entry-message');
const travelersInput = document.getElementById('travelers');

const activities = [];
const foods = [];

// Buttons
document.getElementById('add-activity-btn')
    .addEventListener('click', function () {
        addEntry('activity');
    });

document.getElementById('add-food-btn')
    .addEventListener('click', function () {
        addEntry('food');
    });

form.addEventListener('submit', function (event) {
    event.preventDefault();
    calculateBudget();
});

travelersInput.addEventListener('input', calculateBudget);

// Add an activity or food place
function addEntry(type) {
    const nameInput = document.getElementById(
        type === 'food' ? 'food-place' : 'activity-name'
    );
    const costInput = document.getElementById(`${type}-cost`);
    const typeInput = document.getElementById(`${type}-cost-type`);

    const name = nameInput.value.trim();
    const cost = Number(costInput.value);

    if (
        name === '' ||
        costInput.value.trim() === '' ||
        !Number.isFinite(cost) ||
        cost < 0
    ) {
        entryMessage.textContent =
            'Enter an activity or food place and a price of 0 or more.';
        return;
    }

    const entry = {
        name: name,
        cost: cost,
        costType: typeInput.value
    };

    if (type === 'activity') {
        activities.push(entry);
    } else {
        foods.push(entry);
    }

    nameInput.value = '';
    costInput.value = '';

    displayEntries();
    calculateBudget();

    entryMessage.textContent = 'Entry added.';
}

// Display both lists
function displayEntries() {
    displayList(activities, 'activities-list', 'activity');
    displayList(foods, 'food-list', 'food');
}

function displayList(entries, listId, type) {
    const list = document.getElementById(listId);
    list.replaceChildren();

    entries.forEach(function (entry, index) {
        const item = document.createElement('li');
        const description = document.createElement('p');

        const costLabel = entry.costType === 'person'
            ? 'per person'
            : 'for the whole group';

        description.textContent =
            `${entry.name} — $${entry.cost.toFixed(2)} ${costLabel}`;

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit';
        editButton.setAttribute('aria-label', `Edit ${entry.name}`);

        editButton.addEventListener('click', function () {
            editEntry(entries, index, type);
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', `Delete ${entry.name}`);

        deleteButton.addEventListener('click', function () {
            entries.splice(index, 1);
            displayEntries();
            calculateBudget();
            entryMessage.textContent = 'Entry deleted.';
        });

        item.append(description, editButton, ' ', deleteButton);
        list.appendChild(item);
    });
}

// Edit an existing entry
function editEntry(entries, index, type) {
    const entry = entries[index];

    const label = type === 'food'
        ? 'Restaurant or location:'
        : 'Activity name:';

    const newName = prompt(label, entry.name);
    if (newName === null) return;

    const priceText = prompt('Price in dollars:', entry.cost);
    if (priceText === null) return;

    const newCostType = prompt(
        'Type person for a per-person price or group for a whole-group price:',
        entry.costType
    );
    if (newCostType === null) return;

    const newCost = Number(priceText);
    const costType = newCostType.trim().toLowerCase();

    if (
        newName.trim() === '' ||
        priceText.trim() === '' ||
        !Number.isFinite(newCost) ||
        newCost < 0 ||
        (costType !== 'person' && costType !== 'group')
    ) {
        entryMessage.textContent =
            'Changes were not saved. Enter a name, a price of 0 or more, and person or group.';
        return;
    }

    entries[index] = {
        name: newName.trim(),
        cost: newCost,
        costType: costType
    };

    displayEntries();
    calculateBudget();
    entryMessage.textContent = 'Entry updated.';
}

// Calculate the group cost of a list
function getGroupTotal(entries, travelers) {
    let total = 0;

    entries.forEach(function (entry) {
        if (entry.costType === 'person') {
            total += entry.cost * travelers;
        } else {
            total += entry.cost;
        }
    });

    return total;
}
document.getElementById('lodging-price')
    .addEventListener('input', calculateBudget);

document.getElementById('lodging-nights')
    .addEventListener('input', calculateBudget); 
// Calculate and display the budget
function calculateBudget() {
    const travelers = Number(travelersInput.value);

    const priceInput = document.getElementById('lodging-price');
    const nightsInput = document.getElementById('lodging-nights');

    const nightlyPrice = Number(priceInput.value);
    const nights = Number(nightsInput.value);

    if (!Number.isInteger(travelers) || travelers < 1) {
        budgetDisplay.textContent =
            'Enter a whole number of at least 1 traveler.';
        return;
    }

    if (
        priceInput.value.trim() === '' ||
        nightsInput.value.trim() === '' ||
        !Number.isFinite(nightlyPrice) ||
        nightlyPrice < 0 ||
        !Number.isInteger(nights) ||
        nights < 0
    ) {
        budgetDisplay.textContent =
            'Enter a nightly price of 0 or more and a whole number of nights of 0 or more.';
        return;
    }

    const activityTotal = getGroupTotal(activities, travelers);
    const foodTotal = getGroupTotal(foods, travelers);
    const lodgingTotal = nightlyPrice * nights;

    const totalCost = activityTotal + foodTotal + lodgingTotal;
    const costPerPerson = totalCost / travelers;

    budgetDisplay.innerHTML = `
        <h3>Estimated Trip Budget</h3>
        <p>Activities for the group: $${activityTotal.toFixed(2)}</p>
        <p>Food for the group: $${foodTotal.toFixed(2)}</p>
        <p>Lodging for ${nights} nights: $${lodgingTotal.toFixed(2)}</p>
        <p><strong>Total group cost: $${totalCost.toFixed(2)}</strong></p>
        <p><strong>Cost per person: $${costPerPerson.toFixed(2)}</strong></p>
        <p>Costs are split equally and rounded to cents.
        Additional booking fees are not included.</p>
    `;
}
document.getElementById('lodging-price')
    .addEventListener('input', calculateBudget);

document.getElementById('lodging-nights')
    .addEventListener('input', calculateBudget);

// Save when the user clicks Save Trip
document.getElementById('save-trip-btn')
    .addEventListener('click', saveTrip);

function saveTrip() {
    const trip = {
        travelers: travelersInput.value,
        activities: activities,
        foods: foods,
        lodgingPrice: document.getElementById('lodging-price').value,
        lodgingNights: document.getElementById('lodging-nights').value,

        // Also save anything typed but not yet added
        activityName: document.getElementById('activity-name').value,
        activityCost: document.getElementById('activity-cost').value,
        activityCostType: document.getElementById('activity-cost-type').value,
        foodPlace: document.getElementById('food-place').value,
        foodCost: document.getElementById('food-cost').value,
        foodCostType: document.getElementById('food-cost-type').value
    };

    try {
        localStorage.setItem('nycBudgetTrip', JSON.stringify(trip));
        entryMessage.textContent = 'Trip saved in this browser!';
    } catch (error) {
        entryMessage.textContent =
            'Your trip could not be saved. Browser storage may be unavailable.';
    }
}

function loadTrip() {
    try {
        const savedTrip = localStorage.getItem('nycBudgetTrip');

        if (!savedTrip) return;

        const trip = JSON.parse(savedTrip);

        if (
            !trip ||
            !Array.isArray(trip.activities) ||
            !Array.isArray(trip.foods)
        ) {
            throw new Error('Invalid saved trip');
        }

        // Check saved entries before displaying them
        const entries = [...trip.activities, ...trip.foods];

        const validEntries = entries.every(function (entry) {
            return (
                entry !== null &&
                typeof entry === 'object' &&
                typeof entry.name === 'string' &&
                Number.isFinite(entry.cost) &&
                entry.cost >= 0 &&
                (entry.costType === 'person' || entry.costType === 'group')
            );
        });

        if (!validEntries) {
            throw new Error('Invalid saved entries');
        }

        travelersInput.value = trip.travelers ?? '1';
        document.getElementById('lodging-price').value =
            trip.lodgingPrice ?? '0';
        document.getElementById('lodging-nights').value =
            trip.lodgingNights ?? '0';

        activities.length = 0;
        foods.length = 0;

        trip.activities.forEach(function (entry) {
            activities.push(entry);
        });

        trip.foods.forEach(function (entry) {
            foods.push(entry);
        });

        document.getElementById('activity-name').value =
            trip.activityName ?? '';
        document.getElementById('activity-cost').value =
            trip.activityCost ?? '';
        document.getElementById('activity-cost-type').value =
            trip.activityCostType ?? 'person';

        document.getElementById('food-place').value =
            trip.foodPlace ?? '';
        document.getElementById('food-cost').value =
            trip.foodCost ?? '';
        document.getElementById('food-cost-type').value =
            trip.foodCostType ?? 'person';

        entryMessage.textContent = 'Your saved trip has been loaded.';
    } catch (error) {
        entryMessage.textContent =
            'Your saved trip could not be loaded.';
    }
}

// Restore the saved trip when the page opens
loadTrip();
displayEntries();
calculateBudget();