
import {Grade} from "./grade";
import {Gradetype} from "./gradetype";
import {Division} from "./division";
import {Staff} from "./staff";
import {Teacher} from "./teacher";
import {Subject} from "./subject";
import {Sublevel} from "./sublevel";
import {Schassign} from "./schassign";
import {School} from "./school";
import {Progressreview} from "./progressreview";

export class Progress{

  public id !: number;

  public docreated !: string;

  public domodified !: string;

  public file !: string;

  public tofrom !: string;

  public dofrom !: string;

  public description !: string;

  public topic !: string;

  public school !: School;

  public teacher !: Teacher;

  public subject !: Subject;

  public sublevel !: Sublevel;

  public grade !: Grade;

  public gradetype !: Gradetype;

  public schassign !: Schassign;

  public progressreview !: Progressreview;


  constructor(id: number, docreated: string, domodified: string, file: string, tofrom: string, dofrom: string, description: string,
              topic: string, teacher: Teacher, subject: Subject, sublevel: Sublevel, grade: Grade, gradetype: Gradetype,
              schassign: Schassign,school: School,progressreview: Progressreview) {
    this.id = id;
    this.docreated = docreated;
    this.domodified = domodified;
    this.file = file;
    this.tofrom = tofrom;
    this.dofrom = dofrom;
    this.description = description;
    this.topic = topic;
    this.teacher = teacher;
    this.subject = subject;
    this.sublevel = sublevel;
    this.grade = grade;
    this.gradetype = gradetype;
    this.schassign = schassign;
    this.school = school;
    this.progressreview = progressreview;
  }
}
