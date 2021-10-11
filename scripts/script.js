class DataBase {
    constructor () {
        this.key = DATABASE_NAME || "restauranDB";
        this.keyTwo = DATABASE_ORDER || "customerOrder";
        
        if (!localStorage.getItem(this.key)) localStorage.setItem(this.key, JSON.stringify([]));
        if (!localStorage.getItem(this.keyTwo)) localStorage.setItem(this.keyTwo, JSON.stringify([]));
    }

    Create (name, price, urlPhoto) {
        const id = this.GenerateID();   //Create a id whit the date
        const product = {id, name, price, urlPhoto}
        const data = this.Read();       //Get Current Data 
        data.push(product);             //Add new Product
        this.SaveData(data);            //Save Data
        return id;                      //return id code
    }

    Update (id, name, price, urlPhoto) {
        let index = this.FilterByID(id);    //Get product position
        const data = this.Read();           //Get Current Data 

        const updateProduct = {             //update data
            id: data[index].id,
            name: name || data[index].name,
            price: price || data[index].price,
            urlPhoto: urlPhoto || data[index].urlPhoto
        }
        
        data.splice(index, 1, updateProduct);   //remplace obj
        this.SaveData(data);
    }

    Delete (id) {
        let index = this.FilterByID(id);                //Get product ID
        const updateData = this.Read();                 //Get current Data
        updateData.splice(index, 1);                    //Delete obj
        this.SaveData(updateData);                      //Save new data
    }

    // Read = () => JSON.parse(localStorage.getItem(this.key)); 
    Read = (isTrue = true) => JSON.parse(localStorage.getItem(isTrue ? this.key : this.keyTwo));
    
    FilterByID = (id) => this.Read().findIndex(obj => obj.id === id);

    // SaveData = (data) => localStorage.setItem(this.key, JSON.stringify(data));
    SaveData = (data, isTrue = true) => localStorage.setItem(isTrue ? this.key : this.keyTwo, JSON.stringify(data));

    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    GenerateID = () => '_' + Math.random().toString(36).substr(2, 9);
}

class App extends DataBase {
    constructor (sectionMenu, orderTable, modal) { 
        super(); 
        
        this.modal = modal;
        this.orderTable = orderTable;
        this.sectionMenu = sectionMenu;
        
        this.DefaultData(); 
        this.UpdateDisplay();
    }

    Modal = () => this.modal.classList.toggle('active');

    UpdateDisplay () {
        this.sectionMenu.innerHTML = this.CreateElementsHTML(true);
        this.orderTable.innerHTML = this.CreateElementsHTML(false);
    }

    CreateElementsHTML (isTrue) {
        let products = [];

        if (isTrue) {
            this.Read().forEach(obj => {
                products += ` 
                    <div class="menu-img" id="${obj.id}">
                        <img src="${obj.urlPhoto}" alt="${obj.name}" width="200">
                        <h2>${obj.name}</h2>
                    </div>
                `
            });
        } else {
            this.Read(false).forEach(obj => {
                products += ` 
                    <tr>
                        <td>${obj.id}</td>
                        <td>${obj.name}</td>
                        <td>${obj.quantity}</td>
                        <td>${obj.price}</td>
                        <td>${obj.price * obj.quantity}</td>
                        <td><button class="icon-edit" onclick="app.Modal('${obj.id}')"><i class="far fa-edit"></i></button></td>
                    </tr>
                `
            });
        }
        return products;
    };

    DefaultData () {
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

const sectionMenu = document.getElementById('menu');
const sectionOrder = document.getElementById('order');
const sectionModal = document.getElementById('modal');

const app = new App(sectionMenu, sectionOrder, sectionModal);

menu.addEventListener('click', (e) => {
    if (e.target && e.target.className === 'menu-img') {
        app.Modal();
        e.stopPropagation();
        console.log(e.target.id);
    }
});