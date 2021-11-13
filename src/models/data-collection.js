"use strict";

// THIS IS THE STRETCH GOAL ...
// It takes in a schema in the constructor and uses that instead of every collection
// being the same and requiring their own schema. That's not very DRY!

class DataCollection {
  constructor(model) {
    this.model = model;
  }

  get(id) {
    if (id) {
      return this.model.findOne({ where: { id } });
    } else {
      return this.model.findAll();
    }
  }

  create(record) {
    return this.model.create(record);
  }

  async update(id, data) {

    try {
      const item = await this.model.findOne({ where: { id } });
      if (!item) {

        throw new Error("Error in fetching data / no data");
        
      } else {
        return await item.update(data);

      }
    } catch (err) {
      console.log(err);

    }
  }

  delete(id) {
    return this.model.destroy({ where: { id } });
    
  }
}

module.exports = DataCollection;
