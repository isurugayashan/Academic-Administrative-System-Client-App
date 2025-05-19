import {Secstatus} from "./secstatus";

export class Section{

  public id !: number;

  public name !: string;

  public mobile !: string;

  public director !: string;

  public docreated !: string;

  public doresign !: string;

  public description !: string;

  public staffcount !: string;

  public secstatus !: Secstatus;


  constructor(id: number, name: string, mobile: string, director: string, docreated: string, doresign: string, description: string, staffcount: string, secstatus: Secstatus) {
    this.id = id;
    this.name = name;
    this.mobile = mobile;
    this.director = director;
    this.docreated = docreated;
    this.doresign = doresign;
    this.description = description;
    this.staffcount = staffcount;
    this.secstatus = secstatus;
  }
}
