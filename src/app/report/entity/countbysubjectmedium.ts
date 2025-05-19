export class Countbysubjectmedium {

  public id !: number;
  public medium !: string;
  public count !: number;
  public perecentage !: number;


  constructor(id: number, medium: string, count: number, perecentage: number) {
    this.id = id;
    this.medium = medium;
    this.count = count;
    this.perecentage = perecentage;
  }
}
