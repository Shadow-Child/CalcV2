window.onload =  (event) => {

    ic_Display.render(document.getElementById("ic_screenContainer"))
    setScreenHeight();

    this.addEventListener("resize", (event)=> {setScreenHeight();});
   

    ic_Display.setTicketDate()
    ic_Display.setTicketId();
    checkLocalStorage();

    ic_date.render(document.getElementById("ic_dateContainer"));
    ic_TicketNumber.render(document.getElementById("ic_NTicket"));
    ic_openTime.render(document.getElementById("ic_timeContainer"), ic_openTime.default);

    numbers.renderBtns();
    ic_nextBtn.render(document.getElementById("ic_nextContainer"));
    ic_backspace.render(document.getElementById("ic_backspaceContainer"))
    ic_history.render(document.getElementById("utilities"));
    //ic_settings.render(document.getElementById("utilities"));

    ic_discard.render(document.getElementById("ic_discardContainer"));
    ic_validate.render(document.getElementById("ic_validateContainer"));
    ic_total.render(document.getElementById("ic_totalContainer"));

    ic_dateFilter.getOptions();
}


dailyTickets=[]; //REPRESENTS THE VALID TICKETS FOR TODAY


counter= 1; 


function makeFloat(value) { //#WILL BE CHANGED# ADDS "." TO PRICE VALUE WHEN THE USER FORGETS TO DO SO
                            //IF FORCES THE USER TO TYPE NUMBERS THAT ARE LESS THAN "100.000"

    if (value.length <= 2) {
        return value + ".";
    }
    else if (value.length > 2) {
        return value.slice(0, 2) + "." + value.slice(2);

    }
}


function getEarlyDate(daysBack){ //RETURNS THE DATE BEFORE A SPECIFIC NUMBER OF DAYS GIVEN AS THE ARGUMENT

    let day = new Date();
    day.setDate(day.getDate()- daysBack)
    var dd = String(day.getDate()).padStart(2, '0');
    var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = String(day.getFullYear());

    return mm + '/' + dd + '/' + yyyy;
}


function checkLocalStorage(){ //CHECKS FOR DAILY TICKETS IN LOCAL STORAGE
    let date= ic_Display.data.date;

    if(date in localStorage){
        try {
            dailyTickets.push(... JSON.parse(localStorage[date]));
        } catch (error) {
            console.log("Good day! Here..Open your first ticket")
        }

    } else {
        localStorage.setItem(date, [])
    }
}

 
function goToPrintScreen(){ 
    //NAVIGATES TO THE PRINTING SCREEN (TICKET PREVIEW) BY HIDING THE CALCULATOR SCREEN AND DISPLAYING THE PRINT SCREEN
    let printScreen= document.getElementById("printScreen");
    let calculator= document.getElementById("calculator");
    printScreen.classList.remove("hidden");
    calculator.classList.add("hidden")
}


function returnToCalc(){ 
    //NAVIGATES TO THE CALCULATOR SCREEN (TICKET PREVIEW) BY HIDING THE PRINT SCREEN AND DISPLAYING THE CALCULATOR
    let printScreen= document.getElementById("printScreen");
    let calculator= document.getElementById("calculator");
    printScreen.classList.add("hidden");
    calculator.classList.remove("hidden");
    setScreenHeight()
    document.getElementById("ic_ticketContainer").innerHTML=``
    document.getElementById("ic_dateFilterContainer").innerHTML=``
}


function printTicket(){
    let navbar= document.getElementById("printNavBar");
    navbar.classList.add("hidden")
    window.print();
    navbar.classList.remove("hidden")
}


function setScreenHeight(){
    let parentHeight= document.getElementById("calculator").offsetHeight;
    let keyboardHeight= document.getElementById("keyboard").offsetHeight;
    //document.getElementById("screen").removeAttribute("class");
    document.getElementById("screen").setAttribute("class",`flex flex-col transition-[height] duration-200 ease-in-out flex-1 h-[${parentHeight-keyboardHeight}px]`);
    document.getElementById("keyboard").classList
}
















































