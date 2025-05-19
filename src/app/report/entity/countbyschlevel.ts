export class Countbyschlevel {

  public id !: number;
  public schlevel !: string;
  public count !: number;
  public perecentage !: number;


  constructor(id: number, schlevel: string, count: number, perecentage: number) {
    this.id = id;
    this.schlevel = schlevel;
    this.count = count;
    this.perecentage = perecentage;
  }
}
