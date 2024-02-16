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


function setOnClick() { //SETS ONCLICK FUNCTION FOR EVERY NUMBER
    let numbers = document.querySelectorAll('.numeric');
    for (let i = 0; i < numbers.length; i++) {
        numbers[i].setAttribute('onclick', `handleClick(this.innerHTML);`)
    }
    
}

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

    this.addEventListener("resize", (event)=> {setScreenHeight()});
    ic_date.render(document.getElementById("date"));
    setOnClick();
    //putUtilitiesIcons(Utilitiesicons);
    checkLocalStorage();
    setTicketNbr();
    setScreenHeight();
    ic_discard.render(document.getElementById("ic_discardContainer"));
    ic_validate.render(document.getElementById("ic_validateContainer"));
    ic_total.render(document.getElementById("ic_totalContainer"));
    ic_nextBtn.render(document.getElementById("ic_nextBtnContainer"))
    ic_backspace.render(document.getElementById("ic_bSpaceContainer"));
    
    swipeDownDetect(document.getElementById("extend-container"))
    swipeDownDetect(document.getElementById("total"))

}




//##############################################################################
//######################### SETTING UP DOM END ################################# 
//############################################################################## 









//##############################################################################
//###################### VARIABLES DECLARATION START ########################### 
//##############################################################################

dailyTickets=[]; //REPRESENTS THE VALID TICKETS FOR TODAY

Ticket={ //HOLDS THE CUREENT TICKET'S DATA
    state:      "EMPTY",  //["EMPTY", "NOT-EMPTY"]
    content:    [],
    total:      0,
    openTime:   null,
    closeTime:  null,
    date:       null,
    count:      0,
    ticketId:   1
}



articleTemplate = { //DATA TEMPLATE FOR ARTICLES THAT WILL BE ADDED TO THE TICKET

    id:         null,
    state:      "FOCUSED", // Possible states ["BLUR","BLUR", "FOCUSED"]
    valid:      "NO",


    price:       {
        state:      "BLUR",    //Possible states["FOCUSED", "BLUR"]
        mode:       "REPLACE",  //Possible states["REPLACE", "APPEND"]
        value:      "0",
        numeric:     0,
    },

    quantity:   {
        state:      "BLUR",  //Possible states["FOCUSED", "BLUR"]
        mode:       "REPLACE", //Possible states["REPLACE", "APPEND"]
        value:      "1",
        numeric:     1,
    },

    total:      0

    }

counter= null; 


//##############################################################################
//######################## VARIABLES DECLARATION END ###########################  
//##############################################################################








//##############################################################################
//###################### INTERACTING WITH DOM START ############################ 
//##############################################################################


function render(){ //WILL RENDER THE DATA FLECTING THE STATE ON THE DOM
    let container = document.querySelector("#Articles");
    container.innerHTML="";

    Ticket.content.forEach(el=> {
        addArticleBox(el);
        displayPrice(el);
        displayQuantity(el);
    });
    refreshNumber();

    highlightSelectedArticle();
    highlightSelectedText();
    
    calcEachTotal();
    calcTicketTotal();
    ic_total.render(document.getElementById("ic_totalContainer"));

}



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
    })

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for horizontal swipe met
                (distY > 0 && ic_total.screenState== "SHRUNK")? extendScreen():(distY < 0 && ic_total.screenState== "EXTENDED")? shrinkScreen():"invalid"; // if dist traveled is negative, it indicates left swipe
            }
        }
    })
}



function extendScreen(){ //WILL EXTEND THE CALCULATOR'S SCREEN DOWN
    let myKeyboard= document.getElementById("keyboard");
    let myScreen= document.getElementById("screen");

    myScreen.classList.add("h-[95vh]");
    myKeyboard.classList.add("hidden");
    ic_total.setSceenState("EXTENDED");
}

function shrinkScreen(){ //WILL SHRINK THE CALCULATOR'S SCREEN UP
    let myKeyboard= document.getElementById("keyboard"); 
    let myScreen= document.getElementById("screen");

    myScreen.classList.remove("h-[95vh]");
    myKeyboard.classList.remove("hidden");
    ic_total.setSceenState("SHRUNK");
}





function highlightSelectedArticle(){ //HIGHLIGHTS THE ARTICLE IN EDITION (FOCUSED)
    Ticket.content.forEach((el)=>{ 
        if(el.state=="FOCUSED"){
            let highlighted= document.getElementById(`${el.id}`); //SELECT THE ELEMENT FROM THE DOM BY THE ELEMENT'S REGISTRED ID
            highlighted.classList.add("bg-green-200")
            let thisClose= highlighted.children[0]
            thisClose.classList.add("bg-gray-200")
        }
        else if(el.state=="BLUR"){
            let highlighted= document.getElementById(`${el.id}`); //SELECT THE ELEMENT FROM THE DOM BY THE ELEMENT'S REGISTRED ID
            highlighted.classList.remove("bg-green-200")
            let thisClose= highlighted.children[0]
            thisClose.classList.remove("bg-gray-200")
        }
    })
    
}


function highlightSelectedText(){ //HIGHLIGHTS THE TEXT IN EDITION (FOCUSED)
    Ticket.content.forEach((el)=>{
        let article= document.getElementById(`${el.id}`); //
        let priceText= article.children[1].children[0];
        let quantityText= article.children[1].children[1].children[1]

        if(el.price.state== "FOCUSED"){         //IF PRICE IS FOCUSED IT WILL BE HIGHLGHTED
            priceText.classList.add("text-red-400");

        }else{      //ELSE HIGHLIGHT WILL BE REMOVED
            priceText.classList.remove("text-red-400");
        }
        
        if(el.quantity.state== "FOCUSED"){      //IF QUANTITY IS FOCUSED IT WILL BE HIGHLGHTED
            quantityText.classList.add("text-red-400");

        }else{      //ELSE HIGHLIGHT WILL BE REMOVED
            quantityText.classList.remove("text-red-400");
        }
    })

}



function displayPrice(el) {  //DISPLAYS THE VALUE OF "PRICE" FOR EACH ARTICLE


    let article = document.getElementById(`${el.id}`)
    let activeDinars= article.children[1].children[0].children[0];
    let activeMillim = article.children[1].children[0].children[2].children[1];
    console.log("thats a price render")
    let value=  el.price.value;
    if(!value.includes('.')){ //IF THE VALUE OF PRICE CONTAINS A "." ALREADY IT TURNS IT INTO A FLOAT
        value= makeFloat(value);
    }
    el.price.numeric= parseFloat(value)

    let splitted = value.split(".");                        //EXAMPLE:    VALUE= "6,5"  / SPLITTED= ["6","5"]
    activeDinars.innerHTML= splitted[0].padStart(1, 0);     // "6"
    activeMillim.innerHTML= splitted[1].padEnd(3,0);        // "500"
};




function displayQuantity(el) { //DISPLAYS THE VALUE OF "QUANTITY" FOR EACH ARTICLE

    //console.log("thats a quantity render")
    let article= document.getElementById(`${el.id}`)
    let quantityText= article.children[1].children[1].children[1];

    el.quantity.numeric= parseFloat(el.quantity.value);
    quantityText.innerHTML= el.quantity.value.padStart(2,0)
    };



/*function displayTotal() { //DISPLAYS THE TOTAL VALUE OF THE VALIDATED ARTICLES

    let strValue = Ticket.total.toFixed(3); //EXAMPLE: Ticket.total= 23.5  / strValue= "23.500" ;
    let splitted = strValue.split("."); //splitted= ["23","500"]

    dinarsTot.innerHTML = splitted[0];
    millimTot.innerHTML = splitted[1];
}*/



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


function slideDelete(element){ //GIVES A SLIDING EFFECT TO THE DELETED ARTICLE 
    
    let article= element.parentElement;
    article.classList.add("ml-[200%]")

}


// ####################################################################

function refreshNumber(){ //REFRESHES THE NUMBER OF EACH VALIDATED ARTICLE ON THE SCREEN

    refreshArticlesIndicator();
    let validArticles= Ticket.content.filter(el=> el.valid== "YES"); //FILTERS THE VALID ARTICLES
    validArticles.forEach(el=>{
        let elem= document.getElementById(el.id); //GETS THE ELEMENT BY ITS REGISTRED ID 
        elem.children[1].children[2].innerHTML= validArticles.indexOf(el)+1 //DISPLAYS ITS OWN INDEX+1       // FIRST ITEM'S INDEX= 0
    })
}



function addArticleBox(elem){  //ADDS A NEW ARTICLE BOX IN THE SCREEN 
    
    let template = document.querySelector("#articleTemplate");  //LOADS THE HTML TEMPLATE TO A VARIABLE
    let clone = template.content.cloneNode(true);       //CREATES A CLONE (COPY) OF THE TEMPLATE
    let elements = clone.querySelectorAll("div");
    let container = document.querySelector("#Articles");
    elements[0].setAttribute("id",`${elem.id}`);
    swipeLeftDetect(elements[0])
    container.insertBefore(clone, container.children[0]); //INJECTS THE TEMPLATE'S COPY SAVED IN "container"  TO THE DOM
   
}


function clearAll(){ //DELETS ALL THE ARTICLES FROM THE SCREEN + FROM THE DATA
    let articles= Ticket.content.map(el=> (el.id));
    articles.forEach(el=>{ //DELETES THE ARTICLES FROM THE DOM ONE BY ONE
        let element= document.getElementById(`${el}`)
        deleteArticle(element.children[0]) //DELETES THE ARTICLES FROM THE DOM AND THE CONTENT JSON ONE BY ONE
    })

    Ticket.state= "EMPTY"; //RESET THE TICKET'S STATE TO "EMPTY"
    document.getElementsByClassName("time")[0].innerHTML= "-:-:-";

    setTimeout(()=> render(), 300) //WAITS FOR 0,3s UNTIL THE DELETING'S SLIDE EFFECT IS FINISHED THEN REFRESHES THE SCREEN

}


function deleteArticle(element){ //DELETES A SPECIFIC ARTICLE

    let ID= parseInt(element.parentNode.id);
    Ticket.content= Ticket.content.filter((Article) =>!(Article.id == ID)); //SEARCHS FOR THE ARTICLES JSON BY ITS ID
    if(Ticket.content.length==0){ //IF THERE IS NO ARTICLES THE TICKET'S STATE WILL BE EMPTY
        Ticket.state= "EMPTY" 
        document.getElementsByClassName("time")[0].innerHTML= "-:-:-"; //RESETS THE OPENING TIME
    }
    else {
        Ticket.state= "NOT-EMPTY";
    }

    slideDelete(element);
    calcTicketTotal()
    refreshArticlesIndicator()
    ic_discard.render(document.getElementById("ic_discardContainer"));
    ic_validate.render(document.getElementById("ic_validateContainer"));
    ic_total.render(document.getElementById("ic_totalContainer"));

}




function refreshArticlesIndicator(){ //UPDATES THE VALUE OF ARTICLES NUMBER INDICATOR

    Ticket.count= (Ticket.content.length-1 < 0)?0:(Ticket.content.filter(el=>el.valid=="YES").length); 
    //COUNTS HOW MANY VALID ARTICLES IN THE CONTENT ARRAY

    if(Ticket.content.length < 1){ 
        ic_discard.setState("inactive");
        ic_validate.setState("inactive");
    } else{ 
        ic_discard.setState("active");
        ic_validate.setState("active");
    }

    ic_validate.setCount(Ticket.count)
}


//##############################################################################
//###################### INTERACTING WITH DOM END ############################## 
//##############################################################################





//##############################################################################
//##################### MAKING CHANGES ON STATE START ########################### 
//##############################################################################



function startEditing(element) { //CHANGES THE STATE OF THE ELEMENT GIVEN AS ARGUMENT TO "FOCUSED"

    element.state = "FOCUSED";   
}

function stopEditing(element) { //CHANGES THE STATE OF THE ELEMENT GIVEN AS ARGUMENT TO "BLUR"
    if(element.id){
        //IF THE ELEMENT HAVE AN ID IT WILL BE IDENTIFIED AS THE ARTICLE BOX
        element.state = "BLUR";
        highlightSelectedArticle("OFF")
    } 
    else {
        //IF THE ELEMENT DOESN'T HAVE AN ID IT WILL BE IDENTIFIED AS ONE OF THE ARTICLE TEXTS (PRICE OR QUANTITY)
        element.state = "BLUR";
        element.mode = "REPLACE";
        highlightSelectedText();
    }   
}



function editPrice(element){ //CHANGES THE STATE SO THE PRICE SO IT-CAN BE MODIFIED

    let ID= element.parentElement.parentElement.id;
    let ActualEdit= Ticket.content.filter(el=> el.state== "FOCUSED")[0];

    if(ActualEdit != undefined){ 
        //IF THE IS AN ACTIVE (FOCUSED) ARTICLE IT WILL BE BLURED
        ActualEdit.state= "BLUR"; ActualEdit.price.state= "BLUR"; ActualEdit.quantity.state= "BLUR";
        displayPrice(ActualEdit);

    }


    let newEdit= Ticket.content.filter(el=> el.id== ID)[0];  //THE NEW SELECTED ELEMENT WILL BE IDENTIFIED BY ITS DOM "ID"
    newEdit.state= "FOCUSED"; newEdit.price.state= "FOCUSED"; newEdit.price.mode= "REPLACE";
    newEdit.state= "FOCUSED"; newEdit.quantity.state= "BLUR"; newEdit.price.mode= "REPLACE";
    highlightSelectedArticle();
    highlightSelectedText();
    calcEachTotal();
    calcTicketTotal();
    ic_total.render(document.getElementById("ic_totalContainer"));
}


function editQuantity(element){ //CHANGES THE STATE SO THE QUANTITY CAN BE MODIFIED

    let ID= element.parentElement.parentElement.id;
    let ActualEdit= Ticket.content.filter(el=> el.state== "FOCUSED")[0];

    if(ActualEdit != undefined){
        //IF THE IS AN ACTIVE (FOCUSED) ARTICLE IT WILL BE BLURED
        ActualEdit.state= "BLUR"; ActualEdit.price.state= "BLUR"; ActualEdit.quantity.state= "BLUR";
        displayQuantity(ActualEdit);
    }

    let newEdit= Ticket.content.filter(el=> el.id== ID)[0]; //THE NEW SELECTED ELEMENT WILL BE IDENTIFIED BY ITS DOM "ID"
    newEdit.state= "FOCUSED"; newEdit.quantity.state= "FOCUSED"; newEdit.quantity.mode= "REPLACE";
    newEdit.state= "FOCUSED"; newEdit.price.state= "BLUR"; newEdit.price.mode= "REPLACE";
    highlightSelectedArticle();
    highlightSelectedText();
    calcEachTotal();
    calcTicketTotal();
    ic_total.render(document.getElementById("ic_totalContainer"));
}

//##############################################################################
//###################### MAKING CHANGES ON STATE END ############################ 
//##############################################################################










//##############################################################################
//###################### INTERACTING WITH DATA START ########################### 
//##############################################################################

function handleScreenClick(){ //IF THE SCREEN IS CLICKED WHILE "EMPTY", A NEW ELEMENT IS ADDED
    let actualEdit=Ticket.content.filter(el=> el.state== "FOCUSED")[0];

    if(Ticket.state== "EMPTY"){ //IF THE SCREEN IS CLICKED WHILE "EMPTY", A NEW ELEMENT IS ADDED
        Ticket.state= "NOT-EMPTY"
        setOpenTime();
        addArticle();
    }else{ //IF THE SCREEN IS CLICKED WHILE "NOT-EMPTY", THE CURRENT EDITING TEXT WILL LOSE FOCUS AN THE TOTAL WILL BE REFRESHED
        stopEditing(actualEdit?.price);
        stopEditing(actualEdit?.quantity);
        calcEachTotal();
        calcTicketTotal();
        ic_total.render(document.getElementById("ic_totalContainer"));
    }

}


function handleClick(number) {  //HANDLES NUMBERS CLICKS AN ASSIGN THEIR VALUE TO "ARTICLES" OR "PRICE" DEPENDING ON THE STATE


    if(Ticket.state== "EMPTY"){ 
    //IF A NUMBER IS CLICKED WHILE THERE IS NO ARTICLE IN FOCUSED IT ADDS A NEW ARTICLE AND THE TICKET IS NO LONGER "EMPTY"
        addArticle();
        setOpenTime();
        Ticket.state= "NOT-EMPTY"
    }else if(Ticket.state== "NOT-EMPTY" && Ticket.content.filter(el=> el.state=="FOCUSED").length==0){
        addArticle() 
    }


    let ActualEdit= Ticket.content.filter(el=> el.state=="FOCUSED")[0];


    if (ActualEdit.state == "FOCUSED" && ActualEdit.price.state == "FOCUSED") { 
    //IF THE PRICE IS FOCUSED, THE CLICKED NUBER WILL BE APPEND TO PRICE VALUE

        if (ActualEdit.price.mode == "REPLACE") {
            ActualEdit.price.mode == "APPEND";
            setValue(ActualEdit.price, number);
            displayPrice(ActualEdit);
            calcEachTotal();
        } 
        else if(number == "."){
        //PREVENTS ADDING ANOTHER "." TO THE PRICE VALUE IF IT ALREADY HAVE ONE OR IF PRICE DOES ALREDY HAVE 2 NUMBERS
            if(ActualEdit.price.value.includes(".") == true  ||  ActualEdit.price.value.length > 3 ){
                displayPrice(ActualEdit);
                calcEachTotal();
            } 
            else {
                setValue(ActualEdit.price, number); 
                displayPrice(ActualEdit);
                calcEachTotal();
            }
        }
              
        else if (ActualEdit.price.value.length < 5 && (ActualEdit.price.value + number).length <= 5) {
        //THIS TEST PREVENTS ADDING ANOTHER NUMBER TO PRICE VALUE IF IT ALREADY ATTEMPTED ITS MAXIMUM SIZE
            setValue(ActualEdit.price, number);
            displayPrice(ActualEdit);
            calcEachTotal();
        }
        else if (ActualEdit.price.value.length < 5 && number.length == 2) {
        // THIS CONDITION IS TRUE IF THE USER PRESS "00" WHILE THERE IS ONLY A PLACE FOR ONE NUMBER
            setValue(ActualEdit.price, number[0]);
            displayPrice(ActualEdit);
            calcEachTotal();
            }
    }



    else if (ActualEdit.state == "FOCUSED" && ActualEdit.quantity.state == "FOCUSED" && ActualEdit.quantity.value.length < 2 && number!=".") {
    //IF AN ARTICLE IS FOCUSED AND ITS QUANTITY TEXT IS FOCUSED AND QUANTITY VALUE LENGTH IS LESS THAN 2 AND THE NUMBER PRESSED IS NOT "." (DEFENETLY WE CANT BUY HALF AN ARTICLE)
    
        if (ActualEdit.quantity.mode == "REPLACE") {
            ActualEdit.quantity.value = number;
            ActualEdit.quantity.mode = "APPEND";
            displayQuantity(ActualEdit);
            calcEachTotal();
        } else {
            setValue(ActualEdit.quantity, number);
            displayQuantity(ActualEdit)
            calcEachTotal();
        }

    }
}




function setOpenTime(){ //SETS THE TICKET'S OPENING TIME
    let now= new Date() //EXAMPLE: now= Tue Feb 06 2024 12:31:22 GMT+0100 (heure normale d’Europe centrale)
    let currentDateTime = now.toLocaleString(); // "06/02/2024 12:32:16"
    let time= currentDateTime.split(" ")[1]; // "12:32:16"
    document.getElementsByClassName("time")[0].innerHTML= time;
    Ticket.openTime= time;
}

function setCloseTime(){ //SETS THE TICKET'S CLOSING TIME
    let now= new Date() //EXAMPLE: now= Tue Feb 06 2024 12:31:22 GMT+0100 (heure normale d’Europe centrale)
    let currentDateTime = now.toLocaleString(); // "06/02/2024 12:32:16"
    let time= currentDateTime.split(" ")[1]; //"12:32:16"
    document.getElementsByClassName("time")[0].innerHTML= time;
    Ticket.closeTime= time;
}



function setValue(path, number) { //SETS THE VALUE OF QUANTITY OR PRICE DEPENDING ON STATE AND MODE
    if (path.mode == "REPLACE") {
        path.value = number;
        path.mode = "APPEND";

    } else if (path.mode == "APPEND")
        path.value += number;
}



function validateTicket(){ //SAVES THE TICKET TO LOCAL STORAGE FOR FUTURE USAGE
    setCloseTime();
    Ticket.content= Ticket.content.filter(el=> el.valid== "YES"); //RETURNS VALID ARTICLES ONLY

    let articlesData = Ticket.content.map(el=> {
    //RETURNS THE NECESSARY DATA FROM EACH ARTICLE
        return {
            "total"     :   el.total,
            "price"     :   el.price.numeric,
            "quantity"  :   el.quantity.numeric,
            
        }

    })

    dailyTickets.push({ //PUSHES A NEW JSON CONTAINING THE TICKET DATA TO THE ARRAY HOLDIN TODAY'S TOCKETS
        "content":          articlesData,
        "timeOpen":         Ticket.openTime,
        "timeClose":        Ticket.closeTime,
        "totalTicket":      Ticket.total,
        "ticketId":         Ticket.ticketId,
        "count":            Ticket.count,
        "date":             Ticket.date
})

    clearAll()
    localStorage[`${Ticket.date}`]= JSON.stringify(dailyTickets);
    Ticket.ticketId += 1;
    Ticket.openTime= null;
    Ticket.closeTime= null;
    setTicketNbr();
    fillTicket()
    goToPrintScreen();
    
}



function setTicketNbr(){ //  #UNDER TEST#   WILL CHECK PREVIOUS TICKETS FROM PREVIOUS TIMES TO IDENTIFY THE NUMBER OF THE ACTUAL TICKET 
   
    let ticketNumber= document.getElementById("num-ticket")
    for (let i = 0; i < 7;i++) {
        if (localStorage[getEarlyDate(i)]) {
            let prevdailyTickets= JSON.parse(localStorage[getEarlyDate(i)]);
            Ticket.ticketId= prevdailyTickets[prevdailyTickets.length-1].ticketId+1
            break
        }
    }
    ticketNumber.innerHTML="#"+ ((Ticket.ticketId).toFixed()).padStart(6,0);
}



function addArticle(){ //ADDS A NEW ARTICLE JSON TO THE TICKET BY CREATING A DEEP COPY FROM THE ARTICLE TEMPLATE JSON
    counter +=1;
    articleTemplate.id= counter;
    Ticket.content.push(JSON.parse(JSON.stringify(articleTemplate)));
    startEditing((Ticket.content.filter(el=> el.state== "FOCUSED")[0]).price);
    render();
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




function calcEachTotal() { //CALCULATE THE TOTAL OF EACH ARTICLE
    Ticket.content.forEach(el=>{
        el.total= el.price.numeric * el.quantity.numeric;
    })};

function calcTicketTotal(){ //CALCULATES THE SUM OF TOTALS

    Ticket.total= Ticket.content.filter(el=> el.valid== "YES").reduce((sum, currentVal)=> sum + currentVal.total, 0);
    ic_total.setTotalValue(Ticket.total)
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
    let date= Ticket.date;

    if(date in localStorage){
        try {
            dailyTickets.push(... JSON.parse(localStorage[date]));
        } catch (error) {
            console.log("Good day! Here..Open your first Ticket")
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
    let ticketDate= document.getElementById("date-t");
    let OpenTime= document.getElementById("openTime");
    let CloseTime= document.getElementById("closeTime");
    let lastTicket= dailyTickets[dailyTickets.length-1]

    ticketDate.innerHTML= `Date: ${lastTicket.date}`;
    CloseTime.innerHTML= `Temps: ${lastTicket.timeClose}`;
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
    document.getElementById("screen").removeAttribute("class");
    document.getElementById("screen").setAttribute("class",`flex flex-col transition-[height] duration-200 ease-in-out h-[${parentHeight-keyboardHeight}px]`);

}















































