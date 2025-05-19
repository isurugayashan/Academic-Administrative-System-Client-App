import {Title} from "./title";
import {Gender} from "./gender";
import {Civilstatus} from "./civilstatus";
import {Grade} from "./grade";
import {Qualification} from "./qualifications";
import {Empstatus} from "./empstatus";
import {Officetype} from "./officetype";
import {Staffdesignation} from "./staffdesignation";
import {Gradetype} from "./gradetype";

export class Staff{

  public id !: number;

  public title !: Title;

  public fullname !: string;

  public callingname !: string;

  public photo !: string;

  public dobirth !: string;

  public nic !: string;

  public address !: string;

  public email !: string;

  public mobile !: string;

  public land !: string;

  public dofirstappoint !: string;

  public description !: string;

  public gender !: Gender;

  public officetype !: Officetype;

  public staffdesignation !: Staffdesignation;

  public empstatus !: Empstatus;

  public grade !: Grade;

  public gradetype !: Gradetype;

  public civilstatus !: Civilstatus;

  public qualification !: Qualification;


  constructor(id: number,
              title: Title,
              fullname: string,
              callingname: string, photo: string,
              dobirth: string, nic: string, address: string, email: string, mobile: string, land: string,
              dofirstappoint: string, description: string, gender: Gender, officetype: Officetype,
              staffdesignation: Staffdesignation, empstatus: Empstatus, grade: Grade,
              civilstatus: Civilstatus, qualification: Qualification, gradetype : Gradetype) {
    this.id = id;
    this.title = title;
    this.fullname = fullname;
    this.callingname = callingname;
    this.photo = photo;
    this.dobirth = dobirth;
    this.nic = nic;
    this.address = address;
    this.email = email;
    this.mobile = mobile;
    this.land = land;
    this.dofirstappoint = dofirstappoint;
    this.description = description;
    this.gender = gender;
    this.officetype = officetype;
    this.staffdesignation = staffdesignation;
    this.empstatus = empstatus;
    this.grade = grade;
    this.gradetype = gradetype;
    this.civilstatus = civilstatus;
    this.qualification = qualification;
  }
}
