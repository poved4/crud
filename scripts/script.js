class DataBase {
    constructor () {
        this.key = DATABASE_NAME || "restauranDB";
        this.keyTwo = DATABASE_ORDER || "customerOrder";
        
        if (!localStorage.getItem(this.key))  {
            const data = [];
            localStorage.setItem(this.key, JSON.stringify(data));
        }
    }

    Create (name, price, urlPhoto) {
        const id = new Date().getTime();    //Create a id whit the date
        const product = {id, name, price, urlPhoto}
        const data = this.Read();   //Get Current Data 
        data.push(product);         //Add new Product
        this.SaveData(data);        //Save Data
        return id;                  //return id code
    }

    Update (id, name, price, urlPhoto) {
        let index = this.FilterByID(parseFloat(id));    //Get product position
        const data = this.Read();   //Get Current Data 

        const updateProduct = {     //update data
            id: data[index].id,
            name: name || data[index].name,
            price: price || data[index].price,
            urlPhoto: urlPhoto || data[index].urlPhoto
        }
        
        data.splice(index, 1, updateProduct);   //remplace obj
        this.SaveData(data);
    }

    Delete(id) {
        let index = this.FilterByID(parseFloat(id));    //Get product ID
        const updateData = this.Read();                 //Get current Data
        updateData.splice(index, 1);                    //Delete obj
        this.SaveData(updateData);                      //Save new data
    }

    Read = () => JSON.parse(localStorage.getItem(this.key)); 
    
    FilterByID = (id) => this.Read().findIndex(obj => obj.id === id);

    SaveData = (data) => localStorage.setItem(this.key, JSON.stringify(data));
}

class App extends DataBase {
    constructor (sectionMenu, orderTable) { 
        super(); 
        
        this.orderTable = orderTable;
        this.sectionMenu = sectionMenu;
        
        this.DefaultData(); 
        this.UpdateDisplay();
    }

    Modal (id) {
        // this.modal.classList.toggle('active');
        // console.log('turn on modal');
        console.log(id);
    }

    UpdateDisplay () {
        this.sectionMenu.innerHTML = this.CreateElementsHTML(true);
        // this.orderTable.innerHTML = this.CreateElementsHTML(false);
    }

    CreateElementsHTML = (x) => x ? this.Dishes() : this.Order();

    Dishes() {
        let products = [];

        this.Read().forEach(obj => {
            products += ` 
                <div class="menu-img" id="${obj.id}">
                    <img src="${obj.urlPhoto}" alt="${obj.name}" width="200">
                    <h2>${obj.name}</h2>
                </div>
            `
        });

        return products;
    }

    Order() {
        let products = [];

        // this.Read().forEach(obj => {
        //     products += ` 
        //         <div class="menu-img" id="${obj.id}">
        //             <img src="${obj.urlPhoto}" alt="${obj.name}" width="200">
        //             <h2>${obj.name}</h2>
        //         </div>
        //     `
        // });

        return products;
    }

    DefaultData() {
        if (this.Read() && this.Read().length !== 0) return 
        this.Create("Menu Saludable",    15000, "img/menu-saludable.jpg");
        this.Create("Menu Italiano",     14000, "img/menu-italiano.jpg");
        this.Create("Menu Corriente",    12000, "img/menu-corriente.jpg");
        this.Create("Menu Mexicano",     25000, "img/menu-mexicano.jpg");
        this.Create("Menu Libre",        25000, "img/menu-libre.jpg");
    }
}

//_________________________________________________________________

const DATABASE_NAME = 'restauranDB';
const DATABASE_ORDER = 'customerOrder';

const menu = document.getElementById('menu');
const order = document.querySelector('order');

const app = new App(menu, order);

menu.addEventListener('click', (e) => {
    if (e.target && e.target.className === 'menu-img') {
        app.Modal(e.target.id);
        e.stopPropagation();
    }
});