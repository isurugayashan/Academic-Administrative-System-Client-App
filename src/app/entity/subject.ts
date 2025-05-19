
import {Submedium} from "./submedium";
import {Substatus} from "./substatus";
import {Sublevel} from "./sublevel";

export class Subject{

  public id !: number;

  public name !: string;

  public description !: string;

  public studentcount !: string;

  public teachercount !: number;

  public creatordate !: number;

  public submedium !: Submedium;

  public substatus !: Substatus;

  public sublevel !: Sublevel;


  constructor(id: number, name: string, description: string, studentcount: string, teachercount: number, creatordate: number, submedium: Submedium, substatus: Substatus, sublevel: Sublevel) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.studentcount = studentcount;
    this.teachercount = teachercount;
    this.creatordate = creatordate;
    this.submedium = submedium;
    this.substatus = substatus;
    this.sublevel = sublevel;
  }
}
