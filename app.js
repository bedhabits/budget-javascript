// BUDGET CONTROLLER

var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

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
        inputValeu: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list"
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValeu).value
            }
        },

        addLisItem: function(obj, type) {
            var html, element;
            // Create HTML string
            if (type === "inc") {
                element = DOMStrings.incomeContainer;

                html = `<div class="item clearfix" id="income-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${obj.value}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`

            } else if (type === "exp") {
                element = DOMStrings.expenseContainer;

                html = `<div class="item clearfix" id="expense-${obj.id}">
                            <div class="item__description">${obj.description} rent</div>
                            <div class="right clearfix">
                                <div class="item__value">${obj.value}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`

            }



            // Replace placeholder


            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("afterbegin", html);
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
        })
    };


    var ctrlAddItem = function() {
        var input, newItem;
        // 1 - Read input
        input = UIController.getInput();

        // 2 - Update budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);

        // 3 - Update UI item
        UIController.addLisItem(newItem, input.type);

        // 4 - Update total budget

        // 5 - Display budget

    }

    return {
        init: function() {
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();
