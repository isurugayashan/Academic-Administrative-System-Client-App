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

export class Program{

  public id !: number;

  public topic !: string;

  public duration !: number;

  public description !: string;

  public date !: string;

  public location !: string;

  public count !: number;

  public starttime !: string;

  public endtime !: string;

  public docreated !: string;

  public domodified !: string;

  public prostatus !: Prostatus;

  public procategory !: Procategory;

  public staff !: Staff;

  public staffCreator !: Staff;

  public designation !: Staffdesignation;


  constructor(id: number, topic: string, duration: number, description: string,
              date: string, location: string, count: number, starttime: string, endtime: string,
              docreated: string, domodified: string, prostatus: Prostatus, procategory: Procategory,
              staff: Staff, staffCreator: Staff, designation: Staffdesignation) {
    this.id = id;
    this.topic = topic;
    this.duration = duration;
    this.description = description;
    this.date = date;
    this.location = location;
    this.count = count;
    this.starttime = starttime;
    this.endtime = endtime;
    this.docreated = docreated;
    this.domodified = domodified;
    this.prostatus = prostatus;
    this.procategory = procategory;
    this.staff = staff;
    this.staffCreator = staffCreator;
    this.designation = designation;
  }
}
