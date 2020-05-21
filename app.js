// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };


    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };

    // Type will be exp or inc
    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach((elem) => {
            sum += elem.value;
        });

        // We feed the data totals object
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // CREATE NEW ID AND NEW ITEM BASED ON INC OR EXP TYPE
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            // Push to data structure
            data.allItems[type].push(newItem);

            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            // Create an array with all the indexnumbers from the id of data elements
            ids = data.allItems[type].map(function(curr) {
                // Return [1, 2, 4, 6] => array of ids
                return curr.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {

            // Total income and expenses
            calculateTotal("exp");
            calculateTotal("inc");

            // Calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate percentage of income based on the expenses
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(curr) {
                curr.calcPercentage(data.totals.inc);
            })

        },

        getPercentages: function() {

            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });

            return allPerc;

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
        }
    }
})();



// UI CONTROLLER
var UIController = (function() {

    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month",
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split(".");

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }


        dec = numSplit[1];

        return (type === "exp" ? "-" : "+") + ` ${int}.${dec}`;

    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addLisItem: function(obj, type) {
            var html, element;
            // Create HTML string
            if (type === "inc") {
                element = DOMStrings.incomeContainer;

                html = `<div class="item clearfix" id="inc-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(obj.value, type)}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`

            } else if (type === "exp") {
                element = DOMStrings.expensesContainer;

                html = `<div class="item clearfix" id="exp-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(obj.value, type)}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`

            }

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", html);
        },

        deleteListItem: function(selectorID) {
            var elem = document.getElementById(selectorID);
            elem.parentNode.removeChild(elem);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(`${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`);
            // console.log(fields);

            fieldsArr = Array.prototype.slice.call(fields);

            // The method forEach accept up to 3 arguments = elem, index and the array
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = `${obj.percentage} %`;
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "--";
            }
        },

        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = "--";
                }


            });

        },

        displayMonth: function() {
            var now, year, months, month;

            now = new Date();
            // var christimas = new Date(2020, 11, 25)
            year = now.getFullYear();

            months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = `${months[month]}, ${year}`;

        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    }

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UIController.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener("keypress", function(event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
    };


    var updateBudget = function() {
        // 1 - Calculate the budget
        budgetController.calculateBudget();

        // 2 - Return the budget
        var budget = budgetController.getBudget();

        // 3 - Display the budget on the UI
        UIController.displayBudget(budget);
    };


    var updatePercentages = function() {

        // 1. Calculate percentages
        budgetController.calculatePercentages();

        // 2. Read from the budget controller
        var percentages = budgetController.getPercentages();

        // 3. Update the Ui with new percentages
        UIController.displayPercentages(percentages);


    };


    var ctrlAddItem = function() {
        var input, newItem;
        // 1 - Read input
        input = UIController.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2 - Update budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);

            // 3 - Update UI item
            UIController.addLisItem(newItem, input.type);

            // 4 - Clear fileds in the input form
            UIController.clearFields();

            // 5 - Calculate and Update the budget
            updateBudget();

            // 6. Calculate and update the percentages
            updatePercentages();
        }
    };


    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // Delete the item from data structure
            budgetController.deleteItem(type, ID);

            // Delete the item from UI
            UIController.deleteListItem(itemID);

            // Update the budget
            updateBudget();

            // Calculate and update the percentages
            updatePercentages();

        }
    };

    return {
        init: function() {
            setupEventListeners();
            UIController.displayMonth();
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
        }
    }

})(budgetController, UIController);

controller.init();
