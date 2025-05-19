
import {Grade} from "./grade";
import {Gradetype} from "./gradetype";
import {Division} from "./division";
import {Staff} from "./staff";

export class Staffdivision{

  public id !: number;

  public doassign !: string;

  public doresign !: string;

  public docreated !: string;

  public division !: Division;

  public staff !: Staff;

  public grade !: Grade;

  public gradetype !: Gradetype;

  public domodified !: string;


  constructor(id: number, doassign: string, doresign: string, docreated: string, division: Division, staff: Staff, grade: Grade, gradetype: Gradetype, domodified: string) {
    this.id = id;
    this.doassign = doassign;
    this.doresign = doresign;
    this.docreated = docreated;
    this.division = division;
    this.staff = staff;
    this.grade = grade;
    this.gradetype = gradetype;
    this.domodified = domodified;
  }
}
