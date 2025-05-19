export class Countbyschgender {

  public id !: number;
  public gedner !: string;
  public count !: number;
  public perecentage !: number;


  constructor(id: number, gedner: string, count: number, perecentage: number) {
    this.id = id;
    this.gedner = gedner;
    this.count = count;
    this.perecentage = perecentage;
  }
}
