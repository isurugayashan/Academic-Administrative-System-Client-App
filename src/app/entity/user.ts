
import {Userrole} from "./userrole";
import {Staff} from "./staff";
import {Teacher} from "./teacher";
import {Userstatus} from "./userstatus";
import {Usertype} from "./usertype";
import {Gradetype} from "./gradetype";
import {Grade} from "./grade";
import {Role} from "./role";

export class User{

  public id !: number;

  public username !: string;

  public password !: string;

  public confirmpassword !: string;

  public userroles!:Array<Userrole>;

  public description !: string;

  public tocreated!:string | null;

  public docreated!:string;

  public staff!:Staff;

  public teacher!:Teacher;

  public userstatus !: Userstatus;

  public usertype !: Usertype;

  // public user !: User;

  public gradetype!: Gradetype;

  public grade!: Grade;

  public role!: Role;


  constructor(id: number, username: string, password: string, confirmpassword: string, userroles: Array<Userrole>, description: string, tocreated: string | null, docreated: string, staff: Staff, teacher: Teacher, userstatus: Userstatus, usertype: Usertype, user: User, gradetype: Gradetype, grade: Grade, role: Role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.confirmpassword = confirmpassword;
    this.userroles = userroles;
    this.description = description;
    this.tocreated = tocreated;
    this.docreated = docreated;
    this.staff = staff;
    this.teacher = teacher;
    this.userstatus = userstatus;
    this.usertype = usertype;
    //this.user = user;
    this.gradetype = gradetype;
    this.grade = grade;
    this.role = role;
  }
}
