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
       ic_Ticket.data.articles.forEach(el => {
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
        ic_Ticket.setCloseTime();
        let validContent= ic_Ticket.data.articles.filter(el=> el.valid== "YES"); //RETURNS VALID ARTICLES ONLY
    
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
            "timeOpen":         ic_Ticket.data.openTime,
            "timeClose":        ic_Ticket.data.closeTime,
            "totalTicket":      ic_Ticket.data.total,
            "ticketId":         ic_Ticket.data.ticketId,
            "count":            ic_Ticket.data.count,
            "date":             ic_Ticket.data.date
    })
    
        ic_Ticket.data.articles.forEach(el=>{el.deleteArticle()})
        localStorage[`${ic_Ticket.data.date}`]= JSON.stringify(dailyTickets);
        ic_Ticket.data.ticketId += 1;
        ic_openTime.render(ic_openTime.container,ic_openTime.default)
        ic_Ticket.data.closeTime= null;
        ic_Ticket.setTicketId();
        ic_TicketNumber.render(ic_TicketNumber.container);
        fillTicket();
        goToPrintScreen();
    }},

    ic_html: function(){
        let state= this.state;

        return `
            <div id="ic_validate" class="${state} relative flex h-full justify-center items-center" onclick="ic_validate.OnclickEvent();">
                <div class="nbrIndicator absolute w-full top-2 text-center z-10 text-white">${this.count}</div>
                <img class="w-[90%]" src="Ressources/Imgs/arrow.png">
            </div>
            
            <style>

                .nbrIndicator{
                    font-size: clamp(1rem, -0.675rem + 8.333333vw, 1.5rem);
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

    setTotalValue: function(newValue){
        this.data.total= newValue;
    },

    render: function(target){
        this.container= target;
        let strValue = (this.data.total).toFixed(3); //EXAMPLE: ic_Ticket.data.total= 23.5  / strValue= "23.500" ;
        let splitted = strValue.split("."); //splitted= ["23","500"]
        let dinars= splitted[0];
        let millims= splitted[1];
        this.container.innerHTML= this.ic_html(dinars,millims);
    },

    OnclickEvent:function(){
        ic_Ticket.changeView();
    },

    ic_html: function(dinars, millims){
        return `
                <div id="total" class="border-l-2 border-r-2 border-gray-800 flex justify-center items-end relative h-full" onclick="ic_total.OnclickEvent()">

                    <div class="text-cyan-700 absolute left-2 top-1 text-md max-[270px]:hidden">TOTAL</div>

                    <div id="total-val " class="w-full flex flex-row justify-center h-[50%] items-end mb-2">
                        <div id="dinars-total" class="text-4xl max-[320px]:text-2xl">${dinars}</div>
                        <div class="coma text-4xl max-[320px]:text-2xl">,</div>

                        <div class="relative">
                        <div class="leading-none max-[320px]:text-sm absolute bottom-6 max-[320px]:bottom-5">DT</div>
                        <div id="millimes-total" class="text-2xl leading-none max-[320px]:text-xl">${millims}</div>
    
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
        let actualEdit= ic_Ticket.data.articles.filter(el=> el.state== "FOCUSED")[0];
        let priceState= actualEdit?.price.state;
        let articleState= actualEdit?.quantity.state;

        if(ic_Ticket.state.data== "EMPTY"){ //IF "NEXT" IS PRESSED WHILE THE SCREEN IS EMPTY THE OPENING TIME WILL BE SET
            
            ic_Ticket.setOpenTime()
            ic_openTime.render(document.getElementById("ic_timeContainer"), ic_openTime.timeValue)
            
            ic_Ticket.addArticle();

            ic_Ticket.setState("NOT-EMPTY");
        }

        if(actualEdit== undefined ){
            let notValid= ic_Ticket.data.articles.filter(el=> el.valid== "NO"); //LOOKS FOR INVALID ARTICLES
            if (notValid.length != 0) { //IF THERE IS AN INVALID ARTICLE, ITS STATE WILL CHANGE TO "FOCUSED" IT IT WILL START EDITING
                notValid[0].editPrice();
            } else{

                ic_Ticket.addArticle();

                ic_Ticket.setState("NOT-EMPTY");
            }
        }

        else if (actualEdit.state== "FOCUSED" && priceState== "FOCUSED" && actualEdit.price.numeric !=0 && actualEdit.price.value != "." && actualEdit.price.value != "" ){
            // IF AN ARTICLE IS "FOCUSED" AND IT'S PRICE IS "FOCUSED" AND THE PRICE VALUE IS VALID, PRICE WILL BE BLUR AND QUANTITY WILL BE "FOCUSED"
            actualEdit.editQuantity();
            actualEdit.calcTotal();

            ic_Ticket.calcTicketTotal();    
            ic_total.render(document.getElementById("ic_totalContainer"));

            
        }
        else if( actualEdit.state== "FOCUSED" && articleState== "FOCUSED" && actualEdit.quantity.numeric !=0 ){
            // IF AN ARTICLE IS "FOCUSED" AND IT'S QUANTITY IS "FOCUSED" AND THE PRICE VALUE IS VALID, THE ARTICLE WILL BECOME VALID AND IT WILL LOSE FOCUS
            actualEdit.valid= "YES";
            actualEdit.stopEdit();
            actualEdit.calcTotal();
            ic_Ticket.calcTicketTotal();    
            ic_total.render(document.getElementById("ic_totalContainer"));

            let notValid= ic_Ticket.data.articles.filter(el=> el.valid== "NO");
            if (notValid.length != 0) {
            //IF AN INVALID ARTICLE IS LEFT BEHIND, IT WILL BE FOCUSED NEXT
                notValid[0].editPrice();
            } else{
            //IF THERE IS NO INVALID ARTICLES A NEW ARTICLE BOX WILL BE ADDED
            ic_Ticket.addArticle();
            }
    
        }
        else if(actualEdit.state== "FOCUSED" && articleState== "BLUR" && priceState== "BLUR" && actualEdit.valid== "YES"){
            actualEdit.stopEdit();
            ic_Ticket.addArticle();
        }
    
        refreshArticlesIndicator();
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
        let ActualEdit= ic_Ticket.data.articles.filter(el=> el.state== "FOCUSED")[0];

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


ic_date={

    container: null,
    dateValue: null,
    
    setDateValue: function(newValue){
      this.dateValue=   newValue;
    },

    render: function(target){
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

    setTimeValue: function(newValue){
        this.timeValue= newValue;
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

ic_TicketNumber={
    container: null,
    number: null,

    setNumber: function(newValue){
        this.number= newValue;
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    ic_html: function(){
        return `
            <div>#${(this.number)?.padStart(6,0)}</div>
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
        <div id="A-${this.id}" class="Article flex min-h-[3rem] w-full border-t border-l border-1 border-black border-dashed font-bold ml-0 transition[margin-left] ease-in-out duration-300">
        </div>
        `
    }  

    ic_contentHtml= function(){
        return`
    
    
                <div class="close flex-[1_0_0%] border-r border-dashed border-black flex justify-center items-center text-2xl bg-gray-100" onclick="event.stopPropagation(); ic_Ticket.data.articles.filter(el=> el.id==${this.id})[0].deleteArticle();">x</div>
                <div id="Article-Info"  class="${this.state} flex flex-[7_0_0%] h-full items-center">
                    
                    <div id="price-box" class="${this.price.state} flex flex-[3_0_0%] justify-end h-[80%] items-end min-[360px]:items-end" onclick="ic_Ticket.data.articles.filter(el=> el.id==${this.id})[0].editPrice(); event.stopPropagation();">
                        <div class="dinars-box text-4xl max-[320px]:text-2xl" >0</div>
                        
                        <div class="coma text-3xl max-[320px]:text-2xl">,</div>
                            <div class="flex flex-col relative">
                                <div class="currency leading-none max-[320px]:text-sm absolute bottom-6 max-[360px]:hidden">DT</div>
                                <div class="millimes-box text-2xl leading-none max-[320px]:text-xl">000</div>
                            </div>
    
                    </div>
                
                
                    <div id="quantity-box" class="${this.quantity.state} flex flex-[2_7_0%] h-[80%] items-end justify-evenly min-[360px]:items-center" onclick="ic_Ticket.data.articles.filter(el=> el.id==${this.id})[0].editQuantity(); event.stopPropagation();">
    
                        <div class="multiply text-lg h-full flex items-end">x</div>
                        <div class="quantity text-4xl max-[320px]:text-2xl">22</div>
                        
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

        if(ic_Ticket.state.data== "EMPTY"){
            ic_Ticket.state.data= "NOT-EMPTY"
        }

        let t= document.createElement("template");
        t.innerHTML= this.ic_boxHtml();
        this.container.insertBefore(t.content, this.container.children[0]);
        this.render();
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
        if(!value.includes('.')){ //IF THE VALUE OF PRICE CONTAINS A "." ALREADY IT TURNS IT INTO A FLOAT
            value= makeFloat(value);
        }
        this.price.numeric= parseFloat(value)

        let splitted = value.split(".");                        //EXAMPLE:    VALUE= "6,5"  / SPLITTED= ["6","5"]
        activeDinars.innerHTML= splitted[0].padStart(1, 0);     // "6"
        activeMillim.innerHTML= splitted[1].padEnd(3,0);        // "500"
    };

    renderQuantity= function(){
        let article= document.getElementById(`A-${this.id}`)
        let quantityText= article.children[1].children[1].children[1];

        this.quantity.numeric= parseFloat(this.quantity.value);
        quantityText.innerHTML= this.quantity.value.padStart(2,0)
    };

    deleteArticle= function(){

        ic_Ticket.data.articles= ic_Ticket.data.articles.filter((Article) =>!(Article.id == this.id)); //SEARCHS FOR THE ARTICLES JSON BY ITS ID
        if(ic_Ticket.data.articles.length==0){ //IF THERE IS NO ARTICLES THE TICKET'S STATE WILL BE EMPTY
            ic_Ticket.state.data= "EMPTY" 
            ic_openTime.render(document.getElementById("ic_timeContainer"), ic_openTime.default)
        }
        else {
            ic_Ticket.state.data= "NOT-EMPTY";
        }
    
        document.getElementById(`A-${this.id}`).classList.add("ml-[200%]");

        setTimeout(()=>this.container.removeChild(document.getElementById(`A-${this.id}`)), 300)

        ic_Ticket.calcTicketTotal();
        refreshArticlesIndicator()
        ic_discard.render(document.getElementById("ic_discardContainer"));
        ic_validate.render(document.getElementById("ic_validateContainer"));
        ic_total.render(document.getElementById("ic_totalContainer"));
    
    }
    
    editPrice= function(){
        let prev= ic_Ticket.data.articles.filter(e=> e.state== "FOCUSED")[0]
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
        let prev= ic_Ticket.data.articles.filter(e=> e.state== "FOCUSED")[0]
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

        this.state="BLUR"
        this.price.state= "BLUR";
        this.quantity.state= "BLUR";
        
        this.render()
    }

    calcTotal= function(){
        this.total= this.price.numeric * this.quantity.numeric
    }


    renderIndicator= function(){

        this.indicator= ic_Ticket.data.articles.indexOf(ic_Ticket.data.articles.filter(el=> el.id== this.id)[0])+1
        document.getElementById(`A-${this.id}`).children[1].children[2].innerHTML= this.indicator;
    };


}

let ic_Ticket={ //UNDER DEVELOPMENT

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
        ic_openTime.setTimeValue(this.data.openTime); // For the moment until ic_Ticket component is created
    },

    setCloseTime: function(){
        let now= new Date() //EXAMPLE: now= Tue Feb 06 2024 12:31:22 GMT+0100 (heure normale d’Europe centrale)
        let currentDateTime = now.toLocaleString(); // "06/02/2024 12:32:16"
        this.data.closeTime= currentDateTime.split(" ")[1]; //"12:32:16"


        document.getElementById("closeTime").innerHTML= this.data.closeTime; //Temporary statement 
    },

    setTicketId: function(){

        for (let i = 0; i < 7;i++) {
            if (localStorage[getEarlyDate(i)]) {
                let prevdailyTickets= JSON.parse(localStorage[getEarlyDate(i)]);
                this.data.ticketId= prevdailyTickets[prevdailyTickets.length-1].ticketId+1
                break
            }else{
                this.data.ticketId=1; 
            }
        }
        ic_TicketNumber.setNumber(this.data.ticketId.toFixed())
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
        ic_date.setDateValue(this.data.date) 
    },

    refreshArticlesNumber: function(){

        let validArticles= this.data.articles.filter(el=> el.valid== "YES"); //FILTERS THE VALID ARTICLES
        validArticles.forEach(el=>{
            el.renderIndicator()    
        })
    },

    changeView: function(){
        if (this.state.view== "SHRUNK") {
            extendScreen();
        }else{
            shrinkScreen();
        }
    },

    render: function(target){
        this.container= target;
        this.container.innerHTML= this.ic_html();
    },

    ic_html: function(){
        return `
        <div id="screen" class="transition-[height] duration-200 ease-in-out">
            <div class="info-bar flex items-center text-center aspect-[10/1] bg-slate-300 border-b border-gray-700 text-sm">
                <div id="ic_dateContainer" class="flex-[2_0_0%]"></div>
                <div id="ic_timeContainer" class="flex-[1_0_0%]"></div>
                <div id="ic_NTicket" class="flex-[2_0_0%]"></div>
            </div>

            <div class="data-box bg-white flex-1 overflow-y-auto flex flex-col" onclick="handleScreenClick()">


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

            if(ic_Ticket.state.data== "EMPTY"){ 
                //IF A NUMBER IS CLICKED WHILE THERE IS NO ARTICLE IN FOCUSED IT ADDS A NEW ARTICLE AND THE TICKET IS NO LONGER "EMPTY"
                ic_Ticket.addArticle()
                ic_Ticket.setOpenTime()
                ic_openTime.render(document.getElementById("ic_timeContainer"), ic_openTime.timeValue);
        
                ic_Ticket.state.data= "NOT-EMPTY"
            }else if(ic_Ticket.state.data== "NOT-EMPTY" && ic_Ticket.data.articles.filter(el=> el.state=="FOCUSED").length==0 && ic_Ticket.data.articles.filter(el=> el.valid== "NO").length==0){
                ic_Ticket.addArticle()
            }
        
        
            let ActualEdit= ic_Ticket.data.articles.filter(el=> el.valid== "NO").length!=0?ic_Ticket.data.articles.filter(el=> el.valid== "NO")[0]: ic_Ticket.data.articles.filter(el=> el.state=="FOCUSED")[0];
            ActualEdit.state!="FOCUSED"?ActualEdit.editPrice():'';
        
        
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






/*operators:[
    {alt:"remise", path: "Ressources/keyboard keys/1.png"},
    {alt:"next", path: "Ressources/keyboard keys/2.png"},
    {alt:"backspace", path: "Ressources/keyboard keys/3.png"},]*/
