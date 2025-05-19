export class Countbyschstudent {

  public schStudentName!: string;
  public boys !: number;
  public girls !: number;
  public mixed !: number;


  constructor(schStudentName: string, boys: number, girls: number, mixed: number) {
    this.schStudentName = schStudentName;
    this.boys = boys;
    this.girls = girls;
    this.mixed = mixed;
  }
}
