import {Gradetype} from "./gradetype";

export class Grade{

  public id !: number;

  public name !: string;

  public gradetype !: Gradetype;


  constructor(id: number, name: string, gradetype: Gradetype) {
    this.id = id;
    this.name = name;
    this.gradetype = gradetype;
  }
}
