//##############################################################################
//######################### SETTING UP DOM START ############################### 
//############################################################################## 

let Utilitiesicons = {
    "calculClassique": {
        "name": "calculClassique",
        "src": "./Ressources/Imgs/calculClassique.svg",
        "order": "1"
    },
    "carnetCredit": {
        "name": "carnetCredit",
        "src": "./Ressources/Imgs/carnetCredit.svg",
        "order": "4"
    },
    "imprimer": {
        "name": "imprimer",
        "src": "./Ressources/Imgs/imprimer.svg",
        "order": "5"
    },
    "reste": {
        "name": "reste",
        "src": "./Ressources/Imgs/reste.svg",
        "order": "3"
    },
    "coller": {
        "name": "coller",
        "src": "./Ressources/Imgs/coller.svg",
        "order": "2"
    }
};

function putUtilitiesIcons(icons) { //PUTS UTILITIES ICONS IN PLACE OVER THE KEYBOARD
    let container = document.getElementById('utilities');
    for (const icon in icons) {
        container.innerHTML += (`
            <img src=${icons[icon].src} 
            alt=${icons[icon].name} 
            style="order:${icons[icon].order}">
        `)
    }
}


window.onload =  (event) => {

    ic_Ticket.render(document.getElementById("ic_screenContainer"))
    setScreenHeight();

    this.addEventListener("resize", (event)=> {setScreenHeight();});
    checkLocalStorage();

    ic_Ticket.setTicketDate()
    ic_Ticket.setTicketId();

    ic_date.render(document.getElementById("ic_dateContainer"));
    ic_TicketNumber.render(document.getElementById("ic_NTicket"));
    ic_openTime.render(document.getElementById("ic_timeContainer"), ic_openTime.default);

    numbers.renderBtns();
    ic_nextBtn.render(document.getElementById("ic_nextContainer"));
    ic_backspace.render(document.getElementById("ic_backspaceContainer"))



    //putUtilitiesIcons(Utilitiesicons);



    ic_discard.render(document.getElementById("ic_discardContainer"));
    ic_validate.render(document.getElementById("ic_validateContainer"));
    ic_total.render(document.getElementById("ic_totalContainer"));

    //ic_nextBtn.render(document.getElementById("ic_nextBtnContainer"))
    //ic_backspace.render(document.getElementById("ic_bSpaceContainer"));
    swipeDownDetect(document.getElementById("total-box"))

}




//##############################################################################
//######################### SETTING UP DOM END ################################# 
//############################################################################## 









//##############################################################################
//###################### VARIABLES DECLARATION START ########################### 
//##############################################################################

dailyTickets=[]; //REPRESENTS THE VALID TICKETS FOR TODAY

counter= 1; 


//##############################################################################
//######################## VARIABLES DECLARATION END ###########################  
//##############################################################################








//##############################################################################
//###################### INTERACTING WITH DOM START ############################ 
//##############################################################################



function swipeDownDetect(el){ //DETECTS IF THE CALCULATOR'S IS SWIPED UP OR DOWN AND EXECUTE THE SUITABLE BEHAVIOR

    var touchsurface = el,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 500, // maximum time allowed to travel that distance
    elapsedTime,
    startTime

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface

    })

    touchsurface.addEventListener('touchmove', function(e){
        /*var touchobj = e.changedTouches[0]
        let distY = touchobj.pageY - startY

        console.log(distY)*/
    })

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for horizontal swipe met
                (distY > 0 && ic_Ticket.state.view== "SHRUNK")? extendScreen():(distY < 0 && ic_Ticket.state.view== "EXTENDED")? shrinkScreen():"invalid"; // if dist traveled is negative, it indicates left swipe
            }
        }
    })
}



function extendScreen(){ //WILL EXTEND THE CALCULATOR'S SCREEN DOWN
    let myKeyboard= document.getElementById("keyboard");
    let myScreen= document.getElementById("screen");

    myScreen.classList.add("!h-[97dvh]");
    myKeyboard.classList.add("down","opacity-0");
    ic_Ticket.state.view= "EXTENDED"
}

function shrinkScreen(){ //WILL SHRINK THE CALCULATOR'S SCREEN UP
    let myKeyboard= document.getElementById("keyboard"); 
    let myScreen= document.getElementById("screen");

    myScreen.classList.remove("!h-[97dvh]");
    myKeyboard.classList.remove("down","opacity-0");
    ic_Ticket.state.view= "SHRUNK"
}



function swipeLeftDetect(el){

    var touchsurface = el,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 500, // maximum time allowed to travel that distance
    elapsedTime,
    startTime

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        startX = touchobj.pageX  // record coordinates where finger first makes contact with surface
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface

    })

    touchsurface.addEventListener('touchmove', function(e){
    })

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime  // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                if (distX > 0){
                    deleteArticle(el.children[0]);
                    setTimeout(()=> render(), 300) // if dist traveled is negative, it indicates left swipe
                }
            }
        }
    })
}




function refreshArticlesIndicator(){ //UPDATES THE VALUE OF ARTICLES NUMBER INDICATOR

    //COUNTS HOW MANY VALID ARTICLES IN THE CONTENT ARRAY

    ic_Ticket.setTicketCount()


    if(ic_Ticket.data.count < 1){ 
        ic_discard.setState("inactive");
        ic_validate.setState("inactive");
    } else{ 
        ic_discard.setState("active");
        ic_validate.setState("active");
    }
    ic_Ticket.refreshArticlesNumber();

}


//##############################################################################
//###################### INTERACTING WITH DOM END ############################## 
//##############################################################################













//##############################################################################
//###################### INTERACTING WITH DATA START ########################### 
//##############################################################################

function handleScreenClick(){ //IF THE SCREEN IS CLICKED WHILE "EMPTY", A NEW ELEMENT IS ADDED
    let actualEdit= ic_Ticket.data.articles.filter(el=> el.state== "FOCUSED")[0];

    if(ic_Ticket.state.data== "EMPTY"){ //IF THE SCREEN IS CLICKED WHILE "EMPTY", A NEW ELEMENT IS ADDED
        

        ic_Ticket.setOpenTime()
        ic_openTime.render(document.getElementById("ic_timeContainer"), ic_openTime.timeValue)        
        ic_Ticket.addArticle()
        ic_Ticket.setState("NOT-EMPTY");
    }else{ //IF THE SCREEN IS CLICKED WHILE "NOT-EMPTY", THE CURRENT EDITING TEXT WILL LOSE FOCUS AN THE TOTAL WILL BE REFRESHED
        actualEdit.stopEdit()

        ic_Ticket.calcTicketTotal();
        ic_total.render(document.getElementById("ic_totalContainer"));
    }

}


function handleClick(number) {  //HANDLES NUMBERS CLICKS AN ASSIGN THEIR VALUE TO "ARTICLES" OR "PRICE" DEPENDING ON THE STATE


    if(ic_Ticket.state== "EMPTY"){ 
        //IF A NUMBER IS CLICKED WHILE THERE IS NO ARTICLE IN FOCUSED IT ADDS A NEW ARTICLE AND THE TICKET IS NO LONGER "EMPTY"
        ic_Ticket.data.articles.push(new newArticle(ic_Ticket.data.count+1, document.getElementById("Articles")))
        ic_Ticket.data.articles.filter(el=> el.id== ic_Ticket.data.count+1)[0].createArticleBox();
        ic_Ticket.data.count+= 1;
        
        ic_openTime.setTimeValue();
        ic_openTime.render(document.getElementById("ic_timeContainer"), ic_openTime.timeValue);

        ic_Ticket.state= "NOT-EMPTY"
    }else if(ic_Ticket.state== "NOT-EMPTY" && ic_Ticket.data.articles.filter(el=> el.state=="FOCUSED").length==0){
        ic_Ticket.data.articles.push(new newArticle(ic_Ticket.data.count+1, document.getElementById("Articles")))
        ic_Ticket.data.articles.filter(el=> el.id== ic_Ticket.data.count+1)[0].createArticleBox();
        ic_Ticket.data.count+= 1; 
    }


    let ActualEdit= ic_Ticket.data.articles.filter(el=> el.state=="FOCUSED")[0];


    if (ActualEdit.state == "FOCUSED" && ActualEdit.price.state == "FOCUSED") { 
    //IF THE PRICE IS FOCUSED, THE CLICKED NUBER WILL BE APPEND TO PRICE VALUE

        if (ActualEdit.price.mode == "REPLACE") {
            ActualEdit.price.mode == "APPEND";
            setValue(ActualEdit.price, number);
            ActualEdit.renderPrice();
        } 
        else if(number == "."){
        //PREVENTS ADDING ANOTHER "." TO THE PRICE VALUE IF IT ALREADY HAVE ONE OR IF PRICE DOES ALREDY HAVE 2 NUMBERS
            if(ActualEdit.price.value.includes(".") == true  ||  ActualEdit.price.value.length > 3 ){
                ActualEdit.renderPrice();

            } 
            else {
                setValue(ActualEdit.price, number); 
                ActualEdit.renderPrice();
            }
        }
              
        else if (ActualEdit.price.value.length < 5 && (ActualEdit.price.value + number).length <= 5) {
        //THIS TEST PREVENTS ADDING ANOTHER NUMBER TO PRICE VALUE IF IT ALREADY ATTEMPTED ITS MAXIMUM SIZE
            setValue(ActualEdit.price, number);
            ActualEdit.renderPrice();
        }
        else if (ActualEdit.price.value.length < 5 && number.length == 2) {
        // THIS CONDITION IS TRUE IF THE USER PRESS "00" WHILE THERE IS ONLY A PLACE FOR ONE NUMBER
            setValue(ActualEdit.price, number[0]);
            ActualEdit.renderPrice();
            }
    }



    else if (ActualEdit.state == "FOCUSED" && ActualEdit.quantity.state == "FOCUSED" && ActualEdit.quantity.value.length < 2 && number!="." && number!="00") {
    //IF AN ARTICLE IS FOCUSED AND ITS QUANTITY TEXT IS FOCUSED AND QUANTITY VALUE LENGTH IS LESS THAN 2 AND THE NUMBER PRESSED IS NOT "." (DEFENETLY WE CANT BUY HALF AN ARTICLE)
    
        if (ActualEdit.quantity.mode == "REPLACE") {
            ActualEdit.quantity.value = number;
            ActualEdit.quantity.mode = "APPEND";
            ActualEdit.renderQuantity();
        } else {
            setValue(ActualEdit.quantity, number);
            ActualEdit.renderQuantity();
        }

    }
}

function setValue(path, number) { //SETS THE VALUE OF QUANTITY OR PRICE DEPENDING ON STATE AND MODE
    if (path.mode == "REPLACE") {
        path.value = number;
        path.mode = "APPEND";

    } else if (path.mode == "APPEND")
        path.value += number;
}

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
    let date= ic_Ticket.date;

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

//##############################################################################
//####################### INTERACTING WITH DATA END ############################ 
//##############################################################################






//##############################################################################
//#################'###### NAVIGATING SCREENS START ############################ 
//##############################################################################

 

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
    document.querySelector(".data").innerHTML=`
    <div class="border-l h-[90%] border-black absolute left-[36%] top-0"></div>                    
    <div class="border-l h-[90%] border-black absolute left-[65%] top-0"></div>`

}


function printTicket(){
    let ticket= document.getElementById("ticket");
    window.print(ticket);
}







//STILL WORKING ON HOW TOFILL THE TICKET WITH THE NECESSARY DATA
function fillTicket(){
    fillTicketHeader();
    fillTicketFooter();
    fillTicketLines(dailyTickets[dailyTickets.length-1].content);
    fillTicketTotal(dailyTickets[dailyTickets.length-1]);
    

}

function fillTicketHeader(){
    let numTicket= document.getElementById("ticketId");
    let nbrArticles= document.getElementById("length");
    let lastTicket= dailyTickets[dailyTickets.length-1]

    
    numTicket.innerHTML= `Ticket N°: #${(lastTicket.ticketId.toFixed()).padStart(6,0)}`;
    if(lastTicket.count == 1){
        nbrArticles.innerHTML= `${lastTicket.count} Article`;
    }else{
        nbrArticles.innerHTML= `${lastTicket.count} Articles`;
    }
    
}


function fillTicketFooter(){
    ic_date.render(document.getElementById("date-t"))
    let CloseTime= document.getElementById("closeTime");
    let lastTicket= dailyTickets[dailyTickets.length-1]

    CloseTime.innerHTML= ` ${lastTicket.timeClose}`;
}




function addTicketLine(elem){  //ADDS A TICKET LINE IN THE PRINTING SCREEN 
    
    let template = document.querySelector("#ticketLineTemplate");  //LOADS THE HTML TEMPLATE TO A VARIABLE
    let clone = template.content.cloneNode(true);       //CREATES A CLONE (COPY) OF THE TEMPLATE
    let elements = clone.querySelectorAll("div");
    let container = document.querySelector(".data");


    let price= elem.price.toFixed(3);
    let quantity= String(elem.quantity);
    let total= elem.total.toFixed(3);

    elements[1].innerHTML= price;
    elements[2].innerHTML= quantity;
    elements[3].innerHTML= total;
    container.insertBefore(clone, container.children[0]); //INJECTS THE TEMPLATE'S COPY SAVED IN "container"  TO THE DOM
   
}

function fillTicketTotal(ticket){
    let totalTicket= document.getElementById("TotalVal");
    totalTicket.innerHTML= ticket.totalTicket.toFixed(3)
}


function fillTicketLines(content){
    content.forEach(el=>addTicketLine(el))
}




function setScreenHeight(){
    let parentHeight= document.getElementById("calculator").offsetHeight;
    let keyboardHeight= document.getElementById("keyboard").offsetHeight;
    //document.getElementById("screen").removeAttribute("class");
    document.getElementById("screen").setAttribute("class",`flex flex-col transition-[height] duration-200 ease-in-out flex-1 h-[${parentHeight-keyboardHeight}px]`);

}



function switchMapImgs(newImgTag){
    let current= document.getElementById("buttons");
    if (newImgTag== ".") {
        newImgTag= ","
    }

    let newPath= "Ressources/keyboard map/"+ newImgTag + ".png";
    current.setAttribute("src", newPath)

    setTimeout(()=> current.setAttribute("src", "Ressources/keyboard map/default.png")
    ,200)
}


function mapDim(){ //ADAPTS HTML MAP AREAS
    let numProp= [[12.5,12.5,11.25],[37.5,12.5,11.25],[62.5,12.5,11.25],[12.5,37.5,11.25],[37.5,37.5,11.25],[62.5,37.5,11.25],[12.5,62.5,11.25],[37.5,62.5,11.25],[62.5,62.5,11.25],[12.5,87.5,11.25],[37.5,87.5,11.25],[62.5,87.5,11.25]];
    let numbers= [...document.getElementsByClassName("numbers")];
    let dim= document.getElementById("buttons").offsetHeight/100

    for (let i = 0; i < numbers.length; i++) {
        numbers[i].setAttribute("coords",`${numProp[i][0]*dim},${numProp[i][1]*dim},${numProp[i][2]*dim}`)        
    }

    let operProp=[[76.5, 1.25, 99, 27.25],[76.5, 31.25, 99, 78.75],[76.5, 80.25, 99, 99]];
    let operators= [...document.getElementsByClassName("operators")]

    for (let i = 0; i < operators.length; i++) {
        operators[i].setAttribute("coords",`${operProp[i][0]*dim},${operProp[i][1]*dim},${operProp[i][2]*dim},${operProp[i][3]*dim}`)        
    }
}











































