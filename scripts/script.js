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

    ReadOne = (id, isTrue = true) => this.Read(isTrue)[this.FilterByID(id, isTrue)];

    Read = (isTrue = true) => JSON.parse(localStorage.getItem(isTrue ? this.key : this.keyTwo));
    
    FilterByID = (id, isTrue = true) => this.Read(isTrue).findIndex(obj => obj.id === id);

    SaveData = (data, isTrue = true) => localStorage.setItem(isTrue ? this.key : this.keyTwo, JSON.stringify(data));

    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    GenerateID = () => '_' + Math.random().toString(36).substr(2, 9);
}

class App extends DataBase {
    constructor () { 
        super(); 
        
        this.orderTable = document.getElementById('order');
        this.sectionMenu = document.getElementById('menu');
        
        this.DefaultData(); 
        this.UpdateDisplay();
    }

    Modal (id) {
        const node = document.getElementById('modal');

        if (node) { 
            node.remove(); 
            window.location.reload(false);
        } else { 
            const obj = this.ReadOne(id);
            const modalElement = `
                <div id="modal">
                    <div class="formulary center">
                        <h2 class="text-formulary">Festival de la gastronomia</h2>
    
                        <p>Platillo: ${obj.name}</p>
                        <p>precio:   ${obj.price}</p>
    
                        <label for="quantity">Cantidad</label>
                        <input type="number" name="quantity" placeholder="Cantidad">
    
                        <div>
                            <button name="${obj.id}" class="btn-buy">Update</button>
                            <button name="${obj.id}" class="btn-update">Cancel</button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementsByTagName('body')[0].innerHTML += modalElement;
            document.getElementById('modal').addEventListener('click', (e) => {
                if (e.target && e.target.className === 'btn-buy') this.AddToCart(e.target.name);
                if (e.target && e.target.className === 'btn-update') this.Modal();
                e.stopPropagation();
            });
        } 
    }

    AddToCart (id) {
        const order = this.ReadOne(id);
        const quantity = document.querySelector(".formulary input").value || 1;
        order.quantity = Math.abs(parseInt(quantity));
        order.idOrder = this.GenerateID();
        delete order.urlPhoto;
        
        const data = this.Read(false);
        data.push(order);
        this.SaveData(data, false);
        this.Modal();
    }

    DeleteToCart (id) {
        const index = this.Read(false).findIndex(obj => obj.idOrder === id);
        const updateData = this.Read(false);
        updateData.splice(index, 1);
        this.SaveData(updateData, false);
        this.UpdateDisplay();
    }

    UpdateDisplay () {
        this.sectionMenu.innerHTML = this.CreateElementsHTML('menu');
        this.orderTable.innerHTML = this.CreateElementsHTML('order');
    }

    CreateElementsHTML (element) {
        let products = [];

        if (element === 'menu') {
            this.Read().forEach(obj => {
                products += ` 
                    <div class="dishes" id="${obj.id}">
                        <img src="${obj.urlPhoto}" alt="${obj.name}">
                        <h2>${obj.name}</h2>
                    </div>
                `
            });

            this.sectionMenu.addEventListener('click', (e) => {
                if (e.target && e.target.className === 'dishes') {
                    this.Modal(e.target.id);
                    e.stopPropagation();
                }
            });

        } else if (element === 'order') {
            this.Read(false).forEach((obj, i) => {
                products += ` 
                    <tr>
                        <td>${i + 1}</td>
                        <td>${obj.name}</td>
                        <td>${obj.quantity}</td>
                        <td>${obj.price}</td>
                        <td>${obj.price * obj.quantity}</td>
                        <td>
                            <button class="icon-edit" name="${obj.id}"><i class="far fa-edit"></i></button>
                            <button class="icon-delete" name="${obj.idOrder}"><i class="far fa-trash-alt"></i></button>
                        </td>
                    </tr>
                `
            });

            this.orderTable.addEventListener('click', (e) => {
                if (e.target && e.target.className === 'icon-edit') this.Modal(e.target.name);
                if (e.target && e.target.className === 'icon-delete') this.DeleteToCart(e.target.name);
                e.stopPropagation();
            });

        } else { products = `<div>NO DATA</div>`; }

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
const app = new App();