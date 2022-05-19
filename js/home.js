const base_url = config.BASE_URL;
var prevDiv = -1;
var firstId;
var currentDivSelected;
var quarters, nickels, pennies;
$(document).ready(function () {
    //alert("ready");
    getItems();
    let totalAmount = 0;
    let moneyInputField = $("#moneyInput");
    $("#addDollarBtn").click(function (e) {
        e.preventDefault();
        totalAmount = totalAmount + 1;
        moneyInputField.val(totalAmount.toFixed(2));
    });
    $("#addQuaterBtn").click(function (e) {
        e.preventDefault();
        totalAmount = totalAmount + 0.25;
        moneyInputField.val(totalAmount.toFixed(2));

    });
    $("#addDimeBtn").click(function (e) {
        e.preventDefault();
        totalAmount = totalAmount + 0.10;
        moneyInputField.val(totalAmount.toFixed(2));
    });
    $("#addNickelBtn").click(function (e) {
        e.preventDefault();
        totalAmount = totalAmount + 0.05;
        moneyInputField.val(totalAmount.toFixed(2));
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
                    firstId=items[0].id;
                    for (let loopCounter = 0; loopCounter < items.length; loopCounter++) {
                        if (loopCounter % 3 == 0) {
                            $('#itemsList').append(itemsRow);
                            itemsRow = '<div class="row">';
                        }
                        var itemsCol = "";
                        itemsCol = itemsCol + '<div class="col bordered-div m-1" id="' + items[loopCounter].id + '" onclick="selectItem(' + items[loopCounter].id + ')">' + (loopCounter + 1) + '<br>';
                        itemsCol = itemsCol + '<p class="text-center" id="name' + items[loopCounter].id + '">' + items[loopCounter].name + '<br><br>';
                        itemsCol = itemsCol + '<span id="price' + items[loopCounter].id + '">$' + items[loopCounter].price + '</span><br><br>';
                        itemsCol = itemsCol + 'Quantity Left:<span id="quantity' + items[loopCounter].id + '">' + items[loopCounter].quantity + '</span>';
                        itemsCol = itemsCol + '</p></div>';
                        itemsRow = itemsRow + itemsCol;
                    }
                },
            error:
                function () {
                    alert("error");
                }
        });
}

function selectItem(id) {
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

function makePurchase(itemId, money) {
    let purchaseItemUrl = base_url + "money/" + money + "/item/" + itemId;
    alert(purchaseItemUrl);
    $.ajax({
        type: "POST",
        url: purchaseItemUrl,
        async: false,
        success: function (change) {
            quarters = change.quarters;
            dimes = change.dimes;
            nickels = change.nickels;
            pennies = change.pennies;
            let totalChange = 0;
            totalChange = totalChange + quarters * 0.25;
            totalChange = totalChange + dimes * 0.10;
            totalChange = totalChange + nickels * 0.05;
            totalChange = totalChange + pennies*0.01;
            $("#moneyInput").val(totalChange);
            var currQuantity = "#quantity" + itemId;
            var currentQuantityText = $(currQuantity).text();
            var currentItemCount = Number(currentQuantityText);
            currentItemCount--;
            $(currQuantity).html(currentItemCount);
            console.log(totalChange);
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

    var totalChange = "";
    if (quarters > 0) {
        totalChange = totalChange + quarters + " Quaters"
    }
    if (dimes > 0) {
        totalChange = totalChange +","+ dimes + " Dimes"
    }
    if (nickels > 0) {
        totalChange = totalChange +","+nickels + " Nickels"
    }
    if (pennies > 0) {
        totalChange = totalChange + ","+pennies + " Pennies"
    }
    $("#changeMessage").val(totalChange + ".");
    $("#moneyInput").val("");
    $("#message").val("");
    removeSelection(prevDiv);
}