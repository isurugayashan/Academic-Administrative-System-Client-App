export class Countbysectionitem {

  public id !: number;
  public name !: string;
  public actives !: number;
  public obsolete !: number;
  public damaged !: number;


  constructor(id: number, name: string, actives: number, obsolete: number, damaged: number) {
    this.id = id;
    this.name = name;
    this.actives = actives;
    this.obsolete = obsolete;
    this.damaged = damaged;
  }
}
