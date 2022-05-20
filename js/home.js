const base_url = config.BASE_URL;
var prevDiv = -1;
var firstId;
var currentDivSelected;
$(document).ready(function () {
    //alert("ready");
    getItems();
    let totalAmount = 0;
    let moneyInputField = $("#moneyInput");
    $("#addDollarBtn").click(function (e) {
        e.preventDefault();
        totalAmount = totalAmount + 1;
        moneyInputField.val(totalAmount.toFixed(2));
        $("#changeMessage").val("");
    });
    $("#addQuaterBtn").click(function (e) {
        e.preventDefault();
        totalAmount = totalAmount + 0.25;
        moneyInputField.val(totalAmount.toFixed(2));
        $("#changeMessage").val("");
    });
    $("#addDimeBtn").click(function (e) {
        e.preventDefault();
        totalAmount = totalAmount + 0.10;
        moneyInputField.val(totalAmount.toFixed(2));
        $("#changeMessage").val("");
    });
    $("#addNickelBtn").click(function (e) {
        e.preventDefault();
        totalAmount = totalAmount + 0.05;
        moneyInputField.val(totalAmount.toFixed(2));
        $("#changeMessage").val("");
    });
    $('#makePurchaseBtn').click(function (e) {
        makePurchase($('#itemId').val(), $('#moneyInput').val());

    });
    $("h1").click(function () {
        removeSelection(currentDivSelected);
    });
    // $("#moneyDetail").click(function(){
    //     removeSelection(currentDivSelected);
    // }) ;
    $('#changeBtn').click(function () {
        returnChange();
    });
});

//This metho is to display list of all items 
function getItems() {
    let getItemsUrl = base_url + "items";
    $.ajax(
        {
            type: 'GET',
            url: getItemsUrl,
            success:
                function (items) {
                    console.log(items);
                    var currentItemCount = 0;
                    var itemsRow = '<div class="row">';
                    firstId = items[0].id;
                    var itemRow=$("#itemsRow");
                    $.each(items,function(index,item){
                        var displayItem=$("#itemTemplate").clone();
                        displayItem.attr("id",item.id);
                        displayItem.removeClass("d-none");            
                        displayItem.find("#itemNumber").text(item.id);
                        displayItem.attr("onclick","selectItem(" + item.id + ")");
                        displayItem.find("#itemName").text(item.name);
                        displayItem.find("#itemPrice").text("$"+item.price.toFixed(2))
                        displayItem.find("#itemQuantity").text(item.quantity);
                        displayItem.find("#itemQuantity").attr("id","quantity"+item.id);
                        itemRow.append(displayItem);
                    });  
                },
            error:
                function () {
                    alert("error");
                }
        });
}

function selectItem(id) {
    $("#changeMessage").val("");
    currentDivSelected = id;
    $('#itemId').val(id);
    if (prevDiv >= firstId && prevDiv != id) {
        var prevDivId = "#" + prevDiv;
        $(prevDivId).css({ "backgroundColor": "white" });
    }
    var currentDiv = "#" + id;
    $(currentDiv).css({ "backgroundColor": "lightblue" });
    prevDiv = id;
    $("#message").val("");
}

//This method is used to make purchase of an item selected
function makePurchase(itemId, money) {
    let purchaseItemUrl = base_url + "money/" + money + "/item/" + itemId;
    $.ajax({
        type: "POST",
        url: purchaseItemUrl,
        async: false,
        success: function (change) {            
            let totalChange = 0;
            totalChange = totalChange + change.quarters * 0.25;
            totalChange = totalChange + change.dimes * 0.10;
            totalChange = totalChange + change.nickels * 0.05;
            totalChange = totalChange + change.pennies * 0.01;
            $("#moneyInput").val(totalChange);
            var currQuantity = "#quantity" + itemId;
            var currentQuantityText = $(currQuantity).text();
            var currentItemCount = Number(currentQuantityText);
            currentItemCount--;
            $(currQuantity).html(currentItemCount);
            $("#message").val("Thank You!!");
            removeSelection();
        },
        error: function (response) {
            $("#message").val(response.responseJSON.message);
        }
    });
}
function removeSelection(itemId) {
    $("#" + itemId).css({ "backgroundColor": "white" });
    $('#itemId').val("");
}

function returnChange() {
    var quarters,dimes,nickels,pennies;
    var moneyToReturn=$("#moneyInput").val();
    var dollars=Math.floor(moneyToReturn);
    var remainingMoney=moneyToReturn-dollars;
  
    var totalPennies=dollars*100+remainingMoney*100;
    
    //calculate quarters and update pennies
    quarters=Math.floor(totalPennies/25);
    totalPennies=totalPennies-quarters*25;

    //calculate dimes and update pennies
    dimes=Math.floor(totalPennies/10);
    totalPennies=totalPennies-dimes*10;

    //calculate nickels and update pennies
    nickels=Math.floor(totalPennies/5);
    totalPennies=totalPennies-nickels*5;

    //remaining pennies
    pennies=totalPennies;

    var totalChange = "";
    if (quarters > 0) {
        totalChange = totalChange + quarters + " Quaters"
    }
    if (dimes > 0) {
        totalChange = totalChange + "," + dimes + " Dimes"
    }
    if (nickels > 0) {
        totalChange = totalChange + "," + nickels + " Nickels"
    }
    if (pennies > 0) {
        totalChange = totalChange + "," + pennies + " Pennies"
    }
    $("#changeMessage").val(totalChange + ".");
    $("#moneyInput").val("");
    $("#message").val("");
    removeSelection(prevDiv);
}