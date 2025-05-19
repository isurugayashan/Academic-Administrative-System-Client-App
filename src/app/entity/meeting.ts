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


export class Meeting{

  public id !: number;

  public title !: string;

  public text !: string;

  public duration !: number;

  public startdate !: string;

  public starttime !: string;

  public endtime !: string;

  public docreated !: string;

  public domodified !: string;

  public location !: string;

  public description !: string;

  public meetingstatus !: Prostatus;

  public procategory !: Procategory;

  public staff !: Staff;

  public staffCreator !: Staff;

  public designation !: Staffdesignation;


  constructor(id: number, title: string, text: string, duration: number, startdate: string, starttime: string,
              endtime: string, docreated: string, domodified: string, location: string, description: string,
              meetingstatus: Prostatus, procategory: Procategory, staff: Staff, staffCreator: Staff, designation: Staffdesignation) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.duration = duration;
    this.startdate = startdate;
    this.starttime = starttime;
    this.endtime = endtime;
    this.docreated = docreated;
    this.domodified = domodified;
    this.location = location;
    this.description = description;
    this.meetingstatus = meetingstatus;
    this.procategory = procategory;
    this.staff = staff;
    this.staffCreator = staffCreator;
    this.designation = designation;
  }
}
