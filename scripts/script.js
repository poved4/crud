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
    constructor () { 
        super(); 
        
        this.orderTable = document.getElementById('order');
        this.sectionMenu = document.getElementById('menu');
        
        this.Listeners();
        this.DefaultData(); 
        this.UpdateDisplay();
    }

    Modal (id) {
        let modal = document.getElementById('modal');
        
        if (modal) { 
            modal.remove(); 
            window.location.reload(false);
        } else {
            const obj = this.Read()[this.FilterByID(id)];
            document.getElementsByTagName('body')[0].innerHTML += `
            <div class="modal active" id="modal">
                <div class="formulary center">
                    <h2 class="text-formulary">Festival de la gastronomia</h2>

                    <p>Platillo: ${obj.name}</p>
                    <p>precio:   ${obj.price}</p>

                    <label for="quantity">Cantidad</label>
                    <input type="number" name="quantity" placeholder="Cantidad">

                    <button class="btn-buy" onclick="app.AddCart('${id}')">Comprar</button>
                    <button class="btn-update" onclick="app.Modal()">Cancel</button>
                </div>
            </div>
        `;
        }
    }

    AddCart () {
        this.Modal();
        console.log('Added to cart');

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
                    <div class="menu-img" id="${obj.id}">
                        <img src="${obj.urlPhoto}" alt="${obj.name}" width="200">
                        <h2>${obj.name}</h2>
                    </div>
                `
            });
        } else if (element === 'order') {
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
        } else { products = `<div>NO DATA</div>`; }

        return products;
    };

    Listeners () {
        this.sectionMenu.addEventListener('click', (e) => {
            if (e.target && e.target.className === 'menu-img') {
                this.Modal(e.target.id);
                e.stopPropagation();
            }
        });
    }

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