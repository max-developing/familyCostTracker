"use strict";

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Marko Markovic",
  movements: [
    [200, "sold a bike"],
    [-400, "bought pc parts"],
    [3000, "sold a car"],
    [-650, "bought house gym"],
  ],
  pin: 1111,
};

const account2 = {
  owner: "Nikola Nikolic",
  movements: [
    [5000, "salary"],
    [3400, "sold a bike"],
    [-150, "store, home ingredients"],
    [-790, "bills, new clothes"],
  ],
  pin: 2222,
};

const account3 = {
  owner: "Milena Bojovic Matejic",
  movements: [
    [200, "gift from parents"],
    [-200, "holiday installment"],
    [-20, "phone bill"],
    [400, "salary for 10/2020"],
  ],
  pin: 3333,
};

const account4 = {
  owner: "Sara Saric",
  movements: [
    [430, "salary"],
    [1000, "sold a car"],
    [700, "sold a sofa"],
  ],
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");

const containerApp = document.querySelector(".main");
const containerMovements = document.querySelector(".movements");
const containerLoginOpt = document.querySelector(".loginOptions");

const formLogin = document.querySelector(".form__login");
const welcomeAnimation = document.querySelector(".welcomeAnimation");

const btnLogin = document.querySelector(".btn__login");
const btnLogout = document.querySelector(".btn__logout");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnIncome = document.querySelector(".form__btn--income");
const btnExpense = document.querySelector(".form__btn--expense");
const btnSort = document.querySelector(".btn__sort");

const inputLoginUser = document.querySelector(".login--user");
const inputLoginPin = document.querySelector(".login--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputIncomeAmount = document.querySelector(".form__input--income");
const inputIncomeMessage = document.querySelector(".form__input--incomeMsg");
const inputExpenseAmount = document.querySelector(".form__input--expense");
const inputExpenseMessage = document.querySelector(".form__input--expenseMsg");

/////////////////////////////////////////////////
// Functions

const generateUsername = function (accounts) {
  accounts.forEach(
    (acc) =>
      (acc.userName = acc.owner
        .split(" ")
        .reduce((acc, name) => acc + name[0], "")
        .toLowerCase())
  );
};

const logIn = function () {
  const user = inputLoginUser.value;
  const pin = +inputLoginPin.value;

  const loggedAcc = accounts.find((acc) => acc.userName === user);

  if (loggedAcc.pin !== pin) return;

  formLogin.classList.add("hidden");
  welcomeAnimation.classList.add("hidden");
  btnLogout.classList.remove("hidden");
  containerApp.classList.remove("hidden");
  btnLogout.classList.remove("hidden");

  currentUser = loggedAcc;
  updateUI(currentUser);
  setTimeout(() => (containerApp.style.opacity = 1), 500);

  inputLoginUser.value = inputLoginPin.value = "";
};

const logOut = function () {
  formLogin.classList.remove("hidden");
  welcomeAnimation.classList.remove("hidden");
  containerLoginOpt.classList.remove("hidden");
  btnLogout.classList.add("hidden");
  containerApp.classList.add("hidden");
  btnLogout.classList.add("hidden");

  labelWelcome.textContent = "Log in to get started";

  setTimeout(() => (containerApp.style.opacity = 0), 1000);
  currentUser = {};
};

const displayWelcomeMessage = function (acc) {
  labelWelcome.textContent = `Welcome back, ${acc.owner.split(" ")[0]}`;
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.map((mov) => [mov[0], mov[1]]).sort((a, b) => a[0] - b[0])
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov[0] > 0 ? "deposit" : "expense";
    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__message">${mov[1] ? mov[1] : ""}</div>
            <div class="movements__value">${mov[0]}€</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov[0], 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const moneyIn = acc.movements
    .filter((mov) => mov[0] > 0)
    .reduce((acc, mov) => acc + mov[0], 0);

  labelSumIn.textContent = `${moneyIn}€`;

  const moneyOut = Math.abs(
    acc.movements
      .filter((mov) => mov[0] < 0)
      .reduce((acc, mov) => acc + mov[0], 0)
  );

  labelSumOut.textContent = `${moneyOut}€`;
};

const updateUI = function (acc) {
  if (!acc) return;
  btnLogout.classList.remove("hidden");
  containerApp.classList.remove("hidden");
  containerLoginOpt.classList.add("hidden");
  displayWelcomeMessage(acc);
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const transferMoney = function () {
  const transferTo = inputTransferTo.value;
  const transferAmount = +inputTransferAmount.value;
  const transferToPerson = accounts.find((acc) => acc.userName === transferTo);

  if (
    !transferTo ||
    !transferAmount ||
    transferAmount < 0 ||
    transferAmount > +currentUser.balance ||
    !transferToPerson
  )
    return;

  currentUser.movements.push([
    -transferAmount,
    `Transfer to ${transferToPerson.owner.split(" ")[0]}`,
  ]);
  updateUI(currentUser);

  transferToPerson.movements.push([
    transferAmount,
    `Transfer from ${currentUser.owner.split(" ")[0]}`,
  ]);

  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  inputTransferAmount.blur();
};

const addNewIncome = function () {
  const incomeAmt = +inputIncomeAmount.value;
  const incomeMsg = inputIncomeMessage.value;

  if (!incomeAmt || incomeAmt < 1) return;

  currentUser.movements.push([incomeAmt, incomeMsg ? incomeMsg : ""]);
  updateUI(currentUser);

  inputIncomeAmount.value = inputIncomeMessage.value = "";
  inputIncomeAmount.blur();
  inputIncomeMessage.blur();
};

const addNewExpense = function () {
  const expenseAmt = +inputExpenseAmount.value;
  const expenseMsg = inputExpenseMessage.value;

  if (!expenseAmt || expenseAmt < 1) return;

  currentUser.movements.push([-expenseAmt, expenseMsg ? expenseMsg : ""]);
  updateUI(currentUser);

  inputExpenseAmount.value = inputExpenseMessage.value = "";
  inputExpenseAmount.blur();
  inputExpenseMessage.blur();
};

const startTimer = function () {
  console.log(labelTimer);
};

////////////////////////////////////////////////////
// Events
generateUsername(accounts);
// console.log(accounts);
// let currentUser = account1;
let currentUser;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  logIn();
});

btnLogout.addEventListener("click", function (e) {
  e.preventDefault();
  logOut();
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  transferMoney();
});

btnIncome.addEventListener("click", function (e) {
  e.preventDefault();
  addNewIncome();
});

btnExpense.addEventListener("click", function (e) {
  e.preventDefault();
  addNewExpense();
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});
