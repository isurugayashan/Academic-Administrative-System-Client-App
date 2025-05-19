import {Title} from "./title";
import {Gender} from "./gender";
import {Civilstatus} from "./civilstatus";
import {Grade} from "./grade";
import {Qualification} from "./qualifications";
import {Empstatus} from "./empstatus";
import {Gradetype} from "./gradetype";
import {Division} from "./division";
import {Schlevel} from "./schlevel";
import {Schtype} from "./schtype";
import {Schgender} from "./schgender";
import {Schstatus} from "./schstatus";
import {Schclass} from "./schclass";
import {Schteacher} from "./schteacher";
import {Schstudent} from "./schstudent";
import {Prostatus} from "./prostatus";
import {Procategory} from "./procategory";
import {Staff} from "./staff";
import {Staffdesignation} from "./staffdesignation";
import {Noticestatus} from "./noticestatus";
import {Noticepriority} from "./noticepriority";
import {Noticecategory} from "./noticecategory";
import {Teacher} from "./teacher";
import {Subject} from "./subject";
import {Sublevel} from "./sublevel";

export class Directorsubject{

  public id !: number;

  public doassign !: string;

  public doresign !: string;

  public docreated !: string;

  public subject !: Subject;

  public sublevel !: Sublevel;

  public staff!: Staff;

  public grade !: Grade;

  public gradetype !: Gradetype;

  public domodified !: string;


  constructor(id: number, doassign: string, doresign: string, docreated: string, subject: Subject, sublevel: Sublevel, staff: Staff, grade: Grade, gradetype: Gradetype, domodified: string) {
    this.id = id;
    this.doassign = doassign;
    this.doresign = doresign;
    this.docreated = docreated;
    this.subject = subject;
    this.sublevel = sublevel;
    this.staff = staff;
    this.grade = grade;
    this.gradetype = gradetype;
    this.domodified = domodified;
  }
}
