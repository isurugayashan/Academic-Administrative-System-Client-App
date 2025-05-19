export class Countbystatus {

  public id !: number;
  public status !: string;
  public count !: number;
  public perecentage !: number;


  constructor(id: number, status: string, count: number, perecentage: number) {
    this.id = id;
    this.status = status;
    this.count = count;
    this.perecentage = perecentage;
  }
}
