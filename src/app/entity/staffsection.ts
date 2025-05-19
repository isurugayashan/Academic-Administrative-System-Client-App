
import {Grade} from "./grade";
import {Gradetype} from "./gradetype";
import {Staff} from "./staff";
import {Section} from "./section";

export class Staffsection{

  public id !: number;

  public doassign !: string;

  public doresign !: string;

  public docreated !: string;

  public section !: Section;

  public staff !: Staff;

  public grade !: Grade;

  public gradetype !: Gradetype;

  public domodified !: string;


  constructor(id: number, doassign: string, doresign: string, docreated: string, section: Section, staff: Staff, grade: Grade, gradetype: Gradetype, domodified: string) {
    this.id = id;
    this.doassign = doassign;
    this.doresign = doresign;
    this.docreated = docreated;
    this.section = section;
    this.staff = staff;
    this.grade = grade;
    this.gradetype = gradetype;
    this.domodified = domodified;
  }
}
