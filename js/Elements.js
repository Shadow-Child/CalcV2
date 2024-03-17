let ic_discard={

    container: null,
    state: "inactive",

    setState: function(newState){
        this.state= newState;
        this.render(this.container);
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    OnclickEvent: function(){
       ic_Display.data.articles.forEach(el => {
        el.deleteArticle()
       })
    },

    ic_html: function(){
        let state= this.state;
        return `
            <div id="ic_discard" class="${state} flex-[1_0_0%] flex justify-center items-center aspect-square" onclick="ic_discard.OnclickEvent()">
                <img class="h-[70%]" src="Ressources/Imgs/supprimer ticket.svg">
            </div>
            <style>

                #ic_discard.inactive{
                    filter: grayscale(1);
                    opacity: 50%;
                    transition: all 0.5s ease-in-out
                }

                #ic_discard.active{
                    filter: grayscale(0);
                    opacity: 100%;
                    transition: all 0.5s ease-in-out
                }

            </style>
        `
    }
}


let ic_total={

    container:    null,
    state:{},
    data:{
        total: 0,
    },

    setState: function(newState){
        this.state= newState;
        this.render(this.container);
    },

    swipeDownDetect:function(){

    var touchsurface = this.container,
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
                ic_Display.changeView(); // if dist traveled is negative, it indicates left swipe
            }
        }
    })
    },

    setTotalValue: function(newValue){
        this.data.total= newValue;
    },

    render: function(target){
        this.container= target;
        let strValue = (this.data.total).toFixed(3); //EXAMPLE: ic_Display.data.total= 23.5  / strValue= "23.500" ;
        let splitted = strValue.split("."); //splitted= ["23","500"]
        let dinars= splitted[0];
        let millims= splitted[1];
        this.container.innerHTML= this.ic_html(dinars,millims);
        this.swipeDownDetect()
    },

    OnclickEvent:function(){
        ic_totalZoom.setValue(this.data.total)
        ic_totalZoom.render(document.getElementById("totalZoomContainer"))
    },


    ic_html: function(dinars, millims){
        return `
                <div id="total" class="border-l-2 border-r-2 border-gray-800 flex justify-center items-end relative h-full">

                    <div class="text-cyan-700 absolute left-2 top-1 text1">TOTAL</div>

                    <div id="total-val " class="w-full flex flex-row justify-center h-[50%] items-end mb-2" onclick="ic_total.OnclickEvent()">
                        <div id="dinars-total" class="text2 leading-none">${dinars}</div>
                        <div class="coma text3 leading-none">,</div>

                        <div class="relative">
                        <div class="leading-none text1">${t("curr")}</div>
                        <div id="millimes-total" class="text3 leading-none">${millims}</div>
    
                        </div>
                        

                    </div>

                    <div id="extend-container" class="flex justify-center bottom absolute bottom-[-17px]" onclick="ic_Display.changeView();">
                        <img src="Ressources/Imgs/extend.svg" id="extend">
                    </div>

                </div>`
    }

}


let ic_totalZoom={
    container: null,
    state:{},
    data:{
        value: null,
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
        this.container.classList.remove("hidden")
    },

    setValue: function(newValue){
        this.data.value= newValue;
    },

    OnclickEvent: function(){
        this.container.classList.add("hidden")
    },

    ic_html: function(){
        return`
        <div id="totalZoom" class="border border-black flex justify-center h-full items-center bg-gray-700/80" onclick="ic_totalZoom.OnclickEvent()">
            <div class="w-[80%] border h-[20%] flex flex-col justify-evenly items-center bg-gray-200 rounded-full">
                <div class="text4">TOTAL</div>
                <div class="text5 font-extrabold">${(this.data.value).toFixed(3)} ${t("curr")}</div>
            </div>
        </div>
        `
    }
}


let ic_nextBtn={

    container: null,

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    }
    ,

    OnclickEvent: function(){
        let actualEdit= ic_Display.data.articles.filter(el=> el.state== "FOCUSED")[0];
        let priceState= actualEdit?.price.state;
        let articleState= actualEdit?.quantity.state;

        if(ic_Display.state.data== "EMPTY"){ //IF "NEXT" IS PRESSED WHILE THE SCREEN IS EMPTY THE OPENING TIME WILL BE SET
            
            ic_Display.setOpenTime()
            ic_CalculatorInfoBar.render(ic_CalculatorInfoBar.container)
            ic_Display.addArticle();
            ic_Display.setState("NOT-EMPTY");
        }

        if(actualEdit== undefined ){
            let notValid= ic_Display.data.articles.filter(el=> el.valid== "NO"); //LOOKS FOR INVALID ARTICLES
            if (notValid.length != 0) { //IF THERE IS AN INVALID ARTICLE, ITS STATE WILL CHANGE TO "FOCUSED" IT IT WILL START EDITING
                notValid[0].editPrice();
            } else{

                ic_Display.addArticle();
                ic_Display.setState("NOT-EMPTY");
            }
        }

        else if (actualEdit.state== "FOCUSED" && priceState== "FOCUSED" && actualEdit.price.numeric !=0 && actualEdit.price.value != "." && actualEdit.price.value != "" ){
            // IF AN ARTICLE IS "FOCUSED" AND IT'S PRICE IS "FOCUSED" AND THE PRICE VALUE IS VALID, PRICE WILL BE BLUR AND QUANTITY WILL BE "FOCUSED"
            actualEdit.editQuantity();
            actualEdit.calcTotal();

            ic_Display.calcTicketTotal();    
            ic_total.render(document.getElementById("ic_totalContainer"));

            
        }
        else if( actualEdit.state== "FOCUSED" && articleState== "FOCUSED" && actualEdit.quantity.numeric !=0 ){
            // IF AN ARTICLE IS "FOCUSED" AND IT'S QUANTITY IS "FOCUSED" AND THE PRICE VALUE IS VALID, THE ARTICLE WILL BECOME VALID AND IT WILL LOSE FOCUS
            actualEdit.valid= "YES";
            actualEdit.stopEdit();
            actualEdit.calcTotal();
            ic_Display.calcTicketTotal();    
            ic_total.render(document.getElementById("ic_totalContainer"));

            let notValid= ic_Display.data.articles.filter(el=> el.valid== "NO");
            if (notValid.length != 0) {
            //IF AN INVALID ARTICLE IS LEFT BEHIND, IT WILL BE FOCUSED NEXT
                notValid[0].editPrice();
            } else{
            //IF THERE IS NO INVALID ARTICLES A NEW ARTICLE BOX WILL BE ADDED
            ic_Display.addArticle();
            }
    
        }
        else if(actualEdit.state== "FOCUSED" && articleState== "BLUR" && priceState== "BLUR" && actualEdit.valid== "YES"){
            actualEdit.stopEdit();
            ic_Display.addArticle();
        }
    
        ic_Display.refreshArticlesIndicator();
    },

    ic_html: function(){

        return`
        <img id="nextBtn" class="active:brightness-75 w-full" src="Ressources/keyboard keys/next.png" onclick="ic_nextBtn.OnclickEvent();">
        `
    }
}


let ic_backspace={
    container: null,
    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html()
    },

    OnclickEvent: function(){
        let ActualEdit= ic_Display.data.articles.filter(el=> el.state== "FOCUSED")[0];

        if (ActualEdit.price.state == "FOCUSED") {
            ActualEdit.price.value = ActualEdit.price.value.slice(0, -1);
            ActualEdit.renderPrice();
        } else if (ActualEdit.quantity.state== "FOCUSED") {
            ActualEdit.quantity.value = ActualEdit.quantity.value.slice(0, -1);
            ActualEdit.renderQuantity();;
            if (ActualEdit.quantity.value.length == 0) {
                ActualEdit.quantity.value = "1";
                ActualEdit.quantity.mode = "REPLACE"
            }
        }
    }

    ,
    ic_html: function(){

        return`
                <img id="backspace" class="active:brightness-75 w-full" src="Ressources/keyboard keys/backspace.png" onclick="ic_backspace.OnclickEvent();">
        `
    }
}


ic_CalculatorInfoBar={
    container: null,
    data:{
        date: null,
        openTime: "-:-:-",
        ticketId: null,
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    setDateValue: function(newValue){
        this.data.date=   newValue;
    },

    setTimeValue: function(newValue){
            this.data.openTime= newValue;
    },

    setTicketId: function(newValue){
        this.data.ticketId= newValue;
    },

    ic_html: function(){
        return`
        <div class="info-bar flex items-center text-center aspect-[10/1] bg-slate-300 border-b border-gray-700 text1">
            <div id="ic_dateContainer" class="flex-[2_0_0%]">${this.data.date}</div>
            <div id="ic_timeContainer" class="flex-[1_0_0%]">${this.data.openTime}</div>
            <div id="ic_NTicket" class="flex-[2_0_0%]">#${this.data.ticketId.padStart(7,0)}</div>
        </div>
        `
    }
}



class newArticle{

    constructor(id, container){ //A Class of newArticle

        this.id=         id;
        this.state=      "FOCUSED"; // Possible states ["BLUR","BLUR", "FOCUSED"]
        this.valid=      "NO";
        this.container=  container;
        this.indicator=       null;


        this.price=       {
            state:      "FOCUSED",    //Possible states["FOCUSED", "BLUR"]
            mode:       "REPLACE",  //Possible states["REPLACE", "APPEND"]
            value:      "0",
            numeric:     0,
        };

        this.quantity=   {
            state:      "BLUR",  //Possible states["FOCUSED", "BLUR"]
            mode:       "REPLACE", //Possible states["REPLACE", "APPEND"]
            value:      "1",
            numeric:     1,
        };

        this.total=      0;

    };

    ic_boxHtml= function(){
        return `
        <div id="A-${this.id}" class="Article flex aspect-[8/1] w-full border-t border-l border-1 border-black border-dashed font-bold ml-0 transition[margin-left] ease-in-out duration-300">
        </div>
        `
    }  

    ic_contentHtml= function(){
        return`
    
    
                <div class="close flex-[1_0_0%] border-r border-dashed border-black flex justify-center items-center text4 bg-gray-100" onclick="event.stopPropagation(); ic_Display.data.articles.filter(el=> el.id==${this.id})[0].deleteArticle();">x</div>
                <div id="Article-Info"  class="${this.state} flex flex-[7_0_0%] h-full items-center">
                    
                    <div id="price-box" class="${this.price.state} flex w-[50%] justify-end h-fit items-end" onclick="ic_Display.data.articles.filter(el=> el.id==${this.id})[0].editPrice(); event.stopPropagation();">
                        <div class="dinars-box text2 leading-none">0</div>
                        
                        <div class="coma text3 leading-none">,</div>
                            <div class="flex flex-col relative">
                                <div class="currency leading-none text1">${t("curr")}</div>
                                <div class="millimes-box text3 leading-none">000</div>
                            </div>
    
                    </div>
                
                
                    <div id="quantity-box" class="${this.quantity.state} flex flex-[2_7_0%] h-full items-end justify-evenly  " onclick="ic_Display.data.articles.filter(el=> el.id==${this.id})[0].editQuantity(); event.stopPropagation();">
    
                        <div class="multiply text-lg h-full flex items-end">x</div>
                        <div class="quantity text2 leading-none">22</div>
                        
                    </div>
                    <div class="number flex-[1_7_0%] h-full flex justify-center items-center border-dashed border-l border-black text-gray-500 text-xl">&#9664</div>
                </div>

            <style>

                #price-box.FOCUSED{
                    color: red;
                }
        
                #quantity-box.FOCUSED{
                    color: red;
                }
        
                #Article-Info.FOCUSED{
                    background: lightgreen;
                }
        
            </style>
    
        `
    }

    createArticleBox= function(){

        if(ic_Display.state.data== "EMPTY"){
            ic_Display.state.data= "NOT-EMPTY"
        }

        let t= document.createElement("template");
        t.innerHTML= this.ic_boxHtml();
        this.container.insertBefore(t.content, this.container.children[0]);
        this.render();
        this.swipeLeftDetect()
    };

    render=function(){
        document.getElementById(`A-${this.id}`).innerHTML= this.ic_contentHtml();
        this.renderPrice();
        this.renderQuantity();
    };

    renderPrice= function(){
        let article = document.getElementById(`A-${this.id}`)
        let activeDinars= article.children[1].children[0].children[0];
        let activeMillim = article.children[1].children[0].children[2].children[1];
        let value=  this.price.value;
        this.price.numeric= parseFloat(value)

        let splitted = value.split(".");                        //EXAMPLE:    VALUE= "6,5"  / SPLITTED= ["6","5"]
        activeDinars.innerHTML= splitted[0].padStart(1, 0);     // "6"
        activeMillim.innerHTML= splitted[1]?splitted[1].padEnd(3,0):"000";        // "500"

        if(activeDinars.innerHTML.length>3){
            activeDinars.classList.remove("text2")
            activeDinars.classList.add("text3")
            activeMillim.classList.remove("text3")
            activeMillim.classList.add("text4")
        }
        else{
            activeDinars.classList.remove("text3")
            activeDinars.classList.add("text2")   
            activeMillim.classList.remove("text4")
            activeMillim.classList.add("text3")
        }
    };

    renderQuantity= function(){
        let article= document.getElementById(`A-${this.id}`)
        let quantityText= article.children[1].children[1].children[1];

        this.quantity.numeric= parseFloat(this.quantity.value);
        quantityText.innerHTML= this.quantity.value.padStart(2,0)
    };

    deleteArticle= function(){

        ic_Display.data.articles= ic_Display.data.articles.filter((Article) =>!(Article.id == this.id)); //SEARCHS FOR THE ARTICLES JSON BY ITS ID
        if(ic_Display.data.articles.length==0){ //IF THERE IS NO ARTICLES THE TICKET'S STATE WILL BE EMPTY
            ic_Display.state.data= "EMPTY"
            ic_CalculatorInfoBar.setTimeValue("-:-:-")
            ic_CalculatorInfoBar.render(ic_CalculatorInfoBar.container)
        }
    
        document.getElementById(`A-${this.id}`).classList.add("ml-[200%]");

        setTimeout(()=>this.container.removeChild(document.getElementById(`A-${this.id}`)), 300)

        ic_Display.calcTicketTotal();
        ic_Display.refreshArticlesIndicator()
        ic_total.render(document.getElementById("ic_totalContainer"));
    
    };

    swipeLeftDetect= function(){
        let el= document.getElementById(`A-${this.id}`)
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
                        ic_Display.data.articles.filter(el=> el.id== this.id.split("-")[1])[0].deleteArticle();
                    }
                }
            }
        })
    }
    
    editPrice= function(){
        let prev= ic_Display.data.articles.filter(e=> e.state== "FOCUSED")[0]
        prev?.stopEdit();
        prev?.calcTotal();
        ic_total.render(document.getElementById("ic_totalContainer"))

        this.state="FOCUSED";
        this.price.state= "FOCUSED";
        this.price.mode= "REPLACE"
        this.quantity.state= "BLUR";

        this.render()
    };

    editQuantity= function(){
        let prev= ic_Display.data.articles.filter(e=> e.state== "FOCUSED")[0]
        prev?.stopEdit();
        prev?.calcTotal();
        ic_total.render(document.getElementById("ic_totalContainer"));

        this.state="FOCUSED"
        this.price.state= "BLUR";
        this.quantity.state= "FOCUSED"
        this.quantity.mode= "REPLACE"

        this.render()
    };

    stopEdit= function(){
        this.calcTotal();
        ic_total.render(document.getElementById("ic_totalContainer"));

        this.state="BLUR";
        this.price.state= "BLUR";
        this.price.mode= "REPLACE"
        this.quantity.state= "BLUR";
        this.quantity.mode= "REPLACE"
        
        this.render()
        this.renderIndicator();
    }

    calcTotal= function(){
        this.total= this.price.numeric * this.quantity.numeric
    }

    renderIndicator= function(){

        this.indicator= ic_Display.data.articles.indexOf(ic_Display.data.articles.filter(el=> el.id== this.id)[0])+1;
        document.getElementById(`A-${this.id}`).children[1].children[2].innerHTML= this.indicator;
    };

    setValue= function(path, number) { //SETS THE VALUE OF QUANTITY OR PRICE DEPENDING ON STATE AND MODE
        if (path.mode == "REPLACE") {
            path.value = number;
            path.mode = "APPEND";
    
        } else if (path.mode == "APPEND"){
            path.value += number;
        }
    }


}


let ic_Display={

    container:  null,
    state:{
        view:"SHRUNK",
        data:"EMPTY"
    },
    data:{
        articles:[],
        total: null,
        openTime:   null,
        closeTime:  null,
        date:       null,
        count:      null,
        ticketId:   null,
    },

    addArticle: function(){
        this.data.articles.push(new newArticle(counter, document.getElementById("Articles")))
        this.data.articles.filter(el=> el.id== counter)[0].createArticleBox();
        counter+= 1;

    },

    setState: function(newState){
        this.state.data= newState;
    },

    calcTicketTotal: function(){
        this.data.total= this.data.articles.filter(el=> el.valid== "YES").reduce((sum, currentVal)=> sum + currentVal.total, 0);
        ic_total.setTotalValue(this.data.total)
    },

    setOpenTime: function(){
        let now= new Date() //EXAMPLE: now= Tue Feb 06 2024 12:31:22 GMT+0100 (heure normale d’Europe centrale)
        let currentDateTime= now.toLocaleString(); // "06/02/2024 12:32:16"
        this.data.openTime= currentDateTime.split(" ")[1]; // "12:32:16"
        ic_CalculatorInfoBar.setTimeValue(this.data.openTime); // For the moment until ic_Display component is created
    },

    setCloseTime: function(){
        let now= new Date() //EXAMPLE: now= Tue Feb 06 2024 12:31:22 GMT+0100 (heure normale d’Europe centrale)
        let currentDateTime = now.toLocaleString(); // "06/02/2024 12:32:16"
        this.data.closeTime= currentDateTime.split(" ")[1]; //"12:32:16"
    },

    setTicketId: function(){
        this.data.ticketId= AppConfig.Ticket.ticketId
        /*for (let i = 0; i < 7;i++) {
            if (AppData[getEarlyDate(i)]) {
                let prevdailyTickets= AppData[getEarlyDate(i)];
                this.data.ticketId= prevdailyTickets[prevdailyTickets.length-1].ticketId+1
                break
            }else{
                this.data.ticketId=1; 
            }
        }*/
        ic_CalculatorInfoBar.setTicketId(this.data.ticketId.toFixed())
    },

    setTicketCount: function(){

        this.data.count= (this.data.articles.filter(e=> e.valid== "YES").length);
        ic_validate.setCount(this.data.count);
    },

    setTicketDate: function(){
        var today = new Date(); //GETS THE ACTUAL DATE EXAMPLE(  Tue Feb 06 2024 10:39:50 GMT+0100 (heure normale d’Europe centrale)  )
        var dd = String(today.getDate()).padStart(2, '0'); // "06"
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!    // "02"
        var yyyy = String(today.getFullYear());// "2024"
    
        this.data.date= mm + '/' + dd + '/' + yyyy; // "02/06/2024"
        ic_CalculatorInfoBar.setDateValue(this.data.date) 
    },

    refreshArticlesNumber: function(){

        let validArticles= this.data.articles.filter(el=> el.valid== "YES"); //FILTERS THE VALID ARTICLES
        validArticles.forEach(el=>{
            el.renderIndicator()    
        })
    },

    changeView: function(){
        if (this.state.view== "SHRUNK") {
            this.extendDisplay();
            this.state.view= "EXTENDED"
        }else{
            this.shrinkDisplay();
            this.state.view= "SHRUNK"
        }
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    extendDisplay: function(){ //WILL EXTEND THE CALCULATOR'S SCREEN DOWN
        let myKeyboard= document.getElementById("keyboard");
        let myScreen= document.getElementById("screen");
    
        myScreen.classList.add("!h-[97dvh]");
        myKeyboard.classList.add("down");
    },


    shrinkDisplay: function(){ //WILL SHRINK THE CALCULATOR'S SCREEN UP
        let myKeyboard= document.getElementById("keyboard"); 
        let myScreen= document.getElementById("screen");
    
        myScreen.classList.remove("!h-[97dvh]");
        myKeyboard.classList.remove("down","opacity-0");
    },


    refreshArticlesIndicator: function(){ //UPDATES THE VALUE OF ARTICLES NUMBER INDICATOR

        //COUNTS HOW MANY VALID ARTICLES IN THE CONTENT ARRAY
    
        this.setTicketCount()
    
    
        if(this.data.count < 1){ 
            ic_discard.setState("inactive");
            ic_validate.setState("inactive");
        } else{ 
            ic_discard.setState("active");
            ic_validate.setState("active");
        }
        this.refreshArticlesNumber();
    
    },


    handleDisplayClick: function(){ //IF THE SCREEN IS CLICKED WHILE "EMPTY", A NEW ELEMENT IS ADDED
        let actualEdit= this.data.articles.filter(el=> el.state== "FOCUSED")[0];
    
        if(this.state.data== "EMPTY"){ //IF THE SCREEN IS CLICKED WHILE "EMPTY", A NEW ELEMENT IS ADDED
            
    
            this.setOpenTime()
            ic_CalculatorInfoBar.render(ic_CalculatorInfoBar.container)
            this.addArticle()
            this.setState("NOT-EMPTY");
        }else{ //IF THE SCREEN IS CLICKED WHILE "NOT-EMPTY", THE CURRENT EDITING TEXT WILL LOSE FOCUS AN THE TOTAL WILL BE REFRESHED
            actualEdit?.stopEdit()
    
            this.calcTicketTotal();
            ic_total.render(document.getElementById("ic_totalContainer"));
        }
    
    },


    ic_html: function(){
        return `
        <div id="screen" class="transition-[height] duration-200 ease-in-out">
            <div id="infoBarContainer"></div>

            <div class="data-box bg-white flex-1 overflow-y-auto flex flex-col" onclick="ic_Display.handleDisplayClick()">


                    <div id="Articles" class="w-full overflow-x-hidden flex flex-col-reverse h-full"></div>


            </div>
        
            <div id="total-box" class="z-10 bg-slate-100 flex flex-row w-full aspect-[5/1] rounded-b-2xl outline outline-1 font-bold">

                <div id="ic_discardContainer" class="flex-[1_0_0%]"></div>
                <div id="ic_totalContainer" class="flex-[3_0_0%]"></div>
                <div id="ic_validateContainer" class="flex-[1_0_0%]"></div>

            </div>



        </div>
        `
    }


}








let numbers={

    container: null,
    data:{
        Btns:[],
    },

    ox_data:{
        numbers:[
            {alt:"1", path: "Ressources/keyboard keys/1.png"},
            {alt:"2", path: "Ressources/keyboard keys/2.png"},
            {alt:"3", path: "Ressources/keyboard keys/3.png"},
            {alt:"4", path: "Ressources/keyboard keys/4.png"},
            {alt:"5", path: "Ressources/keyboard keys/5.png"},
            {alt:"6", path: "Ressources/keyboard keys/6.png"},
            {alt:"7", path: "Ressources/keyboard keys/7.png"},
            {alt:"8", path: "Ressources/keyboard keys/8.png"},
            {alt:"9", path: "Ressources/keyboard keys/9.png"},
            {alt:"00", path: "Ressources/keyboard keys/00.png"},
            {alt:"0", path: "Ressources/keyboard keys/0.png"},
            {alt:".", path: "Ressources/keyboard keys/,.png"},
        ],

    },

    renderBtns: function(){
        this.createBtns()
        this.data.Btns.forEach(btn=>{
            btn.render(document.getElementById("numbers"))
        })
    },

    createBtns: function(){
        this.ox_data.numbers.forEach(e=>{
            this.data.Btns.push(new ic_numBtn(e))
        })
    }

}


class ic_numBtn {

    constructor({alt, path}){
        this.alt= alt;
        this.path= path;
    }

    container= null;



    OnclickEvent= function(number){

            if(ic_Display.state.data== "EMPTY"){ 
                //IF A NUMBER IS CLICKED WHILE THERE IS NO ARTICLE IN FOCUSED IT ADDS A NEW ARTICLE AND THE TICKET IS NO LONGER "EMPTY"
                ic_Display.addArticle()
                ic_Display.setOpenTime()
            ic_CalculatorInfoBar.render(ic_CalculatorInfoBar.container)
        
                ic_Display.state.data= "NOT-EMPTY"
            }else if(ic_Display.state.data== "NOT-EMPTY" && ic_Display.data.articles.filter(el=> el.state=="FOCUSED").length==0 && ic_Display.data.articles.filter(el=> el.valid== "NO").length==0){
                ic_Display.addArticle()
            }
        
        
            let ActualEdit=ic_Display.data.articles.filter(el=> el.state=="FOCUSED").length!=0? ic_Display.data.articles.filter(el=> el.state=="FOCUSED")[0]:ic_Display.data.articles.filter(el=> el.valid== "NO")[0];
            ActualEdit.state!="FOCUSED"?ActualEdit.editPrice():'';
        
        
            if (ActualEdit.state == "FOCUSED" && ActualEdit.price.state == "FOCUSED") { 
            //IF THE PRICE IS FOCUSED, THE CLICKED NUBER WILL BE APPEND TO PRICE VALUE
        
                if (ActualEdit.price.mode == "REPLACE") {
                    ActualEdit.price.mode == "APPEND";
                    ActualEdit.setValue(ActualEdit.price, number);
                    ActualEdit.renderPrice();
                } 
                else if(number == "."){
                //PREVENTS ADDING ANOTHER "." TO THE PRICE VALUE IF IT ALREADY HAVE ONE OR IF PRICE DOES ALREDY HAVE 2 NUMBERS
                    if(!ActualEdit.price.value.includes(".")){
                        ActualEdit.setValue(ActualEdit.price, number); 
                        ActualEdit.renderPrice();
                    } 
                }

                else if(ActualEdit.price.value.includes(".") && (ActualEdit.price.value + number).length <= 9){
                    if(ActualEdit.price.value.split(".")[1].length<3){
                        ActualEdit.setValue(ActualEdit.price, number); 
                        ActualEdit.renderPrice();
                    }
                }else{
                    if ((ActualEdit.price.value + number).length <= 5) {
                        //THIS TEST PREVENTS ADDING ANOTHER NUMBER TO PRICE VALUE IF IT ALREADY ATTEMPTED ITS MAXIMUM SIZE
                            ActualEdit.setValue(ActualEdit.price, number);
                            ActualEdit.renderPrice();
                        }
                        else if (ActualEdit.price.value.length == 4 && number.length == 2) {
                        // THIS CONDITION IS TRUE IF THE USER PRESS "00" WHILE THERE IS ONLY A PLACE FOR ONE NUMBER
                            ActualEdit.setValue(ActualEdit.price, number[0]);
                            ActualEdit.renderPrice();
                            }
                }
                      

            }
        
        
        
            else if (ActualEdit.state == "FOCUSED" && ActualEdit.quantity.state == "FOCUSED" && ActualEdit.quantity.value.length < 2 && number!="." && number!="00") {
            //IF AN ARTICLE IS FOCUSED AND ITS QUANTITY TEXT IS FOCUSED AND QUANTITY VALUE LENGTH IS LESS THAN 2 AND THE NUMBER PRESSED IS NOT "." (DEFENETLY WE CANT BUY HALF AN ARTICLE)
            
                if (ActualEdit.quantity.mode == "REPLACE") {
                    ActualEdit.setValue(ActualEdit.quantity, number);
                    ActualEdit.quantity.mode = "APPEND";
                    ActualEdit.renderQuantity();
                } else {
                    ActualEdit.setValue(ActualEdit.quantity, number);
                    ActualEdit.renderQuantity();
                }
        
            }

    };
 

    render= function(target){
        this.container= target;

        let t= document.createElement("template");
        t.innerHTML= this.ic_html();
        this.container.appendChild(t.content);  
    };


    ic_html= function(){
        return `
        <div class="aspect-square w-[90%] m-auto">
            <img class="w-full active:brightness-75" src="${this.path}" alt="${this.alt}" onclick="numbers.data.Btns.filter(e=> e.alt==this.alt)[0].OnclickEvent(this.alt)">
        </div>
        `
    }
}








let ic_validate={

    container: null,
    state: "inactive",
    count:0,

    setState: function(newState){
        this.state= newState;
        this.render(this.container);
    },


    setCount: function(newValue){
        this.count= newValue;
        this.render(this.container);
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    OnclickEvent: function(){
        if(this.count> 0){
        ic_Display.setCloseTime();
        let validContent= ic_Display.data.articles.filter(el=> el.valid== "YES"); //RETURNS VALID ARTICLES ONLY
    
        let articlesData = validContent.map(el=> {
        //RETURNS THE NECESSARY DATA FROM EACH ARTICLE
            return {
                "total"     :   el.total,
                "price"     :   el.price.numeric,
                "quantity"  :   el.quantity.numeric,
            }
    
        })
    
        dailyTickets.push({ //PUSHES A NEW JSON CONTAINING THE TICKET DATA TO THE ARRAY HOLDIN TODAY'S TOCKETS
            "content":          articlesData,
            "timeOpen":         ic_Display.data.openTime,
            "timeClose":        ic_Display.data.closeTime,
            "totalTicket":      ic_Display.data.total,
            "ticketId":         ic_Display.data.ticketId,
            "count":            ic_Display.data.count,
            "date":             ic_Display.data.date
    })
    
        ic_Display.data.articles.forEach(el=>{el.deleteArticle()})
        AppData[`${ic_Display.data.date}`]= dailyTickets;
        localStorage.setItem("AppData", JSON.stringify(AppData))
        AppConfig.Ticket.ticketId+=1;
        updateConfig();
        ic_CalculatorInfoBar.render(ic_CalculatorInfoBar.container)
        ic_Display.data.closeTime= null;
        ic_Display.setTicketId();
        ic_CalculatorInfoBar.render(ic_CalculatorInfoBar.container)
        //fillTicket();
        ic_printNav.render(document.getElementById("printNav"))
        ic_Print.setContent([dailyTickets[dailyTickets.length-1]])
        ic_Print.render(document.getElementById("ic_ticketContainer"));
        goToPrintScreen();
    }},

    ic_html: function(){
        let state= this.state;

        return `
            <div id="ic_validate" class="${state} relative flex h-full justify-center items-center" onclick="ic_validate.OnclickEvent();">
                <div class="nbrIndicator absolute w-full top-[10%] text-center z-10 text-white">${this.count}</div>
                <img class="w-[90%] absolute top-2" src="Ressources/Imgs/arrow.png">
            </div>
            
            <style>

                .nbrIndicator{
                    font-size: clamp(1rem, -0.575rem + 9.333333vw, 1.5rem);
                }

                #ic_validate.inactive{
                    filter: grayscale(1);
                    opacity: 50%;
                    transition: all 0.5s ease-in-out
                }

                #ic_validate.active{
                    filter: grayscale(0);
                    opacity: 100%;
                    transition: all 0.5s ease-in-out
                }

            </style>
        `
    }
}


let ic_Print={
    container: null,
    state:{},
    data: {
        storeName: null,
        logo: null,
        qrCode: null,
        message: null,
        ticketContent:[],
        total: null,
    },
    
    setContent:function(content){   
        this.data.ticketContent= content;
        this.setTotal();
    },

    setData: function(){
        this.data.storeName= AppConfig.Ticket.storeName;
        this.data.logo= AppConfig.Ticket.logo;
        this.data.qrCode= AppConfig.Ticket.qrCode;
        this.data.message= AppConfig.Ticket.message;
    },

    setTotal:function(){
        this.data.total= this.data.ticketContent.reduce(
            (a, b)=> a + b["totalTicket"],0
        )
    },

    renderTotal: function(){

    },
    
    render:function(target){
        this.container= target;
        let t= document.createElement("template")
        t.innerHTML= this.ic_htmlTemplate()
        t.content.getElementById("ic_contentContainer").innerHTML= this.renderContent();
        this.container.appendChild(t.content)
    },
    

    renderContent:function(){
        let list= document.createElement("div");

        this.data.ticketContent.forEach(ticket=>{
            let temp= document.createElement("template");
            temp.innerHTML+= this.createHolder(ticket);
            let lineContainer= temp.content.getElementById("lines");
            lineContainer.appendChild(this.createLines(ticket.content))
            list.appendChild(temp.content)
        })
            return list.innerHTML

    },

    createHolder: function(ticket){
        return this.ic_holderHtml(ticket.ticketId, ticket.count, ticket.totalTicket, ticket.date, ticket.timeClose)
    },


    createLines: function(lines){
        let t= document.createElement("div")
        lines.forEach(line=>{
            let tl= document.createElement("template")
            tl.innerHTML= this.ic_lineHtml(line.price, line.quantity, line.total);
            t.appendChild(tl.content)
        })
        return t
    },


    ic_holderHtml: function(tId,count,total,date,time){
        return`
        <div class="ticket overflow-auto">
                
        <div class="generalInfo mb-4 border-b-2 border-t-2 w-[85%] m-auto pb-2 pt-2 border-gray-400 border-dashed flex justify-between text-sm flex-wrap">
            <div>   
                <div id="ticketId">${t("numTicket")}: #${tId.toFixed().padStart(5,0)}</div>
                <div>${date}</div>
            </div>
            <div>
                <div id="length">${count} ${t("articles")}</div>
                <div>${time}</div>
            </div>
        </div>
        <div class="goods text-right mb-4">

            <div class="titles flex w-full justify-around ">

                <div class="w-[4.6rem] text-centr">${t("price")}</div>                    
                <div>${t("quantity")}</div>
                <div class="w-[4.6rem]">${t("total")}</div>
                
            </div>
            <div class="data justify-center mt-3 mb-3 relative z-10">
                <div id="lines">
                </div>

            </div>
            <div class="totalTicket flex justify-between w-[85%] m-auto mt-3 mb-3 border-t-2 border-dashed border-gray-400">
                <div class="font-bold">${t("total")}:</div>
                <div id="TotalVal" class="font-bold">${total.toFixed(3)} ${t("curr")}</div>
            </div>
            
        </div>    

    </div>
`
},


    ic_lineHtml: function(price,quantity,total){
        return`
        <div class="ligne aspect-[14/1] w-full flex justify-evenly">
            <div id="Price" class="w-[4.6rem]">${price.toFixed(3)}</div> 
            <div class="border border-black"></div>
            <div id="Qte" class="w-[1.25rem]">${quantity}</div>
            <div class="border border-black"></div>
            <div id="Tot.u" class="w-[4.6rem] text-right">${total.toFixed(3)}</div>
        </div>
        `
    },


    ic_htmlTemplate: function(){
        return`
            <div class="ticketHead p-4" dir="${dir()}">
                <div class="flex w-[85%] m-auto gap-[5%]">
                    <div class="logo w-[6rem] flex items-center">
                        <img src="${this.data.logo}">
                    </div>
                    <div class="storeName font-black text2 text-center m-auto">${this.data.storeName}</div>
                </div>
            </div>
        
            <div id="ic_contentContainer" dir="${dir()}"></div>
            <div id="ticketFoot" class="" dir="${dir()}">
                <div id="allTotal" class="w-full font-extrabold w-[85%] m-auto border border-black h-[3rem] leading-[3rem] flex justify-around text4">
                    <div>${t("paidAmmount")}: </div>
                    <div>${this.data.total.toFixed(3)} ${t("curr")}</div>
                </div>

                <div class="flex w-[85%] justify-between m-auto mt-4 mb-4">
                    <div id="qrCode" class="m-auto w-[20%]">
                        <img src="${this.data.qrCode}" >
                    </div>
            
                    <div id="msg" class="text-center w-[70%] h-fit m-auto">${this.data.message}</div>
                </div>
            </div>
        `
    },

    
    
}


let ic_printNav={

    container: null,
    data:{},

    state:{
        mode: "light"
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html()
    },

    OnReturnClick: function(){
        this.container.parentElement.classList.add("hidden");
        document.getElementById("calculator").classList.remove("hidden");

        this.container.parentElement.innerHTML=`
            <div id="printNav"></div>
            <div id="ic_ticketContainer" class="overflow-auto"></div>
        `
        setScreenHeight()
    },

    OnPrintClick: function(){
        this.container.classList.add("hidden")
        window.print();
        this.container.classList.remove("hidden")
    },

    ic_html: function(){
        return` 
        
        <div id="printNav" class="flex justify-between border-b-2 border-gray-400 w-full items-center pl-4 pr-4 sticky top-0 bg-white z-20 aspect-[9/1]">
            <div class="return" onclick="ic_printNav.OnReturnClick()">
                &#8592; ${t("return")} 
            </div>
            <div id="ic_dateFilterContainer" class="border"></div>
            <div class="printBtn" onclick="ic_printNav.OnPrintClick()">
            ${t("print")} &#8594;
            </div>
        </div>

        `
    },
}







let ic_historyIco={

    container: null,

    render: function(target){
        this.container= target;
        this.container.innerHTML+= this.ic_html();
    },


    OnclickEvent: function(){
        ic_historyNav.render(document.getElementById("printNav"))
        ic_historyPrint.setContent(dailyTickets)
        ic_historyPrint.render(document.getElementById("ic_ticketContainer"))
        ic_dateFilter.getOptions()
        ic_dateFilter.render(document.getElementById("ic_dateFilterContainer"))
        goToPrintScreen();
    },


    ic_html:function(){
        return `
        <div onclick="ic_historyIco.OnclickEvent()">
            <img id="historyIco" class="span-1 h-[70%] ml-auto mr-auto" src="Ressources/Imgs/History.png">
        </div>
        `
    }
}


let ic_historyNav={

    data:{},

    state:{
        mode: "light"
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html() 
    },

    OnReturnClick: function(){
        this.container.parentElement.classList.add("hidden");
        document.getElementById("calculator").classList.remove("hidden");

        this.container.parentElement.innerHTML=`
            <div id="printNav"></div>
            <div id="ic_ticketContainer" class="overflow-auto"></div>
        `
        setScreenHeight()
    },

    OnPrintClick: function(){
        this.container.classList.add("hidden")
        window.print();
        this.container.classList.remove("hidden")
    },

    ic_html: function(){
        return` 
        
        <div id="settingsNav" class="flex justify-between border-b-2 border-gray-400 w-full items-center pl-4 pr-4 sticky top-0 bg-white z-20 aspect-[9/1]">
            <div class="return" onclick="ic_historyNav.OnReturnClick()">
                &#8592; ${t("return")} 
            </div>
            <div id="ic_dateFilterContainer" class="border border-2 border-sky-500 rounded w-[40%]"></div>
            <div class="printBtn" onclick="ic_historyNav.OnPrintClick()">
            ${t("print")} &#8594;
            </div>
        </div>

        `
    },
}


let ic_dateFilter={
    container: null,
    state:{},
    data:{
        options: null,
        value: null,
    },

    render:function(target){
        this.container = target;

        let t= document.createElement("template")
        t.innerHTML= this.ic_html()
        t.content.querySelectorAll("#ic_dateFilter")[0].innerHTML+= this.createOptions();
        this.container.appendChild(t.content.querySelector("#ic_dateFilter"));
    },

    getOptions: function(){
        this.data.options= Object.keys(AppData);
    },

    createOptions:function(){
        let t= document.createElement("div")
        this.data.options.forEach(o=>{
            t.innerHTML+= `<option value="${o}">${o}</option>`
        })
        return t.innerHTML
    },

    OnchangeEvent: function(){
        this.data.value= this.container.children[0].value 
        ic_historyPrint.setContent(AppData[this.data.value])
        document.getElementById("ic_ticketContainer").innerHTML=``
        ic_historyNav.render(document.getElementById("printNav"))
        ic_dateFilter.render(document.getElementById("ic_dateFilterContainer"))
        ic_historyPrint.render(ic_historyPrint.container)
        ic_historyPrint.renderContent()
    },

    ic_html: function(){
        return`
        <select dir="${dir()}" id="ic_dateFilter" onchange="ic_dateFilter.OnchangeEvent()" class="w-full">
            <option value="" disabled selected>${t("selectDate")}</option>
        </select>
        `
    },

}


let ic_historyPrint={
    container: null,
    state:{},
    data: {
        storeName: null,
        logo: null,
        qrCode: null,
        message: null,
        ticketContent:[],
        total: null,
    },
    
    setContent:function(content){   
        this.data.ticketContent= content;
        this.setTotal();
    },

    setData: function(){
        this.data.storeName= AppConfig.Ticket.storeName;
        this.data.logo= AppConfig.Ticket.logo;
        this.data.qrCode= AppConfig.Ticket.qrCode;
        this.data.message= AppConfig.Ticket.message;
    },

    setTotal:function(){
        this.data.total= this.data.ticketContent.reduce(
            (a, b)=> a + b["totalTicket"],0
        )
    },
    
    render:function(target){
        this.container= target;
        let t= document.createElement("template")
        t.innerHTML= this.ic_htmlTemplate()
        t.content.getElementById("ic_contentContainer").innerHTML= this.renderContent();
        this.container.appendChild(t.content)
    },
    

    renderContent:function(){
        let list= document.createElement("div");

        this.data.ticketContent.forEach(ticket=>{
            let temp= document.createElement("template");
            temp.innerHTML+= this.createHolder(ticket);
            let lineContainer= temp.content.getElementById("lines");
            lineContainer.appendChild(this.createLines(ticket.content))
            list.appendChild(temp.content)
        })
            return list.innerHTML

    },

    createHolder: function(ticket){
        return this.ic_holderHtml(ticket.ticketId, ticket.count, ticket.totalTicket, ticket.date, ticket.timeClose)
    },


    createLines: function(lines){
        let t= document.createElement("div")
        lines.forEach(line=>{
            let tl= document.createElement("template")
            tl.innerHTML= this.ic_lineHtml(line.price, line.quantity, line.total);
            t.appendChild(tl.content)
        })
        return t


    },
    

    ic_holderHtml: function(tId,count,total,date,time){
        return`
        <div class="ticket overflow-auto">
                
                <div class="generalInfo mb-4 border-b-2 border-t-2 w-[85%] m-auto pb-2 pt-2 border-gray-400 border-dashed flex justify-between text-sm flex-wrap">
                    <div>   
                        <div id="ticketId">${t("numTicket")}: #${tId.toFixed().padStart(5,0)}</div>
                        <div>${date}</div>
                    </div>
                    <div>
                        <div id="length">${count} ${t("articles")}</div>
                        <div>${time}</div>
                    </div>
                </div>
                <div class="goods text-right mb-4">
    
                    <div class="titles flex w-full justify-around ">
    
                        <div class="w-[4.6rem] text-centr">${t("price")}</div>                    
                        <div>${t("quantity")}</div>
                        <div class="w-[4.6rem]">${t("total")}</div>
                        
                    </div>
                    <div class="data justify-center mt-3 mb-3 relative z-10">
                        <div id="lines">
                        </div>

                    </div>
                    <div class="totalTicket flex justify-between w-[85%] m-auto mt-3 mb-3 border-t-2 border-dashed border-gray-400">
                        <div class="font-bold">${t("total")}:</div>
                        <div id="TotalVal" class="font-bold">${total.toFixed(3)} ${t("curr")}</div>
                    </div>
                    
                </div>    

            </div>
        `
    },


    ic_lineHtml: function(price,quantity,total){
        return`
        <div class="ligne aspect-[14/1] w-full flex justify-evenly">
            <div id="Price" class="w-[4.6rem]">${price.toFixed(3)}</div> 
            <div class="border border-black"></div>
            <div id="Qte" class="w-[1.25rem]">${quantity}</div>
            <div class="border border-black"></div>
            <div id="Tot.u" class="w-[4.6rem] text-right">${total.toFixed(3)}</div>
        </div>
        `
    },


    ic_htmlTemplate: function(){
        let d= new Date()
        return`
            <div class="ticketHead p-4" dir="${dir()}">
                <div class="flex w-[85%] m-auto mb-4 gap-[5%]">
                    <div class="logo w-[6rem] flex items-center">
                        <img src="${this.data.logo}">
                    </div>
                    <div class="storeName font-black text2 text-center m-auto">${this.data.storeName}</div>
                </div>

                <div dir="${dir()}" id="allTotal" class="w-full w-[95%] m-auto border border-black h-fit leading-none justify-around p-4">
                    <div class="text1 flex justify-between leading-6">${t("date")}: <div class="font-extrabold">${d.getDate()}/${d.getMonth()}/${d.getFullYear()}</div> </div>
                    <div class="text1 flex justify-between leading-6">${t("ticketsNbr")}:<div class="font-extrabold">${this.data.ticketContent.length}</div></div>
                    <div class="text1 flex justify-between leading-6">${t("dailySales")}: <div class="font-extrabold">${this.data.total.toFixed(3)} ${t("curr")}</div></div>
                </div>

            </div>
        
            <div id="ic_contentContainer" dir="${dir()}"></div>
                <div id="ticketFoot" class="">

                </div>
        `
    },
    
    
}









let ic_settingsIco={ 

    container: null,

    render: function(target){
        this.container= target;
        this.container.innerHTML+= this.ic_html();
    },


    OnclickEvent: function(){
        let calcScreen= document.getElementById("calculator")
        let settingScreen= document.getElementById("settings")
        calcScreen.classList.add("hidden");
        settingScreen.classList.remove("hidden");

        ic_userName.setUserName(AppConfig.user.userName);
        ic_userPic.setImgUrl(AppConfig.user.userPic);

        ic_settingsNav.render(document.getElementById("settingsNav"))
        ic_userPic.render(document.getElementById("profilePic"))
        ic_userName.render(document.getElementById("nameHolder"))

        ic_languageSett.getValues();
        ic_TicketSett.render(document.getElementById("ticketSett"))
        ic_languageSett.render(document.getElementById("settLanguage"))

    },


    ic_html:function(){
        return `
        <div onclick="ic_settingsIco.OnclickEvent()">
            <img id="settingsIco" class="span-1 h-[70%] ml-auto mr-auto" src="Ressources/Imgs/settings.png">
        </div>
        `
    }
}


let ic_settingsNav={
    container: null,
    data:{
    },

    state:{
        mode: "light"
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html()   
    },

    return: function(){
        this.container.parentElement.classList.add("hidden");
        document.getElementById("calculator").classList.remove("hidden");
        setScreenHeight()
        ic_total.render(ic_total.container)
    },

    ic_html: function(){
        return` 
        
        <div id="settingsNav" class="flex justify-between border-b-2 border-gray-400 w-full items-center pl-4 pr-4 sticky top-0 bg-white z-20 aspect-[9/1]">
            <div class="return" onclick="ic_settingsNav.return()">
                &#8592; ${t("return")} 
            </div>
        </div>

        `
    },
}


ic_userPic={
    container: null,
    state:{},
    data: {
        imageUrl: null,
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    OnchangeEvent: function(elem){
        let gg= new FileReader();
        gg.readAsDataURL(elem.files[0])

        gg.onload=()=>{
            let url= gg.result;
            this.container.querySelector("#userPreview img").src= url
            this.data.imageUrl= url
            AppConfig.user.userPic= url
            updateConfig()
        }

    },

    setImgUrl:function(newValue){
        this.data.imageUrl= newValue
    },

    ic_html: function(){
        return`
        <label for="paramUser" class="block w-[30%] h-fit m-auto relative">
            <div id="userPreview" class="w-full aspect-square rounded-full border border-gray-400 overflow-hidden">
                <img src="${this.data.imageUrl}">
            </div>
            <div class="w-[22%] aspect-square rounded-full absolute bottom-0 right-2 bg-gray-400 flex items-center justify-center text-white font-extrabold text1">+</div>
        </label>

        <input id="paramUser" type="file" class="hidden" onchange="ic_userPic.OnchangeEvent(this)" accept="image/*">
        `
    }
}


ic_userName={
    container: null, 
    state: {},
    data:{
        userName:null,
    },

    render:function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html()
    },

    OnclickEvent: function(){
        let name= this.container.querySelector("label")
        let input= this.container.querySelector("#userName")
        input.removeAttribute("readonly")
    },

    OnblurEvent:function(){
        let input= this.container.querySelector("#userName")
        input.removeAttribute("readonly")
        AppConfig.user.userName= input.value
        this.setUserName(input.value)
        this.render(this.container)
        updateConfig()
    },


    setUserName:function(newValue){
        this.data.userName= newValue;
    },


    ic_html: function(){
        return`

        <div class="flex items-center justify-center gap-2 w-[50%] m-auto relative" dir="${dir()}">
            <input id="userName" type="text" placeholder="YUMURTA user" class="text-center text1 block" value="${this.data.userName}" readonly onblur="ic_userName.OnblurEvent()" onfocus="this.select();" maxlength="10">

            <label for="userName" onclick="ic_userName.OnclickEvent()" class="absolute right-0 cursor-pointer">
                <img src="Ressources/Imgs/edit.png" alt="" class="h-[20px] aspect-square opacity-[50%]">  
            </label>
            <style>
                #userName:read-only:focus{
                    outline: none;
                }
            </style>
        </div>

        `
    },

}


let ic_TicketSett={
    container: null,
    data:{
        storeName: null,
        message: null,
        ticketId: null,
        logo: null,
        Qr: null,
    },

    render:function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html()

    },

    setData:function(){
        this.data.storeName= AppConfig.Ticket.storeName;
        this.data.message= AppConfig.Ticket.message;
        this.data.ticketId= AppConfig.Ticket.ticketId;
        this.data.logo= AppConfig.Ticket.logo;
        this.data.Qr= AppConfig.Ticket.qrCode;
    },

    OnchangeLogo:function(elem){

            let gg= new FileReader();
            gg.readAsDataURL(elem.files[0])
    
            gg.onload=()=>{
                let url= gg.result;
                this.container.querySelector("#logoPreview img").src= url
                this.data.logo= url
                AppConfig.Ticket.logo= url
                updateConfig()
            }
    },

    OnchangeQr: function(elem){

        let gg= new FileReader();
        gg.readAsDataURL(elem.files[0])

        gg.onload=()=>{
            let url= gg.result;
            this.container.querySelector("#qrPreview img").src= url
            this.data.Qr= url
            AppConfig.Ticket.qrCode= url
            updateConfig()
        }
    },

    OnblurStoreName: function(){
        let input= this.container.querySelector("#storename")
        AppConfig.Ticket.storeName= input.value
        this.data.storeName= input.value
        updateConfig()
    },

    OnblurMessage: function(){
        let input= this.container.querySelector("#message")
        AppConfig.Ticket.message= input.value
        this.data.message= input.value
        updateConfig()
    },

    OnblurTicketId: function(){
        let input= this.container.querySelector("#TNumber")
        this.data.ticketId= parseInt(input.value)
        AppConfig.Ticket.ticketId= this.data.ticketId
        updateConfig()
        ic_CalculatorInfoBar.setTicketId(this.data.ticketId.toFixed())
        ic_CalculatorInfoBar.render(ic_CalculatorInfoBar.container)
        ic_Display.setTicketId()
    },

    ic_html: function(){
        return `
        <div dir="${dir()}">
            <div class="text4">${t("ticket")}</div>
            <label for="storename" class="block text1 mt-4">${t("storeName")}:</label>
            <input id="storename" type="text" value="${this.data.storeName}" class="border mt-2 border-black text1 rounded w-full h-fit p-1 pl-2" onblur="ic_TicketSett.OnblurStoreName()" onfocus="this.select();">
            
            <label for="message" class="text1 block mt-4">${t("message")}:</label>
            <input id="message" type="text" value="${this.data.message}" class="border mt-2 border-black text1 rounded w-full h-fit p-1 pl-2" onblur="ic_TicketSett.OnblurMessage()" onfocus="this.select();">
            
            <div class="mt-8 flex gap-[10%]">
                <label for="TNumber" class="text1 flex items-center">${t("numTicket")}:</label>
                <input id="TNumber" type="number" onKeyDown="if(this.value>=9999999){this.value='999999';}" value="${(this.data.ticketId).toFixed().padStart(7,0)}" class="border w-[5ch] border-black text1 flex-1 rounded h-fit p-1 pl-2" onblur="ic_TicketSett.OnblurTicketId()" onfocus="this.select();">
            </div>

            <div class="flex mt-4">
                <label for="logo" class="flex flex-col items-center justify-evenly mt-4 mb-4 w-[50%]">
                    <div class="w-fit text1">${t("logo")}:</div>
                    <div id="logoPreview" class="w-[50%] aspect-square border bg-white flex items-center justify-center text-2xl text-gray-400"><img src="${this.data.logo}"></div>
                </label>
                <input type="file" title=" " id="logo" class="block hidden w-full m-auto text-sm text-black
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-gray-700
                hover:file:bg-violet-100
                " onchange="ic_TicketSett.OnchangeLogo(this)" accept="image/*"/>


                <label for="qr" class="flex flex-col items-center justify-evenly mt-4 mb-4 w-[50%]">
                    <div class="w-fit text1">${t("qr")}:</div>
                    <div id="qrPreview" class="w-[50%] aspect-square border bg-white flex items-center justify-center text-2xl text-gray-400"><img src=${this.data.Qr}></div>
                </label>

                <input type="file" title=" " id="qr" class="block hidden w-full m-auto text-sm text-black
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-gray-700
                hover:file:bg-violet-100
                " onchange="ic_TicketSett.OnchangeQr(this)" accept="image/*"/>
            </div> 
        </div>
        `
    },

}


ic_languageSett={
    container: null,
    state:{
        arabic: "",
        french: "",
    },
    data:{
        languageVal: null,
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html()

    },

    OnchangeEvent:function(){
        
        let ele = document.getElementsByName('langue');
        for (i = 0; i < ele.length; i++) {
            if (ele[i].checked){
                this.data.languageVal= ele[i].value
                AppConfig.Language= this.data.languageVal;
                updateConfig();
            }
        }
        ic_settingsIco.OnclickEvent()
    },

    getValues: function(){

        this.data.languageVal= AppConfig.Language
        if(this.data.languageVal=="AR"){
            this.state.arabic= 'checked'
            this.state.french= ''
        }else{
            this.state.french= 'checked'
            this.state.arabic= ''
        }


    },

    ic_html: function(){
        return`
        <div dir="${dir()}">
            <div class="text4 mt-6">${t("language")}</div>
            <div class="flex justify-evenly">
                <div>
                    <input id="arabic" type="radio" value="AR" name="langue" onchange="ic_languageSett.OnchangeEvent()" ${this.state.arabic}>
                    <label for="arabic">${t("arabic")}</label>
                </div>

                <div>
                    <input id="french" type="radio" value="FR" name="langue" onchange="ic_languageSett.OnchangeEvent()" ${this.state.french}>
                    <label for="french">${t("french")}</label>
                </div>
            </div>
        </div>
        `
    },

}





let ic_carnetIco={ 

    container: null,

    render: function(target){
        this.container= target;
        this.container.innerHTML+= this.ic_html();
    },


    OnclickEvent: function(){

    },


    ic_html:function(){
        return `
        <div onclick="ic_carnetIco.OnclickEvent()" class="hidden">
            <img id="settingsIco" class="span-1 h-[70%] ml-auto mr-auto" src="Ressources/Imgs/Carnet.png">
        </div>
        `
    }
}