
import {Grade} from "./grade";
import {Gradetype} from "./gradetype";
import {Division} from "./division";
import {Staff} from "./staff";
import {Teacher} from "./teacher";
import {Subject} from "./subject";
import {Sublevel} from "./sublevel";
import {Progress} from "./progress";
import {Directorsubject} from "./directorsubject";
import {Reviewrating} from "./reviewrating";
import {School} from "./school";
import {Schassign} from "./schassign";

export class Progressreview{

  public id !: number;

  public docreated !: string;

  public domodified !: string;

  public comment !: string;

  public progress !: Progress;

  public subject !: Subject;

  public topic !: Subject;

  public description !: Subject;

  public sublevel !: Sublevel;

  public teacher !: Teacher;

  public school !: Schassign;

  public directorsubject !: Directorsubject;

  public reviewrating !: Reviewrating;

  public dofrom !: String;

  public tofrom !: String;


  constructor(id: number, docreated: string, domodified: string, comment: string, progress: Progress, subject: Subject,
              topic: Subject, description: Subject, sublevel: Sublevel, teacher: Teacher, school: Schassign, directorsubject: Directorsubject,
              reviewrating: Reviewrating,dofrom: string,tofrom: string) {
    this.id = id;
    this.docreated = docreated;
    this.domodified = domodified;
    this.comment = comment;
    this.progress = progress;
    this.subject = subject;
    this.topic = topic;
    this.description = description;
    this.sublevel = sublevel;
    this.teacher = teacher;
    this.school = school;
    this.directorsubject = directorsubject;
    this.reviewrating = reviewrating;
    this.dofrom = dofrom;
    this.tofrom = tofrom;
  }
}
