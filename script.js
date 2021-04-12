const form = document.querySelector('#form');
const transactionNameInput = document.querySelector('#text');
const transactionValueInput = document.querySelector('#amount');
const transactionsList = document.querySelector('#transactions');
const balanceField = document.querySelector('#balance');
const despesaField = document.querySelector('#money-minus');
const receitaField = document.querySelector('#money-plus');


function addTransaction(event){
    event.preventDefault();

    if(!transactionNameInput.value.trim() || !transactionValueInput.value.trim()) return alert('Campos Vazios');
    if(transactionValueInput.value == 0) return alert('Valor inválido');

    const transactionName = transactionNameInput.value.trim();
    const transactionValue = Number(transactionValueInput.value.trim().replace(',','.'));
    const id = new Date().getTime();
    const transactions = new Map(JSON.parse(localStorage.getItem('transactions')));

    form.reset();

    
    transactions.set(id, {
        transactionName,
        transactionValue
    });

    localStorage.setItem('transactions', JSON.stringify([...transactions]));

    loadTransactions();
}


function loadTransactions(){
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    transactionsList.innerHTML = '';
    balanceField.innerHTML = 'R$ 0,00';
    despesaField.innerHTML = '- R$ 0,00';
    receitaField.innerHTML = '+ R$ 0,00';

    if(!transactions.length) return

    const balance = transactions
        .map((element) => element[1].transactionValue)
        .reduce((prev, cur) => prev + cur, 0);

    const despesa = transactions
        .filter((element) => element[1].transactionValue < 0)
        .map((element) => element[1].transactionValue)
        .reduce((prev, cur) => prev + cur, 0);

    const receita = transactions
        .filter((element) => element[1].transactionValue > 0)
        .map((element) => element[1].transactionValue)
        .reduce((prev, cur) => prev + cur, 0);


    balanceField.innerHTML = `R$ ${balance.toFixed(2).replace('.',',')}`;
    despesaField.innerHTML = `- R$ ${despesa.toFixed(2).replace('.',',')}`;
    receitaField.innerHTML = `+ R$ ${receita.toFixed(2).replace('.',',')}`;

    transactions.forEach(element => {
        const transactionValue = element[1].transactionValue;
        const transactionName = element[1].transactionName;

        transactionsList.innerHTML += `
        <li class="${transactionValue > 0 ? 'plus' : 'minus'}">
          ${transactionName} <span>${transactionValue > 0 ? '+' : '-'} $${transactionValue.toFixed(2).replace('.',',').replace('-','')}</span><button class="delete-btn"
            id="${element[0]}" onclick="removeTransaction(this.id)">x</button>
        </li>`;
    });
}

loadTransactions();


function removeTransaction(id){
    const transactions = new Map(JSON.parse(localStorage.getItem('transactions')));

    transactions.delete(Number(id));
    localStorage.setItem('transactions', JSON.stringify([...transactions]));
    loadTransactions();
}