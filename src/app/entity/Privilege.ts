import {Role} from "./role";
import {Module} from "./module";
import {Operation} from "./Operation";

export class Privilege {

  public id !: number;
  public authority!:string;
  public role !: Role;
  public module !: Module;
  public operation !: Operation;

  constructor(id:number,authority:string,role:Role,module:Module,operation:Operation) {
    this.id=id;
    this.authority = authority;
    this.role = role;
    this.module = module;
    this.operation = operation;
  }

}
