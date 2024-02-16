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
        let articles= Ticket.content.map(el=> (el.id));
        articles.forEach(el=>{ //DELETES THE ARTICLES FROM THE DOM ONE BY ONE
            let element= document.getElementById(`${el}`)
            deleteArticle(element.children[0]) //DELETES THE ARTICLES FROM THE DOM AND THE CONTENT JSON ONE BY ONE
        })
    
        Ticket.state= "EMPTY"; //RESET THE TICKET'S STATE TO "EMPTY"
        document.getElementsByClassName("time")[0].innerHTML= "-:-:-";

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
        ic_openTime.render(ic_openTime.container,ic_openTime.default)
        Ticket.closeTime= null;
        setTicketNbr();
        fillTicket()
        goToPrintScreen();
    }},

    ic_html: function(){
        let state= this.state;

        return `
            <div id="ic_validate" class="${state} relative flex h-full justify-center items-center" onclick="ic_validate.OnclickEvent();">
                <div class="nbrIndicator absolute bottom-[50%] max-[320px]:bottom-[40%] border w-[2rem] max-[360px]:w-[1.7rem] aspect-square max-[320px]:aspect-square bg-red-500 rounded-full text-white flex justify-center items-center">${ic_validate.count}</div>
                <img class="w-[70%] absolute top-6" src="Ressources/Imgs/arrow.png">
            </div>
            
            <style>

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


let ic_total={

    container:    null,
    state:        "initial",
    screenState:  "SHRUNK",
    total:        {numeric: 0, dinars: "0", millims: "000",},

    setState: function(newState){
        this.state= newState;
        this.render(this.container);
    },

    setSceenState: function(newState){
        this.screenState= newState;
    },

    setTotalValue: function(newValue){
        this.total.numeric= newValue;
        let strValue = (this.total.numeric).toFixed(3); //EXAMPLE: Ticket.total= 23.5  / strValue= "23.500" ;
        let splitted = strValue.split("."); //splitted= ["23","500"]
        this.total.dinars= splitted[0];
        this.total.millims= splitted[1];
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    OnclickEvent:function(){
        if (this.screenState== "SHRUNK") {
            extendScreen();
        }else{
            shrinkScreen();
        }
    },

    ic_html: function(){
        let total= this.total;
        return `
                <div id="total" class="border-l-2 border-r-2 border-gray-800 flex justify-center items-end relative h-full" onclick="ic_total.OnclickEvent()">

                    <div class="text-cyan-700 absolute left-2 top-1 text-md max-[270px]:hidden">TOTAL</div>

                    <div id="total-val " class="w-full flex flex-row justify-center h-[50%] items-end mb-2">
                        <div id="dinars-total" class="text-4xl max-[320px]:text-2xl">${total.dinars}</div>
                        <div class="coma text-4xl max-[320px]:text-2xl">,</div>

                        <div class="relative">
                        <div class="leading-none max-[320px]:text-sm absolute bottom-6 max-[320px]:bottom-5">DT</div>
                        <div id="millimes-total" class="text-2xl leading-none max-[320px]:text-xl">${total.millims}</div>
    
                        </div>
                        

                    </div>

                    <div id="extend-container" class="flex justify-center bottom absolute bottom-[-17px]" onclick="ic_total.OnclickEvent()">
                        <img src="Ressources/Imgs/extend.svg" id="extend">
                    </div>

                </div>`
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
        let actualEdit= Ticket.content.filter(el=> el.state== "FOCUSED")[0];
        let priceState= actualEdit?.price.state;
        let articleState= actualEdit?.quantity.state;

        if(Ticket.state== "EMPTY"){ //IF "NEXT" IS PRESSED WHILE THE SCREEN IS EMPTY THE OPENING TIME WILL BE SET
            
            ic_openTime.setTimeValue()
            ic_openTime.render(document.getElementById("ic_timeContainer"), ic_openTime.timeValue)
            
            addArticle()
            Ticket.state= "NOT-EMPTY"
        }

        if(actualEdit== undefined ){
            let notValid= Ticket.content.filter(el=> el.valid== "NO"); //LOOKS FOR INVALID ARTICLES
            if (notValid.length != 0) { //IF THERE IS AN INVALID ARTICLE, ITS STATE WILL CHANGE TO "FOCUSED" IT IT WILL START EDITING
                startEditing(notValid[0]);
                startEditing(notValid[0].price);
            } else{
            addArticle()
            Ticket.state= "NOT-EMPTY"
            }
        }

        else if (actualEdit.state== "FOCUSED" && priceState== "FOCUSED" && actualEdit.price.numeric !=0 && actualEdit.price.value != "." && actualEdit.price.value != "" ){
            // IF AN ARTICLE IS "FOCUSED" AND IT'S PRICE IS "FOCUSED" AND THE PRICE VALUE IS VALID, PRICE WILL BE BLUR AND QUANTITY WILL BE "FOCUSED"
            startEditing(actualEdit.quantity);
            stopEditing(actualEdit.price);
            calcEachTotal();
            calcTicketTotal();    
            ic_total.render(document.getElementById("ic_totalContainer"));

            
        }
        else if( actualEdit.state== "FOCUSED" && articleState== "FOCUSED" && actualEdit.quantity.numeric !=0 ){
            // IF AN ARTICLE IS "FOCUSED" AND IT'S QUANTITY IS "FOCUSED" AND THE PRICE VALUE IS VALID, THE ARTICLE WILL BECOME VALID AND IT WILL LOSE FOCUS
            actualEdit.valid= "YES";
            stopEditing(actualEdit);
            stopEditing(actualEdit.quantity);
            calcEachTotal();
            calcTicketTotal();    
            ic_total.render(document.getElementById("ic_totalContainer"));


            let notValid= Ticket.content.filter(el=> el.valid== "NO");
            if (notValid.length != 0) {
            //IF AN INVALID ARTICLE IS LEFT BEHIND, IT WILL BE FOCUSED NEXT
                startEditing(notValid[0]);
                startEditing(notValid[0].price);
                highlightSelectedArticle()
                highlightSelectedText()
            } else{
            //IF THE IS NO INVALID ARTICLES A NEW ARTICLE BOX WILL BE ADDED
                addArticle();
            }
    
        }
        else if(actualEdit.state== "FOCUSED" && articleState== "BLUR" && priceState== "BLUR" && actualEdit.valid== "YES"){
            stopEditing(actualEdit);
            addArticle();
        }

    
    },

    ic_html: function(){

        return`
            <div id="suivant" class="flex justify-center items-center rounded-xl border border-gray-700 bg-green-100 h-full" onclick="ic_nextBtn.OnclickEvent();">
            ->]
            </div>
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
        let ActualEdit= Ticket.content.filter(el=> el.state== "FOCUSED")[0];

        if (ActualEdit.price.state == "FOCUSED") {
            ActualEdit.price.value = ActualEdit.price.value.slice(0, -1);
            displayPrice(ActualEdit);
        } else if (ActualEdit.quantity.state== "FOCUSED") {
            ActualEdit.quantity.value = ActualEdit.quantity.value.slice(0, -1);
            displayQuantity(ActualEdit);
            if (ActualEdit.quantity.value.length == 0) {
                ActualEdit.quantity.value = "1";
                ActualEdit.quantity.mode = "REPLACE"
            }
        }
    }

    ,
    ic_html: function(){

        return`
            <div class="flex justify-center items-center rounded-xl border border-gray-700 bg-red-50 h-full" id="backspace" onclick="ic_backspace.OnclickEvent();">
                <--
            </div>    
        `
    }
}


ic_date={

    container: null,
    dateValue: null,
    
    setDateValue: function(){
        
    var today = new Date(); //GETS THE ACTUAL DATE EXAMPLE(  Tue Feb 06 2024 10:39:50 GMT+0100 (heure normale d’Europe centrale)  )
    var dd = String(today.getDate()).padStart(2, '0'); // "06"
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!    // "02"
    var yyyy = String(today.getFullYear());// "2024"

    this.dateValue= mm + '/' + dd + '/' + yyyy; // "02/06/2024"
    },

    render: function(target){
        this.setDateValue();
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    ic_html: function(){

        return `
            <div> ${this.dateValue}</div>
        `
    }

}

ic_openTime={
    container: null,
    timeValue: null,
    default: "-:-:-",

    setTimeValue: function(){
        let now= new Date() //EXAMPLE: now= Tue Feb 06 2024 12:31:22 GMT+0100 (heure normale d’Europe centrale)
        let currentDateTime= now.toLocaleString(); // "06/02/2024 12:32:16"

        this.timeValue= currentDateTime.split(" ")[1]; // "12:32:16"
    },

    render: function(target, value){
        this.container= target;
        this.container.innerHTML= this.ic_html(value);
    },

    ic_html:function(value){
        return `
            <div>${value}</div>
        `
    }
}











let ic_Ticket={ // Still not sure about it 
    
    container: null,
    state: "EMPTY",
    content:[],
    count: 0,
    id: null,
    date: null,
    openTime: null,
    closeTime:null,
    total: 0,

    setState: function(newState){
        this.state= newState;
    },

    addContent: function(newarticle){
        this.content.push(newarticle);
    },

    setCount: function(){
        this.count= (this.content.length-1 < 0)?0:(this.content.filter(el=>el.valid=="YES").length);
    },

    setDate: function(){
        let today = new Date(); //GETS THE ACTUAL DATE EXAMPLE(  Tue Feb 06 2024 10:39:50 GMT+0100 (heure normale d’Europe centrale)  )
        let dd = String(today.getDate()).padStart(2, '0'); // "06"
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!    // "02"
        let yyyy = String(today.getFullYear());// "2024"

        this.date= mm + '/' + dd + '/' + yyyy; // "02/06/2024"
    },

    addCount: function(){
        this.count= this.count+1;
    },

    setTicketId: function(){
        for (let i = 0; i < 7;i++) {
            if (localStorage[getEarlyDate(i)]) {
                let prevdailyTickets= JSON.parse(localStorage[getEarlyDate(i)]);
                this.id= prevdailyTickets[prevdailyTickets.length-1].ticketId+1
                break
            }
        }
    },

    setOpenTime: function(){
        let now= new Date() //EXAMPLE: now= Tue Feb 06 2024 12:31:22 GMT+0100 (heure normale d’Europe centrale)
        let currentDateTime = now.toLocaleString(); // "06/02/2024 12:32:16"
        let time= currentDateTime.split(" ")[1]; // "12:32:16"
        document.getElementsByClassName("time")[0].innerHTML= time;
        this.openTime= time;
    },

    setCloseTime: function(){
        let now= new Date() //EXAMPLE: now= Tue Feb 06 2024 12:31:22 GMT+0100 (heure normale d’Europe centrale)
        let currentDateTime = now.toLocaleString(); // "06/02/2024 12:32:16"
        let time= currentDateTime.split(" ")[1]; // "12:32:16"
        document.getElementsByClassName("time")[0].innerHTML= time;
        this.openTime= time;
    },

    setTotal: function(){
        this.total= this.content.filter(el=> el.valid== "YES").reduce((sum, currentVal)=> sum + currentVal.total, 0);
    },

    createArticleBox: function(ArticleId){  
        let t= document.createElement("template");
        t.innerHTML= ic_html_template(ArticleId);
        return t.content;
    },

    renderPrice: function(ArticleId){
        let article = document.getElementById(`${ArticleId}`)
        let activeDinars= article.children[1].children[0].children[0];
        let activeMillim = article.children[1].children[0].children[2].children[1];

        let value=  el.price.value;
        if(!value.includes('.')){ //IF THE VALUE OF PRICE CONTAINS A "." ALREADY IT TURNS IT INTO A FLOAT
            value= makeFloat(value);
        }
        el.price.numeric= parseFloat(value)

        let splitted = value.split(".");                        //EXAMPLE:    VALUE= "6,5"  / SPLITTED= ["6","5"]
        activeDinars.innerHTML= splitted[0].padStart(1, 0);     // "6"
        activeMillim.innerHTML= splitted[1].padEnd(3,0);        // "500"
    },

    renderQuantity: function(ArticleId){
        let article= document.getElementById(`${ArticleId}`)
        let quantityText= article.children[1].children[1].children[1];

        el.quantity.numeric= parseFloat(el.quantity.value);
        quantityText.innerHTML= el.quantity.value.padStart(2,0)
    },


    renderArticle: function(ArticleId){

        this.createArticleBox(ArticleId);
        this.renderPrice(ArticleId);
        this.renderQuantity(ArticleId);
    },


    actualEdit: function(){
        return this.content.filter(el=> el.state== "FOCUSED")
    },


    ic_html_template: function(Id){
         
        return`

            <div id="${Id}" class="Article flex min-h-[3rem] w-full border-t border-l border-1 border-black border-dashed font-bold ml-0 transition[margin-left] ease-in-out duration-300">

                <div class="close flex-[1_0_0%] border-r border-dashed border-black flex justify-center items-center text-2xl bg-gray-100" onclick="event.stopPropagation(); deleteArticle(this); setTimeout(()=>render(), 300)">x</div>
                <div  class="Article-Info flex flex-[7_0_0%] h-full items-center">
                    
                    <div class="price flex flex-[3_0_0%] justify-end h-[80%] items-end min-[360px]:items-end" onclick="editPrice(this); event.stopPropagation();">
                        <div class="dinars-box text-4xl max-[320px]:text-2xl" >0</div>
                        
                        <div class="coma text-3xl max-[320px]:text-2xl">,</div>
                            <div class="flex flex-col relative">
                                <div class="currency leading-none max-[320px]:text-sm absolute bottom-6 max-[360px]:hidden">DT</div>
                                <div class="millimes-box text-2xl leading-none max-[320px]:text-xl">000</div>
                            </div>

                    </div>
                
                
                    <div class="quantity-box flex flex-[2_7_0%] h-[80%] items-end justify-evenly min-[360px]:items-center" onclick="editQuantity(this); event.stopPropagation();">

                        <div class="multiply text-lg h-full flex items-end">x</div>
                        <div class="quantity text-4xl max-[320px]:text-2xl">22</div>
                        
                    </div>
                    <div class="number flex-[1_7_0%] h-full flex justify-center items-center border-dashed border-l border-black text-gray-500 text-xl">&#9664</div>
                </div>

            </div>
        `
    },




}


let ic_article={

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





