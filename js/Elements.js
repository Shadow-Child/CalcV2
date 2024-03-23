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
    },

    OnclickEvent:function(){
        ic_totalZoom.setValue(this.data.total)
        ic_totalZoom.render(document.getElementById("popUpContainer"))
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
        this.container.innerHTML= ``
        this.container.classList.add("hidden")
    },

    ic_html: function(){
        return`
        <div id="totalZoom" class="relative border border-black flex justify-center h-full items-center bg-black/95" onclick="ic_totalZoom.OnclickEvent()">
            <div id="zoomBox" class="absolute w-[70vh] text-white h-[25%] rotate-90 flex flex-col justify-evenly items-center">
                <div class="text5 flex font-bold">${(this.data.value).toFixed(3)} <div class="text2">${t("curr")}</div></div>
                <div class="text6" dir="${dir()}">${0+ic_Display.data.count} ${t("articles")} </div>
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



        if(actualEdit== undefined ){
            ic_Display.addArticle();
            ic_Display.setState("NOT-EMPTY");
        }

        else if (actualEdit.state== "FOCUSED" && priceState== "FOCUSED" && actualEdit.price.numeric !=0 && actualEdit.price.value != "." && actualEdit.price.value != "" ){
            // IF AN ARTICLE IS "FOCUSED" AND IT'S PRICE IS "FOCUSED" AND THE PRICE VALUE IS VALID, PRICE WILL BE BLUR AND QUANTITY WILL BE "FOCUSED"
            actualEdit.editQuantity();
            actualEdit.calcTotal();
            ic_Display.data.articles.filter(el=> el.state=="FOCUSED")[0].valid="YES"
            ic_Display.calcTicketTotal()
   
            ic_total.render(document.getElementById("ic_totalContainer"));
            ic_total.swipeDownDetect()

            ic_Display.refreshArticlesIndicator();

        }
        else if( actualEdit.state== "FOCUSED" && articleState== "FOCUSED" && actualEdit.quantity.numeric !=0 ){
            // IF AN ARTICLE IS "FOCUSED" AND IT'S QUANTITY IS "FOCUSED" AND THE PRICE VALUE IS VALID, THE ARTICLE WILL BECOME VALID AND IT WILL LOSE FOCUS
            actualEdit.valid= "YES";
            actualEdit.stopEdit();
            actualEdit.render()
            actualEdit.renderIndicator()
            actualEdit.calcTotal();
            ic_Display.calcTicketTotal();    
            ic_total.render(document.getElementById("ic_totalContainer"));
            ic_total.swipeDownDetect()

            let notValid= ic_Display.data.articles.filter(el=> el.valid== "NO");
            if (notValid.length != 0) {
            //IF AN INVALID ARTICLE IS LEFT BEHIND, IT WILL BE FOCUSED NEXT
                notValid[0].state= "FOCUSED"
                notValid[0].price.state= "FOCUSED"
            } else{
            //IF THERE IS NO INVALID ARTICLES A NEW ARTICLE BOX WILL BE ADDED
            ic_Display.addArticle();
            }
    
        }
        else if(actualEdit.state== "FOCUSED" && articleState== "BLUR" && priceState== "BLUR" && actualEdit.valid== "YES"){
            actualEdit.stopEdit();
            ic_Display.addArticle();
        }
    

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
        <div id="A-${this.id}"  class="h-fit ml-0 transition[margin-left] ease-in-out duration-300">
            <div class="w-full h-[5px] bg-green-200"></div>
        </div>
        `
    }  

    ic_contentHtml= function(){
        return`
    
            <div class="Article flex h-fit aspect-[8/1] w-full border-t border-l border-1 border-black border-dashed font-bold">
                <div class="close flex-[1_0_0%] aspect-square h-full border-r border-dashed border-black flex justify-center items-center text4 bg-gray-100" onclick="event.stopPropagation(); ic_Display.data.articles.filter(el=> el.id==${this.id})[0].deleteArticle();">x</div>
                <div id="Article-Info"  class="${this.state}  flex flex-[7_0_0%]  items-center">
                    
                    <div id="price-box" class="${this.price.state} flex w-[50%] justify-end h-fit items-end" onclick="ic_Display.data.articles.filter(el=> el.id==${this.id})[0].editPrice(); event.stopPropagation();">
                        <div class="dinars-box text2 leading-none">0</div>
                        
                        <div class="coma text3 leading-none">,</div>
                            <div class="flex flex-col relative">
                                <div class="currency leading-none text1 absolute bottom-[90%]">${t("curr")}</div>
                                <div class="millimes-box text3 leading-none">000</div>
                            </div>
    
                    </div>
                
                
                    <div id="quantity-box" class="${this.quantity.state} flex flex-[2_7_0%] h-fit items-end justify-evenly  " onclick="ic_Display.data.articles.filter(el=> el.id==${this.id})[0].editQuantity(); event.stopPropagation();">
    
                        <div class="multiply text-lg h-full flex items-end">x</div>
                        <div class="quantity text2 leading-none">22</div>
                        
                    </div>
                    <div class="number flex-[1_7_0%] h-full flex justify-center items-center border-dashed border-l border-black text-gray-500 text-xl">&#9664</div>
                </div>
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
        this.swipeLeftDetect()
    };

    render=function(){
        document.getElementById(`A-${this.id}`).innerHTML= this.ic_contentHtml();
        this.renderPrice();
        this.renderQuantity();
    };

    renderPrice= function(){
        let article = document.getElementById(`A-${this.id}`)
        let activeDinars= article.querySelector(".dinars-box")
        let activeMillim = article.querySelector(".millimes-box")
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
        this.renderIndicator();
    };

    renderQuantity= function(){
        let article= document.getElementById(`A-${this.id}`)
        let quantityText= article.querySelector(".quantity");

        this.quantity.numeric= parseFloat(this.quantity.value);
        quantityText.innerHTML= this.quantity.value.padStart(2,0)
        this.renderIndicator();
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
        ic_total.swipeDownDetect()
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
        ic_total.swipeDownDetect()

        this.state="FOCUSED";
        this.price.state= "FOCUSED";
        this.price.mode= "REPLACE"
        this.quantity.state= "BLUR";

        this.render()
        //ic_Display.refreshArticlesIndicator();

    };

    editQuantity= function(){
        let prev= ic_Display.data.articles.filter(e=> e.state== "FOCUSED")[0]
        prev?.stopEdit();
        prev?.calcTotal();
        ic_total.render(document.getElementById("ic_totalContainer"));
        ic_total.swipeDownDetect()

        this.state="FOCUSED"
        this.price.state= "BLUR";
        this.quantity.state= "FOCUSED"
        this.quantity.mode= "REPLACE"

        this.render()
        //ic_Display.refreshArticlesIndicator();
        this.renderIndicator();
    };

    stopEdit= function(){
        this.calcTotal();
        ic_total.render(document.getElementById("ic_totalContainer"));
        ic_total.swipeDownDetect()
        let prev= ic_Display.data.articles.filter(e=> e.state== "FOCUSED")[0]
        this.state="BLUR";
        this.price.state= "BLUR";
        this.price.mode= "REPLACE"
        this.quantity.state= "BLUR";
        this.quantity.mode= "REPLACE"

        if(prev.valid== "YES"){
            this.render()
        }
        
        prev.calcTotal();
        ic_Display.calcTicketTotal()
        
        //ic_Display.refreshArticlesIndicator();

    }

    calcTotal= function(){
        this.total= this.price.numeric * this.quantity.numeric
    }

    renderIndicator= function(){

        this.indicator= ic_Display.data.articles.indexOf(ic_Display.data.articles.filter(el=> el.id== this.id)[0])+1;
        document.getElementById(`A-${this.id}`).querySelector(".number").innerHTML= this.indicator;
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
        //this.data.articles.filter(el=> el.id== counter)[0].render();
        //counter+= 1;

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
            //actualEdit?.stopEdit()
    
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

                ic_Display.data.articles.filter(el=> el.id== counter)[0].render();
                counter+= 1;

                ic_Display.setOpenTime()
                ic_CalculatorInfoBar.render(ic_CalculatorInfoBar.container)
        
                ic_Display.state.data= "NOT-EMPTY"

            }else if(ic_Display.state.data== "NOT-EMPTY" && ic_Display.data.articles.filter(el=> el.state=="FOCUSED").length==0 && ic_Display.data.articles.filter(el=> el.valid== "NO").length==0){
                
                ic_Display.addArticle()
                counter+= 1;

                ic_Display.data.articles.filter(el=> el.id== counter)[0].render();

                

            } else if(ic_Display.state.data== "NOT-EMPTY" && ic_Display.data.articles.filter(el=> el.state=="FOCUSED").length!=0){
                ic_Display.data.articles.filter(el=> el.state=="FOCUSED")[0].render();
                counter+= 1;
                ic_Display.data.articles.filter(el=> el.state=="FOCUSED")[0].valid="YES"

                //ic_Display.refreshArticlesIndicator();
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
                    ActualEdit.calcTotal()
                    ic_Display.calcTicketTotal()
                    ic_total.render(document.getElementById("ic_totalContainer"))
                    ic_total.swipeDownDetect()
                } else {
                    ActualEdit.setValue(ActualEdit.quantity, number);
                    ActualEdit.renderQuantity();
                    ActualEdit.calcTotal()
                    ic_Display.calcTicketTotal()
                    ic_total.render(document.getElementById("ic_totalContainer"))
                    ic_total.swipeDownDetect()
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
    
        ic_Print.setContent([{ //PUSHES A NEW JSON CONTAINING THE TICKET DATA TO THE ARRAY HOLDIN TODAY'S TOCKETS
            "content":          articlesData,
            "timeOpen":         ic_Display.data.openTime,
            "timeClose":        ic_Display.data.closeTime,
            "totalTicket":      ic_Display.data.total,
            "ticketId":         ic_Display.data.ticketId,
            "count":            ic_Display.data.count,
            "date":             ic_Display.data.date
    }])
    
        ic_printNav.render(document.getElementById("printNav"))
        ic_Print.render(document.getElementById("ic_ticketContainer"));
        ic_printFunBar.render(document.getElementById("functionBar"))
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


    description: function(name){
        this.container.querySelector("#TDescription").innerHTML=`
            <div>${t("clientName")}: </div>  <div>${name}</div>
        `
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
        <div class="ticket overflow-auto text1">
                
        <div class="generalInfo mb-4 border-b-2 border-t-2 gap-[5%] w-[85%] m-auto pb-2 pt-2 border-gray-400 border-dashed flex justify-between flex-wrap">
  
                <div>${date}</div>
                <div>${time}</div>
                <div id="ticketId">${t("numTicket")}: #${tId.toFixed().padStart(5,0)}</div>

        </div>
        <div class="goods text-right mb-4">

            <div class="titles flex w-full justify-around">

                <div class="w-[4.6rem] text-centr font-bold">${t("price")}</div>                    
                <div class="font-bold">${t("quantity")}</div>
                <div class="w-[4.6rem] font-bold">${t("total")}</div>
                
            </div>
            <div class="data justify-center mt-3 mb-3 relative z-10">
                <div id="lines">
                </div>

            </div>
            <div class="totalTicket flex justify-around w-full mt-3 pt-3 mb-3 border-t-2 border-dashed border-gray-400">
                <div id="length" class="w-[4.6rem] font-bold">${t("articles")}</div>
                <div id="lengthNum" class="w-[1.25rem]">${count} </div>
                <div id="TotalVal" class="w-[4.6rem] font-bold" >${total.toFixed(3)}</div>
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
            <div class="ticketHead m-4 relative" dir="${dir()}">

                <div class="flex items-center w-full gap-[5%]">
                    <div class="logo w-[20%] h-[20%] flex items-center justify-center">
                        <img src="${this.data.logo}">
                    </div>
                    <div class="storeName font-black text3 text-center m-auto">${this.data.storeName}</div>
                </div>
            </div>
        
            <div id="ic_contentContainer" dir="${dir()}"></div>
            <div id="ticketFoot" class="text1" dir="${dir()}">
                <div id="allTotal" class="w-[80%] font-extrabold p-4 m-auto border border-black h-fit leading-[2rem] text4">
                    <div class="flex justify-between">
                        <div>${t("paidAmmount")}: </div>
                        <div>${this.data.total.toFixed(3)} ${t("curr")}</div>
                    </div>

                    <div id="TDescription" class="flex justify-between"></div>
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

        this.container.innerHTML=``
        document.getElementById("ic_ticketContainer").innerHTML=``
        document.getElementById("functionBar").innerHTML=``

        setScreenHeight()
    },

    ic_html: function(){
        return` 
        
        <div id="printNav" class="flex justify-between border-b-2 border-gray-400 w-full items-center pl-4 pr-4 sticky top-0 bg-white z-20 aspect-[9/1]">
            <div class="return" onclick="ic_printNav.OnReturnClick()">
                &#8592; ${t("return")} 
            </div>
            <div id="ic_dateFilterContainer" class="border"></div>
        </div>

        `
    },
}



let ic_printFunBar={
    container: null,
    data:{},
    state:{},

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    OnValidClick:function(){
        dailyTickets.unshift(ic_Print.data.ticketContent[0])
        ic_Display.data.articles.forEach(el=>{el.deleteArticle()})
        AppData.tickets[`${ic_Display.data.date}`]= dailyTickets;
        AppConfig.Ticket.ticketId+=1;
        ic_Display.setTicketId();
        updateData();
        updateConfig();
        ic_Display.data.closeTime= null;
        ic_CalculatorInfoBar.render(ic_CalculatorInfoBar.container)
        ic_printNav.OnReturnClick()
    },

    OnCreditClick:function(){
        ic_addCarnetPopup.getOptions()
        ic_addCarnetPopup.render(document.getElementById("popUpContainer"))
        document.getElementById("popUpContainer").classList.remove("hidden")
    },

    OnPrintClick: function(){
        this.container.classList.add("hidden")
        ic_printNav.container.classList.add("hidden")
        window.print();
        ic_printNav.container.classList.remove("hidden")
        this.container.classList.remove("hidden")
        this.OnValidClick()
    },

    ic_html: function(){
        return`
        <div class="bg-sky-50 flex border h-full">
            <div class="border flex-1 flex justify-center items-center" onclick="ic_printFunBar.OnValidClick()">${t("done")}</div>
            <div class="border flex-1 flex justify-center items-center" onclick="ic_printFunBar.OnCreditClick()">${t("credit")}</div>
            <div class="border flex-1 flex justify-center items-center" onclick="ic_printFunBar.OnPrintClick()">${t("print")}</div>
        </div>
        `
    },

}



let ic_historyFunBar={
    container: null,
    data:{},
    state:{},

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    OnPrintClick: function(){
        this.container.classList.add("hidden")
        ic_historyNav.container.classList.add("hidden")
        window.print();
        ic_historyNav.container.classList.remove("hidden")
        this.container.classList.remove("hidden")
    },

    ic_html: function(){
        return`
        <div class="bg-sky-50 flex border h-full">
            <div class="border flex-1 flex justify-center items-center" onclick="ic_historyFunBar.OnPrintClick()">${t("print")}</div>
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
        ic_historyPrint.setContent(dailyTickets, ic_Display.data.date)
        ic_historyPrint.render(document.getElementById("ic_ticketContainer"))
        ic_dateFilter.getOptions()
        ic_dateFilter.render(document.getElementById("ic_dateFilterContainer"))
        goToPrintScreen();
        ic_historyFunBar.render(document.getElementById("functionBar"))
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

    state:{},

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html() 
    },

    OnReturnClick: function(){
        this.container.parentElement.classList.add("hidden");
        document.getElementById("calculator").classList.remove("hidden");

        this.container.innerHTML=``
        document.getElementById("ic_ticketContainer").innerHTML=``
        setScreenHeight()
    },

    OnPrintClick: function(){
        this.container.classList.add("hidden")
        window.print();
        this.container.classList.remove("hidden")
    },

    ic_html: function(){
        return` 
        
        <div id="historyNav" class="flex justify-between border-b-2 border-gray-400 w-full items-center pl-4 pr-4 sticky top-0 bg-white z-20 aspect-[9/1]">
            <div class="return" onclick="ic_historyNav.OnReturnClick()">
                &#8592; ${t("return")} 
            </div>
            <div id="ic_dateFilterContainer" class="border border-2 border-sky-500 rounded w-[40%]"></div>
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
        this.data.options= Object.keys(AppData.tickets);
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
        ic_historyPrint.setContent(AppData.tickets[this.data.value],this.data.value)
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
        date: null,
    },
    
    setContent:function(content,date){   
        this.data.ticketContent= content;
        this.data.date= date
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
        <div class="ticket overflow-auto text1">
                
                <div class="generalInfo mb-4 border-b-2 border-t-2 w-[85%] m-auto pb-2 pt-2 border-gray-400 border-dashed">
                    <div class="flex justify-between gap-[5%] flex-wrap">   
                        <div>${time}</div>
                        <div>${date}</div>
                        <div id="ticketId">${t("numTicket")}: #${tId.toFixed().padStart(5,0)}</div>
                    </div>

                </div>
                <div class="goods text-right mb-4">
    
                    <div class="titles flex w-full justify-around font-bold">
    
                        <div class="w-[4.6rem] text-centr">${t("price")}</div>                    
                        <div class=>${t("quantity")}</div>
                        <div class="w-[4.6rem]">${t("total")}</div>
                        
                    </div>
                    <div class="data justify-center mt-3 mb-3 relative z-10">
                        <div id="lines">
                        </div>

                    </div>
                    <div class="totalTicket flex font-bold justify-around w-full pt-3 mt-3 mb-3 border-t-2 border-dashed border-gray-400">
                        <div id="length" class="w-[4.6rem]">${t("articles")}</div>
                        <div id="length" class="w-[1.25rem]">${count}</div>
                        <div id="TotalVal" class="w-[4.6rem]">${total.toFixed(3)}</div>
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
            <div class="ticketHead m-4 relative" dir="${dir()}">

                <div class="flex w-full  mb-4 gap-[5%] items-center">
                    <div class="logo w-[20%] h-[20%] flex items-center">
                        <img src="${this.data.logo}">
                    </div>
                    <div class="storeName font-black text3 text-center m-auto">${this.data.storeName}</div>
                </div>

                <div dir="${dir()}" id="allTotal" class="text1 w-full w-[95%] m-auto border border-black h-fit leading-none justify-around p-4">
                    <div class="flex justify-between leading-6">${t("date")}: <div class="font-extrabold">${this.data.date}</div> </div>
                    <div class="flex justify-between leading-6">${t("ticketsNbr")}:<div class="font-extrabold">${this.data.ticketContent.length}</div></div>
                    <div class="flex justify-between leading-6">${t("dailySales")}: <div class="font-extrabold">${this.data.total.toFixed(3)} ${t("curr")}</div></div>
                </div>

            </div>
        
            <div id="ic_contentContainer" class="flex flex-col gap-[1rem]" dir="${dir()}"></div>
            <div id="ticketFoot" class=""></div>
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

        if((elem.files[0].size/1048576)<2){
            let gg= new FileReader();
            gg.readAsDataURL(elem.files[0])
    
            gg.onload=()=>{
                let uri= gg.result;
                this.container.querySelector("#logoPreview img").src= uri
                this.data.logo= uri
                AppConfig.Ticket.logo= uri
                updateConfig()
            }
        }    
    },

    OnchangeQr: function(elem){

        if((elem.files[0].size/1048576)<2){

            let gg= new FileReader();
            gg.readAsDataURL(elem.files[0])

            gg.onload=()=>{
                let uri= gg.result;
                this.container.querySelector("#qrPreview img").src= uri
                this.data.Qr= uri
                AppConfig.Ticket.qrCode= uri
                updateConfig()
            }
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
                    <div id="logoPreview" class="w-[50%] mt-4 aspect-square border bg-white flex items-center justify-center text-2xl text-gray-400"><img src="${this.data.logo}"></div>
                </label>
                <input type="file" title=" " id="logo" class="hidden" onchange="ic_TicketSett.OnchangeLogo(this)" accept="image/*"/>


                <label for="qr" class="flex flex-col items-center justify-evenly mt-4 mb-4 w-[50%]">
                    <div class="w-fit text1">${t("qr")}:</div>
                    <div id="qrPreview" class="w-[50%] mt-4 aspect-square border bg-white flex items-center justify-center text-2xl text-gray-400"><img src=${this.data.Qr}></div>
                </label>

                <input type="file" title=" " id="qr" class="hidden" onchange="ic_TicketSett.OnchangeQr(this)" accept="image/*"/>
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
            <div class="flex justify-evenly mt-4" dir="ltr">
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





let ic_CreditIco={ 

    container: null,

    render: function(target){
        this.container= target;
        this.container.innerHTML+= this.ic_html();
    },


    OnclickEvent: function(){
        let calcScreen= document.getElementById("calculator")
        let creditScreen= document.getElementById("credit")
        calcScreen.classList.add("hidden");
        creditScreen.classList.remove("hidden");
        ic_CarnetNav.render(document.getElementById("creditNav"))

        Credit.getElements()
        Credit.data.elements.forEach(e=>{
            e.getTotal()
            e.render(document.getElementById("creditBody"))
        })

        ic_creditToolBar.render(document.getElementById("creditToolBar"))
    },


    ic_html:function(){
        return `
        <div onclick="ic_CreditIco.OnclickEvent()" class="">
            <img id="creditIco" class="span-1 h-[70%] ml-auto mr-auto" src="Ressources/Imgs/Carnet.png">
        </div>
        `
    }
}


let ic_CarnetNav={
    container: null,
    data:{},
    state:{},

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html()   
    },

    return: function(){
        this.container.parentElement.classList.add("hidden");
        document.getElementById("calculator").classList.remove("hidden");
        setScreenHeight()
        document.getElementById("creditBody").innerHTML=``
    },

    ic_html: function(){
        return` 
        
        <div id="settingsNav" class="flex justify-between border-b-2 border-gray-400 w-full items-center pl-4 pr-4 sticky top-0 bg-white z-20 aspect-[9/1]">
            <div class="return" onclick="ic_CarnetNav.return()">
                &#8592; ${t("return")} 
            </div>
        </div>

        `
    },
}



class CreditElements{
    constructor(personne){
        this.container= null;
        this.data={
            name: personne.name,
            tel: personne.Tel,
            tickets: personne.tickets,
            date: personne.dateCreation,
            total: 0
        }

    };


    render= function(target){
        this.container= target;
        this.container.innerHTML+= this.ic_html()
    };


    OnCloseClick= function(){
        Credit.refreshElements(this.data.name)
    };


    getTotal= function(){
        this.data.total= this.data.tickets.reduce((sum, currentVal)=> sum + currentVal.totalTicket, 0)
    }


    ic_html=function(){
        let ticket=this.data.tickets;
        return`
        <div class="border mb-4 mt-4" dir="${dir()}">
            <div class="p-4 flex flex-col gap-2">
                <div dir="rtl"><div class="w-fit text1" onclick="Credit.data.elements.filter(e=> e.data.name== '${this.data.name}')[0].OnCloseClick()">╳</div></div>
                <div class="flex gap-[10%]">
                    <div class="text1 w-[50%]"><strong>${t("name")}:</strong><br> ${this.data.name}</div>
                    <div class="w-[50%]"><strong>${t("telNum")}:</strong><br> ${this.data.tel}</div>
                </div>


                <div class="flex gap-[10%] text1">
                    <div class="w-[50%]"><strong>${t("ticketsNbr")}:</strong><br>${ticket.length}</div>
                    <div class="w-[50%]"><strong>${t("ammount")}:</strong> <br>${(this.data.total)?.toFixed(3)} ${t("curr")}</div>

                </div>


            </div>
            
            <div class="flex justify-center h-[3rem] text1">
                <div class="border w-[50%] flex justify-center items-center">
                    <a href="tel:${this.data.tel}">${t("call")}</a>
                </div>

                <div class="border w-[50%] flex justify-center items-center">
                    <a href="sms:${this.data.tel}?&body=Mr ${this.data.name}, votre credit crée le ${this.data.date} est maintenant de ${this.data.total.toFixed(3)} Dt,Avec un total de (${ticket.length}) Ticket(s), ${AppConfig.Ticket.storeName}: ${AppConfig.user.userName},">${t("sendSMS")}</a>
                </div>
            </div>
        </div>
        `
    }
}


let Credit={

    data:{
        elements:[],
        filter:[]
    },

    getElements: function(){
        this.data.elements=[]
        for (let el in AppData.credit){
            this.data.elements.push(new CreditElements(AppData.credit[el]))
        }
        this.data.filter= this.data.elements
    },

    refreshElements: function(cName){
        this.data.elements= this.data.elements.filter(e=> e.data.name!= cName)
        this.data.filter= this.data.filter.filter(e=> e.data.name!= cName)
        delete AppData.credit[cName]
        updateData();

        document.getElementById("creditBody").innerHTML=``
        Credit.data.filter.forEach(e=>{
            e.render(document.getElementById("creditBody"))
        })
    },

    renderFilter: function(){
        document.getElementById("creditBody").innerHTML=``
        Credit.data.filter.forEach(e=>{
            e.render(document.getElementById("creditBody"))
        })
    }
    
}


let ic_addCarnetPopup={
    container: null,
    data:{
        options:[]
    },
    state:{},

    render:function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html()
        this.container.querySelector("#creditOptions").innerHTML+= this.createOptions()
    },


    OnCloseClickEvent: function(){
        this.container.innerHTML= ``
        this.container.classList.add("hidden")
    },

    getOptions: function(){
        this.data.options= Object.keys(AppData.credit)
    },

    createOptions:function(){
        let t= document.createElement("div")
        this.data.options.forEach(o=>{
            t.innerHTML+= `<option value="${o}">${o}</option>`
        })
        return t.innerHTML
    },


    OnAddClickEvent:function(){

        let name= this.container.querySelector("#creditOptions").value
        AppData.credit[name].tickets.push(ic_Print.data.ticketContent[0])
  

        updateData();
        this.container.innerHTML= ``
        this.container.classList.add("hidden")
        ic_Print.description(name)
    },

    OnChangeEvent: function(){
        let Name= this.container.querySelector("#creditOptions").value
        this.container.querySelector("#currNum").value= AppData.credit[Name].Tel
    },


    ic_html:function(){
        return`
        <div id="addCarnetPopup" class="border border-black flex justify-center h-full items-center bg-gray-700/80" dir="${dir()}">
            <div class="w-[80%] max-w-[400px] p-4 border h-fit flex flex-col gap-[15px] bg-gray-200 ">
                <div dir="${dir()}" class="flex flex-row-reverse"><div class="w-fit" onclick="ic_addCarnetPopup.OnCloseClickEvent()">╳</div></div>
                <div class="text4">${t("addToCredit")}</div>

                <div class="flex gap-[10%] justify-between">
                    <label for="creditOptions" class="text1 flex items-center">${t("clientName")}:</label>
                    <select dir="${dir()}" id="creditOptions" onchange="ic_addCarnetPopup.OnChangeEvent()" class="w-[60%]">
                        <option value="" disabled selected>${t("selectClient")}...</option>
                    </select>
                    
                </select>
                </div>

                <div class="flex gap-[10%] justify-between">
                    <label class="text1 flex items-center">${t("telNum")}:</label>
                <input type="number" id="currNum" class="flex-1 max-w-[60%]  text1" readonly/>                
            </div>

            <div class=" flex justify-center">
                <div class="pointer-events-auto bg-sky-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500" onclick="ic_addCarnetPopup.OnAddClickEvent()">${t("add")}</div>
            </div>
            
            </div>
        </div>
        `
    }
}


let ic_creditToolBar={
    container: null,
    data: {},
    state:{},


    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    }, 

    OnchangeEvent: function(){
        let value= this.container.querySelector("#searchCredit").value
        
        Credit.data.filter= Credit.data.elements.filter(e=> e.data.name.slice(0, value.length).toLowerCase()== value)
        
        Credit.renderFilter()
    },

    OnAddClick: function(){
        ic_addClientPopup.render(document.getElementById("popUpContainer"))
    },

    
    ic_html: function(){
        return`
        <div class="flex flex-col gap-[2rem]" dir="${dir()}">
            <div>
                <label for="searchCredit">${t("search")}:</label>
                <input class="outline outline-1 pl-2 pr-2 w-fit" id="searchCredit" type="text" placeholder="${t("clientName")}" oninput="ic_creditToolBar.OnchangeEvent()"/>  
            </div>
            <div class="justify-center">
                <div class="p-4 bg-sky-300 text-white w-fit m-auto " onclick="ic_creditToolBar.OnAddClick()">+ ${t("addClient")} </div>
            </div>
        </div>
        `
    }
}



let ic_addClientPopup={
    container: null,
    data:{},
    state:{},

    render:function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html()
        this.container.classList.remove("hidden")
    },


    OnCloseClickEvent: function(){
        this.container.innerHTML= ``
        this.container.classList.add("hidden")
    },


    OnAddClickEvent:function(){

        let name= this.container.querySelector("#clientName").value
        let number= this.container.querySelector("#TelNum").value
        let date= new Date()
        let d= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
        console.log(d)
        AppData.credit[name]={
            "name": name,
            "Tel": number,
            "tickets": [],
            "dateCreation": d

        }

        console.log(d)
  

        updateData();
        this.container.innerHTML= ``
        this.container.classList.add("hidden")

        Credit.getElements()
        Credit.renderFilter()
    }
    ,


    ic_html:function(){
        return`
        <div id="addCarnetPopup" class="border border-black flex justify-center h-full items-center bg-gray-700/80" dir="${dir()}">
            <div class="w-[80%] max-w-[400px] p-4 border h-fit flex flex-col gap-[15px] bg-gray-200 ">
                <div dir="${dir()}" class="flex flex-row-reverse"><div class="w-fit" onclick="ic_addClientPopup.OnCloseClickEvent()">╳</div></div>
                <div class="text4">${t("addToCredit")}</div>

                <div class="flex gap-[10%] justify-between">
                    <label for="clientName" class="text1 flex items-center">${t("clientName")}:</label>
                    <input type="text" id="clientName" class="flex-1 text1 max-w-[60%]" required/>                
                </div>

                <div class="flex gap-[10%] justify-between">
                    <label for="TelNum" class="text1 flex items-center">${t("telNum")}:</label>
                <input type="number" id="TelNum" class="flex-1 max-w-[60%]  text1"/>                
            </div>

            <div class=" flex justify-center">
                <div class="pointer-events-auto bg-sky-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500" onclick="ic_addClientPopup.OnAddClickEvent()">${t("add")}</div>
            </div>
            
            </div>
        </div>
        `
    }
}
