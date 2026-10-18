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

document.getElementById('lodging-price')
    .addEventListener('input', calculateBudget);

document.getElementById('lodging-nights')
    .addEventListener('input', calculateBudget);

document.getElementById('transport-cost')
    .addEventListener('input', calculateBudget);

document.getElementById('save-trip-btn')
    .addEventListener('click', saveTrip);

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

    const transportInput = document.getElementById('transport-cost');
    const transportCost = Number(transportInput.value);

    if (
        transportInput.value.trim() === '' ||
        !Number.isFinite(transportCost) ||
        transportCost < 0
    ) {
        budgetDisplay.textContent =
            'Enter transportation and other costs of 0 or more.';
        return;
    }

    const transportTotal = transportCost * travelers;

    const totalCost =
        activityTotal + foodTotal + lodgingTotal + transportTotal;

    if (!Number.isFinite(totalCost)) {
        budgetDisplay.textContent =
            'These costs are too large. Check your entries.';
        return;
    }

    const costPerPerson = totalCost / travelers;

    budgetDisplay.innerHTML = `
        <h3>Estimated Trip Budget</h3>
        <p>Activities for the group: $${activityTotal.toFixed(2)}</p>
        <p>Food for the group: $${foodTotal.toFixed(2)}</p>
        <p>Lodging for ${nights} nights: $${lodgingTotal.toFixed(2)}</p>
        <p>
            Transportation and other costs for the group:
            $${transportTotal.toFixed(2)}
        </p>
        <p>
            <strong>Total group cost: $${totalCost.toFixed(2)}</strong>
        </p>
        <p>
            <strong>Cost per person: $${costPerPerson.toFixed(2)}</strong>
        </p>
        <p>
            Costs are split equally and rounded to cents.
            Only entered costs are included.
            Add taxes, tips, and booking fees to your estimates.
        </p>
    `;
}

// Save the trip in this browser
function saveTrip() {
    const trip = {
        travelers: travelersInput.value,
        lodgingName: document.getElementById('lodging-name').value,
        transportCost: document.getElementById('transport-cost').value,
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

// Load a previously saved trip
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

        document.getElementById('lodging-name').value =
            trip.lodgingName ?? '';

        document.getElementById('transport-cost').value =
            trip.transportCost ?? '0';

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

document.getElementById('current-year').textContent =
    new Date().getFullYear();

// Place listings
const places = [
    {
        name: "Pod Times Square",
        category: "stay",
        area: "Midtown",
        priceType: "quote",
        description: "A compact hotel option near the Theater District.",
        tip: "Compare all rooms needed for your group, not just the first room rate.",
        url: "https://www.thepodhotel.com/hotels",
        mapQuery: "Pod Times Square New York City"
    },
    {
        name: "Pod 51",
        category: "stay",
        area: "Midtown",
        priceType: "quote",
        description: "A Midtown hotel option for comparing a central base.",
        tip: "Check the exact room type and whether its bathroom is private or shared.",
        url: "https://www.thepodhotel.com/hotels",
        mapQuery: "Pod 51 New York City"
    },
    {
        name: "Pod 39",
        category: "stay",
        area: "Midtown",
        priceType: "quote",
        description: "A hotel near Grand Central for a Midtown-based trip.",
        tip: "Check room occupancy before splitting a quote among friends.",
        url: "https://www.thepodhotel.com/hotels",
        mapQuery: "Pod 39 New York City"
    },
    {
        name: "Pod Brooklyn",
        category: "stay",
        area: "Brooklyn",
        priceType: "quote",
        description: "A Williamsburg hotel option to compare with Manhattan stays.",
        tip: "Compare the full lodging quote plus travel to your planned activities.",
        url: "https://www.thepodhotel.com/hotels",
        mapQuery: "Pod Brooklyn New York City"
    },
    {
        name: "HI New York City Hostel",
        category: "stay",
        area: "Uptown",
        priceType: "quote",
        description: "A hostel option on Amsterdam Avenue for comparing shared accommodation.",
        tip: "Check whether the quote is per bed; confirm age rules and whether friends can share a room.",
        url: "https://www.hiusa.org/find-hostels/new-york/new-york-891-amsterdam-ave",
        mapQuery: "HI New York City Hostel New York City"
    },
    {
        name: "Los Tacos No. 1",
        category: "eat",
        area: "Multiple locations",
        priceType: "check",
        description: "A taco option with several NYC locations.",
        tip: "Choose the branch closest to your plans and budget for your full order.",
        url: "https://www.lostacos1.com/locations/",
        mapQuery: "Los Tacos No. 1 New York City"
    },
    {
        name: "Xi’an Famous Foods",
        category: "eat",
        area: "Multiple locations",
        priceType: "check",
        description: "Noodle and other Xi’an-style dishes at multiple locations.",
        tip: "Compare the menu for your chosen branch; ask about spice levels and ingredients.",
        url: "https://www.xianfoods.com/locations",
        mapQuery: "Xi’an Famous Foods New York City"
    },
    {
        name: "Ess-a-Bagel",
        category: "eat",
        area: "Midtown",
        priceType: "check",
        description: "Bagels and sandwiches for a breakfast or lunch stop.",
        tip: "Check the cost of fillings and drinks as well as the bagel itself.",
        url: "https://www.ess-a-bagel.com/",
        mapQuery: "Ess-a-Bagel New York City"
    },
    {
        name: "Joe’s Pizza",
        category: "eat",
        area: "Multiple locations",
        priceType: "check",
        description: "A pizza stop to consider between activities.",
        tip: "Check the branch and menu; enter the cost of your planned order.",
        url: "https://www.joespizzanyc.com/",
        mapQuery: "Joe’s Pizza New York City"
    },
    {
        name: "Mamoun’s Falafel",
        category: "eat",
        area: "Downtown",
        priceType: "check",
        description: "Falafel and Middle Eastern food, including a Greenwich Village location.",
        tip: "Compare sandwich and platter options. Confirm dietary needs with staff.",
        url: "https://www.mamouns.com/",
        mapQuery: "Mamoun's Falafel Greenwich Village New York"
    },
    {
        name: "Chelsea Market",
        category: "eat",
        area: "Chelsea",
        priceType: "check",
        description: "A food market with different vendors for a group to browse.",
        tip: "Set a food allowance before browsing; each vendor has its own prices.",
        url: "https://www.chelseamarket.com/",
        mapQuery: "Chelsea Market New York City"
    },
    {
        name: "Staten Island Ferry",
        category: "do",
        area: "Downtown",
        priceType: "free",
        description: "A free ferry ride between Lower Manhattan and Staten Island.",
        tip: "Check the official schedule and leave time for the return trip.",
        url: "https://www.nyc.gov/html/dot/html/ferrybus/staten-island-ferry.shtml",
        mapQuery: "Whitehall Terminal Staten Island Ferry New York"
    },
    {
        name: "Brooklyn Bridge Park",
        category: "do",
        area: "Brooklyn",
        priceType: "free",
        description: "A waterfront park for a walk, skyline views, and time outdoors.",
        tip: "Basic park entry is free; food, rentals, and some activities cost extra.",
        url: "https://brooklynbridgepark.org/",
        mapQuery: "Brooklyn Bridge Park New York City"
    },
    {
        name: "Central Park",
        category: "do",
        area: "Uptown",
        priceType: "free",
        description: "Walk, take photos, or plan a picnic in the park.",
        tip: "A self-guided park visit avoids tour costs; attractions and rentals may charge separately.",
        url: "https://www.centralparknyc.org/visit",
        mapQuery: "Central Park New York City"
    },
    {
        name: "Bryant Park",
        category: "do",
        area: "Midtown",
        priceType: "free",
        description: "A Midtown outdoor stop for a break between activities.",
        tip: "Browse the event calendar; rentals, food, and some activities cost extra.",
        url: "https://bryantpark.org/",
        mapQuery: "Bryant Park New York City"
    },
    {
        name: "Grand Central Terminal",
        category: "do",
        area: "Midtown",
        priceType: "free",
        description: "Explore the public concourse and its architecture.",
        tip: "A look around the concourse is different from a paid tour or train ride.",
        url: "https://grandcentralterminal.com/",
        mapQuery: "Grand Central Terminal New York City"
    },
    {
        name: "The Met Fifth Avenue",
        category: "do",
        area: "Uptown",
        priceType: "check",
        description: "Art collections for an indoor museum day.",
        tip: "Check student admission. Pay-what-you-wish eligibility is limited to NY residents and NY, NJ, or CT students; it is not for every college student.",
        url: "https://www.metmuseum.org/plan-your-visit",
        mapQuery: "The Met Fifth Avenue New York City"
    },
    {
        name: "Museum of Modern Art (MoMA)",
        category: "do",
        area: "Midtown",
        priceType: "check",
        description: "Modern and contemporary art for an indoor outing.",
        tip: "Check current ticket categories and eligibility before relying on a discount.",
        url: "https://www.moma.org/visit/",
        mapQuery: "Museum of Modern Art (MoMA) New York City"
    },
    {
        name: "Tenement Museum",
        category: "do",
        area: "Downtown",
        priceType: "check",
        description: "Tours exploring immigration and neighborhood history.",
        tip: "Choose a tour and check ticket availability before arranging the rest of your day.",
        url: "https://www.tenement.org/",
        mapQuery: "Tenement Museum New York City"
    }
];

// Explore controls
const placeSearch = document.getElementById('place-search');
const categoryFilter = document.getElementById('category-filter');
const areaFilter = document.getElementById('area-filter');
const priceFilter = document.getElementById('price-filter');
const placesDisplay = document.getElementById('places-display');

const categoryLabels = {
    stay: 'Stay',
    eat: 'Eat',
    do: 'Do'
};

const priceLabels = {
    free: 'Free basic admission / ride',
    check: 'Check current menu / ticket price',
    quote: 'Quote needed for your dates and group'
};

// Build the area dropdown from the places array
const areas = [];

places.forEach(function (place) {
    if (!areas.includes(place.area)) {
        areas.push(place.area);
    }
});

areas.sort().forEach(function (area) {
    const option = document.createElement('option');
    option.value = area;
    option.textContent = area;
    areaFilter.appendChild(option);
});

// Update the listings when a filter changes
placeSearch.addEventListener('input', displayPlaces);
categoryFilter.addEventListener('change', displayPlaces);
areaFilter.addEventListener('change', displayPlaces);
priceFilter.addEventListener('change', displayPlaces);

document.getElementById('reset-filters')
    .addEventListener('click', function () {
        placeSearch.value = '';
        categoryFilter.value = 'all';
        areaFilter.value = 'all';
        priceFilter.value = 'all';

        displayPlaces();
        placeSearch.focus();
    });

// Filter the places and display matching cards
function displayPlaces() {
    const search = placeSearch.value.trim().toLowerCase();

    const matches = places.filter(function (place) {
        const text =
            `${place.name} ${place.description} ${place.area}`.toLowerCase();

        return (
            text.includes(search) &&
            (categoryFilter.value === 'all' ||
                place.category === categoryFilter.value) &&
            (areaFilter.value === 'all' ||
                place.area === areaFilter.value) &&
            (priceFilter.value === 'all' ||
                place.priceType === priceFilter.value)
        );
    });

    placesDisplay.replaceChildren();

    document.getElementById('results-count').textContent =
        `${matches.length} of ${places.length} places shown`;

    if (matches.length === 0) {
        const message = document.createElement('p');

        message.textContent =
            'No places match. Try another area or category, or clear your filters.';

        placesDisplay.appendChild(message);
        return;
    }

    matches.forEach(function (place) {
        const card = document.createElement('article');
        card.className = 'place-card';

        const badge = document.createElement('span');
        badge.className = 'badge';

        badge.textContent =
            `${categoryLabels[place.category]} · ${place.area}`;

        const title = document.createElement('h3');
        title.textContent = place.name;

        const description = document.createElement('p');
        description.textContent = place.description;

        const price = document.createElement('p');
        price.className = 'details';
        price.textContent = priceLabels[place.priceType];

        const tip = document.createElement('p');
        tip.className = 'details';
        tip.textContent = `Planning tip: ${place.tip}`;

        const links = document.createElement('div');
        links.className = 'card-links';

        const official = document.createElement('a');
        official.href = place.url;
        official.textContent = 'Official details ↗';
        official.target = '_blank';
        official.rel = 'noopener noreferrer';

        official.setAttribute(
            'aria-label',
            `${place.name}: official details (opens in a new tab)`
        );

        const map = document.createElement('a');

        map.href =
            'https://www.google.com/maps/search/?api=1&query=' +
            encodeURIComponent(place.mapQuery);

        map.textContent = 'Map ↗';
        map.target = '_blank';
        map.rel = 'noopener noreferrer';

        map.setAttribute(
            'aria-label',
            `${place.name}: map search (opens in a new tab)`
        );

        links.append(official, map);

        const choose = document.createElement('button');
        choose.type = 'button';

        choose.textContent = place.category === 'stay'
            ? 'Plan this stay'
            : 'Use in planner';

        choose.setAttribute(
            'aria-label',
            `Use ${place.name} in planner`
        );

        choose.addEventListener('click', function () {
            choosePlace(place);
        });

        card.append(
            badge,
            title,
            description,
            price,
            tip,
            links,
            choose
        );

        placesDisplay.appendChild(card);
    });
}

// Fill the planner so the user can check the price before adding
function choosePlace(place) {
    const isStay = place.category === 'stay';
    const prefix = place.category === 'eat' ? 'food' : 'activity';

    const nameInput = document.getElementById(
        isStay
            ? 'lodging-name'
            : (prefix === 'food' ? 'food-place' : 'activity-name')
    );

    const costInput = document.getElementById(
        isStay ? 'lodging-price' : `${prefix}-cost`
    );

    const hasDraft =
        nameInput.value.trim() !== '' ||
        (
            costInput.value !== '' &&
            (!isStay || Number(costInput.value) !== 0)
        );

    if (
        hasDraft &&
        !confirm(
            'Replace the current entry in this part of the planner? Added food and activity list items will stay.'
        )
    ) {
        return;
    }

    nameInput.value = place.name;
    costInput.value = place.priceType === 'free' ? '0' : '';

    if (!isStay) {
        document.getElementById(`${prefix}-cost-type`).value = 'person';
    }

    entryMessage.textContent = isStay
        ? `${place.name} selected. Enter the combined nightly price for all rooms or beds and the number of nights. Save Trip to keep your changes.`
        : `${place.name} selected. Check the cost and press Add ${prefix === 'food' ? 'Food' : 'Activity'} to include it in the budget.`;

    if (isStay) {
        calculateBudget();
    }

    document.getElementById('planner').scrollIntoView();
    costInput.focus({ preventScroll: true });
}

// Show all places when the page opens
displayPlaces();