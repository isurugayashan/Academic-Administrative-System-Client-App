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

export class Notice{

  public id !: number;

  public title !: string;

  public text !: string;

  public file !: string;

  public dopublished !: string;

  public doexpired !: string;

  public noticestatus !: Noticestatus;

  public noticepriority !: Noticepriority;

  public noticecategory !: Noticecategory;

  public staffCreator !: Staff;

  public grade !: Grade;

  public gradetype !: Gradetype;


  constructor(id: number, title: string, text: string, file: string, dopublished: string, doexpired: string, noticestatus: Noticestatus, noticepriority: Noticepriority, noticecategory: Noticecategory, staffCreator: Staff, grade: Grade, gradetype: Gradetype) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.file = file;
    this.dopublished = dopublished;
    this.doexpired = doexpired;
    this.noticestatus = noticestatus;
    this.noticepriority = noticepriority;
    this.noticecategory = noticecategory;
    this.staffCreator = staffCreator;
    this.grade = grade;
    this.gradetype = gradetype;
  }
}
