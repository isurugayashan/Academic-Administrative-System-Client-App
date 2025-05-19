export class Countbyitemstatus {

  public id !: number;
  public status !: string;
  public count !: number;
  public quentity !: number;
  public perecentage !: number;
  public total !: number;


  constructor(id: number, status: string, count: number, quentity: number, perecentage: number, total: number) {
    this.id = id;
    this.status = status;
    this.count = count;
    this.quentity = quentity;
    this.perecentage = perecentage;
    this.total = total;
  }
}
