export class CountBySchtype {

  public id !: number;
  public schtype !: string;
  public count !: number;
  public perecentage !: number;

  constructor(id:number,schtype:string,count:number,perecentage:number) {
    this.id=id;
    this.schtype=schtype;
    this.count=count;
    this.perecentage=perecentage;
  }

}
