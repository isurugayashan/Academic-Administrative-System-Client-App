export class Countbyweeks {

  public dofrom!: string;
  public tofrom !: number;
  public progressCount !: number;
  public teacherCount !: number;


  constructor(dofrom: string, tofrom: number, progressCount: number, teacherCount: number) {
    this.dofrom = dofrom;
    this.tofrom = tofrom;
    this.progressCount = progressCount;
    this.teacherCount = teacherCount;
  }
}
