import {Gradetype} from "./gradetype";
import {Schdesignation} from "./schdesignation";

export class Procategory{

  public id !: number;

  public gradetype !: Gradetype;

  public schdesignation !: Schdesignation;


  constructor(gradetype: Gradetype) {
    this.gradetype = gradetype;
  }
}
