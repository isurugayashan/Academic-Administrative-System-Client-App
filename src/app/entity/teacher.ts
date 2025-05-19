import {Title} from "./title";
import {Gender} from "./gender";
import {Civilstatus} from "./civilstatus";
import {Grade} from "./grade";
import {Qualification} from "./qualifications";
import {Empstatus} from "./empstatus";
import {Gradetype} from "./gradetype";
import {Subject} from "./subject";

export class Teacher{

  public id !: number;

  public title !: Title;

  public fullname !: string;

  public callingname !: string;

  public photo !: string;

  public dob !: string;

  public nic !: string;

  public address !: string;

  public email !: string;

  public mobile !: string;

  public dofirstappoint !: string;

  public description !: string;

  public gender !: Gender;

  public empstatus !: Empstatus;

  public civilstatus !: Civilstatus;

  public grade !: Grade;

  public gradetype !: Gradetype;

  public qualification !: Qualification;


  constructor(id: number, title: Title, fullname: string, callingname: string, photo: string,
              dob: string, nic: string, address: string, email: string, mobile: string, dofirstappoint: string,
              description: string, gender: Gender, empstatus: Empstatus, civilstatus: Civilstatus, grade: Grade,
              gradetype: Gradetype, qualification: Qualification) {
    this.id = id;
    this.title = title;
    this.fullname = fullname;
    this.callingname = callingname;
    this.photo = photo;
    this.dob = dob;
    this.nic = nic;
    this.address = address;
    this.email = email;
    this.mobile = mobile;
    this.dofirstappoint = dofirstappoint;
    this.description = description;
    this.gender = gender;
    this.empstatus = empstatus;
    this.civilstatus = civilstatus;
    this.grade = grade;
    this.gradetype = gradetype;
    this.qualification = qualification;

  }
}
