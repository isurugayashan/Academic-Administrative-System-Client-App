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

export class School{

  public id !: number;
  public censusnumber !: number;
  public name !: string;
  public photo !: string;
  public address !: string;
  public email !: string;
  public techercount !: number;
  public studentcount !: number;
  public mobile !: string;
  public startdate !: string;
  public description !: string;
  public schlevel !: Schlevel;
  public schtype !: Schtype;
  public schgender !: Schgender;
  public schstatus !: Schstatus;
  public schclass !: Schclass;
  public schteacher !: Schteacher;
  public schstudent !: Schstudent;
  public division !: Division;

  constructor(id: number, censusnumber: number, name: string, photo: string, address: string, email: string,
              techercount: number, studentcount: number, mobile: string, startdate: string, description: string, schlevel: Schlevel,
              schtype: Schtype, schgender: Schgender, schstatus: Schstatus, schclass: Schclass, schteacher: Schteacher, schstudent: Schstudent, division: Division) {
    this.id = id;
    this.censusnumber = censusnumber;
    this.name = name;
    this.photo = photo;
    this.address = address;
    this.email = email;
    this.techercount = techercount;
    this.studentcount = studentcount;
    this.mobile = mobile;
    this.startdate = startdate;
    this.description = description;
    this.schlevel = schlevel;
    this.schtype = schtype;
    this.schgender = schgender;
    this.schstatus = schstatus;
    this.schclass = schclass;
    this.schteacher = schteacher;
    this.schstudent = schstudent;
    this.division = division;
  }
}
