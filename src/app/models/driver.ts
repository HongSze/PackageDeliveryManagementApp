import { Package } from './package'; 

export class Driver {
    _id?: string;
    driver_id: string;
    driver_name: string;
    driver_department: string;
    driver_licence: string;
    driver_isActive: boolean;
    driver_createdAt: Date;
    assigned_packages: Package[];

    constructor() {
        this.driver_id = '';
        this.driver_name = '';
        this.driver_department = '';
        this.driver_licence = '';
        this.driver_isActive = false;
        this.driver_createdAt = new Date();
        this.assigned_packages = [];
    }
}