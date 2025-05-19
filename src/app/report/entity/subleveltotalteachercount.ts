export class Subleveltotalteachercount {

  public id !: number;
  public sublevelName !: string;
  public subjectCount !: number;
  public maleCount !: number;
  public femaleCount !: number;
  public totalCount !: number;


  constructor(id: number, sublevelName: string, subjectCount: number, maleCount: number, femaleCount: number, totalCount: number) {
    this.id = id;
    this.sublevelName = sublevelName;
    this.subjectCount = subjectCount;
    this.maleCount = maleCount;
    this.femaleCount = femaleCount;
    this.totalCount = totalCount;
  }
}
