class DataBase {
    constructor () {
        this.key = DATABASE_NAME || "restauranDB";
        
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

//_________________________________________________________________

const DATABASE_NAME = 'restauranDB';