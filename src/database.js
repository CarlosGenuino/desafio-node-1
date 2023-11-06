import fs from 'node:fs/promises'

const URLDatabasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor(){
        fs.readFile(URLDatabasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(()=> {
            this.#persist()
        })
    }

    #persist(){
        fs.writeFile(URLDatabasePath, JSON.stringify(this.#database))
    }

    select(table){
        const data = this.#database[table] ?? []
        return data
    }

    insert(table, data) {
        data.created_at = new Date()
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data)
        }else {
            this.#database[table] = [data]
        }
        this.#persist()
    }

    delete(table, id){
      const rowIndex = this.#database[table]
      .findIndex(row => row.id = id)

      if(rowIndex > -1){
        this.#database[table].splice(rowIndex, 1)
        this.#persist()
      }
    }

    update(table, id, data) {
        const rowIndex =  this.#database[table]
        .findIndex(row => row.id = id)
  
        data.updated_at = new Date()

        if(rowIndex > -1){
          this.#database[table][rowIndex] = {id,  ...data}
          this.#persist()
        } 
    }

    findById(table, id){
        const rowIndex =  this.#database[table]
        .findIndex(row => row.id = id)

        if(rowIndex > -1){
            return this.#database[table][rowIndex] ?? {}
        }
    }
    
}