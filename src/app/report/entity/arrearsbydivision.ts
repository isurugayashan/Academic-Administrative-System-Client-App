export class Arrearsbydivision {

  public name!: string;
  public _1AB !: number;
  public _1C !: number;
  public type2 !: number;
  public type3 !: number;


  constructor(name: string, _AB: number, _C: number, type2: number, type3: number) {
    this.name = name;
    // @ts-ignore
    this[_1AB] = _AB;
    // @ts-ignore
    this[_1C] = _C;
    this.type2 = type2;
    this.type3 = type3;
  }
}
