export class Employee {
    id: number;
    name: string;
    secondName: string;
    number: string;
    companyId: number;
    userAccountId: number;
    active: boolean;
    constructor(
        id: number,
        name: string,
        secondName: string,
        number: string,
        companyId: number,
        userAccountId: number,
        active: boolean
    ) {
        this.id = id;
        this.name = name;
        this.secondName = secondName;
        this.number = number;
        this.userAccountId = userAccountId;
        this.companyId = companyId;
        this.active = active
    }
}