
import {Grade} from "./grade";
import {Gradetype} from "./gradetype";
import {Schtype} from "./schtype";
import {Teacher} from "./teacher";
import {Subject} from "./subject";
import {Sublevel} from "./sublevel";
import {School} from "./school";

import {Schdesignation} from "./schdesignation";

export class Schassign{

  public id !: number;

  public doassign !: string;

  public doresign !: string;

  public docreated !: string;

  public school !: School;

  public subject !: Subject;

  public sublevel !: Sublevel;

  public teacher !: Teacher;

  public schdesignation !: Schdesignation;

  public grade !: Grade;

  public gradetype !: Gradetype;

  public schtype !: Schtype;

  public domodified !: string;


  constructor(id: number, doassign: string, doresign: string, docreated: string, school: School, subject: Subject, sublevel: Sublevel, teacher: Teacher, schdesignation: Schdesignation, grade: Grade, gradetype: Gradetype, schtype: Schtype, domodified: string) {
    this.id = id;
    this.doassign = doassign;
    this.doresign = doresign;
    this.docreated = docreated;
    this.school = school;
    this.subject = subject;
    this.sublevel = sublevel;
    this.teacher = teacher;
    this.schdesignation = schdesignation;
    this.grade = grade;
    this.gradetype = gradetype;
    this.schtype = schtype;
    this.domodified = domodified;
  }
}
