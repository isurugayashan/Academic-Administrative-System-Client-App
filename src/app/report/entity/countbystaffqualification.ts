export class Countbystaffqualification {

  public id !: number;
  public qualification !: string;
  public count !: number;
  public percentage !: number;


  constructor(id: number, qualification: string, count: number, percentage: number) {
    this.id = id;
    this.qualification = qualification;
    this.count = count;
    this.percentage = percentage;
  }
}
