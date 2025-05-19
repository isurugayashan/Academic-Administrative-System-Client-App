export class Countbygender {

  public id !: number;
  public section !: string;
  public male !: number;
  public female !: number;


  constructor(id: number, section: string, male: number, female: number) {
    this.id = id;
    this.section = section;
    this.male = male;
    this.female = female;
  }
}
