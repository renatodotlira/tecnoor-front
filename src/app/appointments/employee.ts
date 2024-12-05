export class Employee {
    id!: number;
    name!: string;
    business_id!: string;
    constructor(
        id: number,
        name: string,
        business_id: string
    ) {
        this.id = id;
        this.name = name;
        this.business_id = business_id;
    }
}