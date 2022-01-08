$(document).ready(function(){

    // ----------------------------------------------------------------------------
    //
    //              Initializing var (global) variables
    
    var budgetInput= document.getElementById("budget-input");
    var budgetSubmit= document.getElementById("budget-submit");
    var budgetAmount= document.getElementById("budget-amount");
    var budgetFeedback= document.getElementsByClassName("budget-feedback");

    var balanceAmount=document.getElementById("balance-amount");

    var expenseInput=document.getElementById('expense-input');
    var expenseSubmit= document.getElementById("expense-submit");
    var expenseAmount=document.getElementById('amount-input');
    var expenseFeedback=document.getElementsByClassName('expense-feedback');
    var expenseTotalAmount=document.getElementById('expense-amount');

    var tableCreated=false;
    var rowId=0;

    // -----------------------------------------------------------------------------

    budgetSubmit.addEventListener('click',function(e){
        e.preventDefault();

        if(budgetInput.value=="" || parseInt(budgetInput.value)<=0){
            // if inserted value is zero or less than zero
            $(budgetFeedback).fadeIn(); // Show the feedback
            $(budgetFeedback).text('Value cannot be empty or negative');

            $(budgetInput).on('focus',function(){
                $(budgetInput).select(); // On focus, select the value in input
                $(budgetFeedback).fadeOut(); // On focus, fadeOut the feedback
            });
        } else {
            // otherwise, do the magic and set the budget for calculations ;)
            // console.log(budgetInput.value);

            $(budgetAmount).text(budgetInput.value);
            // console.log(budgetAmount);

            updateBalance();
            budgetInput.value="";
        }
    });
   
     

    // UPDATE na BALANCE
    function updateBalance(){

        let budget=parseInt($(budgetAmount).text());
        let expenses=parseInt($(expenseTotalAmount).text());

        let balance=budget-expenses;
        
        if(balance<0){

            $('#balance').addClass('showRed').removeClass('showGreen showBlack');
            $(balanceAmount).text(balance);

        } else if (balance>0){

            $('#balance').addClass('showGreen').removeClass('showRed showBlack');
            $(balanceAmount).text(balance);

        } else {
            $('#balance').addClass('showBlack').removeClass('showRed showGreen');
            $(balanceAmount).text(balance);
        }
    }

    expenseSubmit.addEventListener('click', function(e){
        e.preventDefault();

        if(expenseInput.value=="" || parseInt(expenseAmount.value)<=0 || expenseAmount.value==""){
            // if inserted value is zero or less than zero or empty
            $(expenseFeedback).fadeIn(); // Show the feedback
            $(expenseFeedback).text('Value cannot be empty or negative');

            $(expenseInput).on('focus',function(){
                $(expenseInput).select(); // On focus, select the value in input
                $(expenseFeedback).fadeOut(); // On focus, fadeOut the feedback
            });
        } else {
            // otherwise, do the magic and set the budget for calculations ;)
            if(!tableCreated){ // Check if is the table created, if not, than create it
                // let formId=document.querySelector('#expense-form');
                let tablePlace=$('#expense-form').parent().next();
                // console.log(createTable());
                let table=createTable();
                // console.log(table);
                tablePlace.append(table);
                // tablePlace.innerHTML(createTable());
                tableCreated=true;
            }
            expenseSum(expenseInput.value, parseInt(expenseAmount.value));

            updateBalance();
            expenseInput.value="";
            expenseAmount.value="";
            expenseInput.select();
            $(expenseSubmit).text('add expense');
        }
    });


    function createTable(){
        let table=`<table class="table table-borderless">
							<thead>
							  <tr class='text-center'>
								<th scope="col">Expense title</th>
								<th scope="col">Expense amount</th>
								<th scope="col"></th>
							  </tr>
							</thead>
							<tbody class='showRed'>
							  
							</tbody>
                          </table>`;
        return table;
    }

    function expenseSum(title,amount){
        let expensesSum=parseInt($(expenseTotalAmount).text());
        expensesSum+=amount;

        $(expenseTotalAmount).text(expensesSum);
        addExpenses(title,amount);
    }

    function addExpenses(title, amount){
        title=title.toUpperCase();
        
        $('table tbody').append(`
            <tr class="text-center" data-id='${rowId}' data-title='${title}' data-amount='${amount}'>
                <td scope="col"><strong>${title}</strong></td>
                <td scope="col"><strong>${amount}</strong></td>
                <td>
                    <i class="edit-icon fas fa-edit"></i>
                        &nbsp;&nbsp;
                    <i class="delete-icon fas fa-trash"></i>
                </td>                   
            </tr>`);
        rowId++;
    };
    
    $(document).on("click", ".delete-icon", function(){
        // pred da go izbrise redot, treba da gi update-uva podatocite vo expenseTotalAmount i Balance

        let expensesUpdate=parseInt($(expenseTotalAmount).text()); // ja zima momentalnata vrednost na ExpenseTotalAmount
        // console.log(expensesUpdate);
        expensesUpdate-=parseInt($(this).parents('tr').attr('data-amount')); // ja odzema vrednosta koja ke se brise od vkupnite trosoci
        // console.log(expensesUpdate);
        $(expenseTotalAmount).text(expensesUpdate); // go update-uva TotalAmount

        updateBalance(); // update na balance

        $(this).closest('tr').remove(); // brisenje na redot
    });
    $(document).on("click", ".edit-icon", function(){
        let expensesUpdate=parseInt($(expenseTotalAmount).text());
        $(expenseSubmit).text('update expense');
        let editID=$(this).parents('tr').attr('data-id');
        $(expenseInput).val($(this).parents('tr').attr('data-title')); // go zima nazivot na trosokot i go popolnuva adekvatniot input
        $(expenseAmount).val($(this).parents('tr').attr('data-amount')); // go zima iznosot na trosokot i go popolnuva adekvatniot input
        expensesUpdate-=parseInt($(this).parents('tr').attr('data-amount')); // ja odzema vrednosta koja ke se menuva od vkupnite trosoci
        $(expenseTotalAmount).text(expensesUpdate); // go update-uva TotalAmount

        $(this).closest('tr').remove(); // brisenje na redot

        updateBalance(); // update na balance
    });

});