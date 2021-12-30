const Modal = {
    open(){
        document.querySelector('[data-modal-overlay]').classList.add('active')
    },

    close(){
        document.querySelector('[data-modal-overlay]').classList.remove('active')
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'WebSite',
        amount: 500000,
        date: '23/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021'
    },
]

const Transaction = {
    all: transactions,
    
    add(transaction) {
        Transaction.all.push(transaction);

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
                <img src="./assets/images/minus.svg" alt="Remover transação">
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
    }
}


const App = {
    init(){
        
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance();
    },

    reload(){
        DOM.clearTransactions();
        App.init();
    }
}

App.init();

Transaction.add({
    id: 39,
    description: 'Alo',
    amount: 200000,
    date: '23/01/2021'
})