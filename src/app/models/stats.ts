export class Stats {
    insert: number;
    retrieve: number;
    update: number;
    delete: number;
  
    constructor() {
      this.insert = 0;
      this.retrieve = 0;
      this.update = 0;
      this.delete = 0;
    }
  }