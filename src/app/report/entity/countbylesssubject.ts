export class Countbylesssubject {

  public id !: number;
  public subject !: string;
  public count !: number;
  public perecentage !: number;


  constructor(id: number, subject: string, count: number, perecentage: number) {
    this.id = id;
    this.subject = subject;
    this.count = count;
    this.perecentage = perecentage;
  }
}
