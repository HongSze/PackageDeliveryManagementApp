export class Package {
    _id?: string;
    package_id: string;
    package_title: string;
    package_weight: number | null;;
    package_destination: string;
    package_description?: string;
    isAllocated: boolean;
    package_createdAt: Date;
    driver_id: string;
  
    constructor() {
      this.package_id = '';
      this.package_title = '';
      this.package_weight = null;
      this.package_destination = '';
      this.package_description = '';
      this.isAllocated = false;
      this.package_createdAt = new Date();
      this.driver_id = '';
    }
  }