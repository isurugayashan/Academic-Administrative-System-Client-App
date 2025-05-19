export class Countbydivision {

  public id !: number;
  public division !: string;
  public count !: number;
  public perecentage !: number;

  constructor(id:number,division:string,count:number,perecentage:number) {
    this.id=id;
    this.division=division;
    this.count=count;
    this.perecentage=perecentage;
  }

}
