
const budgetDisplay = document.getElementById('budget-display');
const form = document.getElementById('budget-form');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    calculateBudget();
});

function calculateBudget() {
    const travelers = Number(document.getElementById('travelers').value);
    const personalCost = parseFloat(document.getElementById('Personal-Cost').value);
    const sharedCost = parseFloat(document.getElementById('Shared-cost').value);

    if (
        !Number.isInteger(travelers) ||
        travelers < 1 ||
        !Number.isFinite(personalCost) ||
        personalCost < 0 ||
        !Number.isFinite(sharedCost) ||
        sharedCost < 0
    ) {
        budgetDisplay.textContent = 'Enter a whole number of at least 1 and costs of 0 or more.';
        return;
    }

    const totalCost = personalCost * travelers + sharedCost;
    const costPerPerson = totalCost / travelers;

    budgetDisplay.innerHTML = `
        <h3>Estimated Budget</h3>
        <p>Total cost for the group: $${totalCost.toFixed(2)}</p>
        <p>Cost per person: $${costPerPerson.toFixed(2)}</p>
        <p>Shared costs are divided equally. Estimates are rounded to cents.</p>
    `;
}
