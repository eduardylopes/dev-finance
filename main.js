const Button = {
    newTransactionButton() {
        const newTransactionButton = document.querySelector('[data-button-new]')
        newTransactionButton.addEventListener('click', (event) => {
            event.preventDefault();
            Modal.open();
        })
    },

    cancelTransactionButton() {
        const cancelTransactionButton = document.querySelector('[data-button-cancel]')
        cancelTransactionButton.addEventListener('click', (event) => {
            event.preventDefault();
            Modal.close();
        })
    },

    saveTransactionButton() {
        const saveTransactionButton = document.querySelector('[data-button-save]')
        saveTransactionButton.addEventListener('click', (event) => {
            event.preventDefault();
            Form.submit();
        })
    },

    removeTransactionButton() {
        const removeTransactionButton = document.querySelectorAll('[data-remove-transaction]');
        removeTransactionButton.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.parentElement.parentElement.getAttribute('data-index')
                Transaction.remove(index);
            })
        })
    }
}

const Modal = {

    open(){
        document.querySelector('[data-modal-overlay]').classList.add('active')
    },

    close(){
        document.querySelector('[data-modal-overlay]').classList.remove('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    },
}

const Transaction = {
    all: Storage.get(),
    
    add(transaction) {
        Transaction.all.push(transaction);
        
        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload();
    },

    incomes(){
        let income = 0
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        const transactionsValue = document.querySelectorAll('[data-transaction-value]')
        return income
    },

    expenses(){
        let expense = 0
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        const transactionsValue = document.querySelectorAll('[data-transaction-value]')
        return expense
    },

    total(){
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactonsContainer: document.querySelector('[data-table-tbody]'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        tr.dataset.index = index

        DOM.transactonsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {
        const CSSClass = transaction.amount > 0 ? "transaction__table-income" : "transaction__table-expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="transaction__table-description">${transaction.description}</td>
            <td class="${CSSClass}" data-transaction-value>${amount}</td>
            <td class="transaction__table-date">${transaction.date}</td>
            <td>
                <button class="transaction__button-remove" data-remove-transaction>
                    <img src="./assets/images/minus.svg" alt="Remover transação">
                </button>
            </td>
        `
        return html
    },

    updateBalance() {
        const incomeDisplay = document.querySelector('[data-income-display]')
        const expenseDisplay = document.querySelector('[data-expense-display]')
        const totalDisplay = document.querySelector('[data-total-display]')

        incomeDisplay.innerText = Utils.formatCurrency(Transaction.incomes())
        expenseDisplay.innerText = Utils.formatCurrency(Transaction.expenses())
        totalDisplay.innerText = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactonsContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },

    formatAmount(value) {
        value = Number(value) * 100
        return value
    },

    formatDate(value) {
        const splittedDate = value.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('[data-input-description]'),
    amount: document.querySelector('[data-input-amount]'),
    date: document.querySelector('[data-input-date]'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validadeField() {
        const { description, amount, date } = Form.getValues()

        if ( description.trim() === "" || amount.trim() === "" || date.trim() === "" ) {
            throw new Error('Por favor, preencha todos os campos');
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date,
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit() {

        try {
            Form.validadeField()
            const transaction = Form.formatValues()
            saveTransaction = Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()

        } catch (error) {
            alert(error.message)
        }

    }
}

const App = {
    init(){
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })

        DOM.updateBalance();

        Storage.set(Transaction.all)

        Button.removeTransactionButton();
    },
    
    reload(){
        DOM.clearTransactions();
        App.init();
    }
}

App.init();

Button.newTransactionButton();
Button.cancelTransactionButton();
Button.saveTransactionButton();