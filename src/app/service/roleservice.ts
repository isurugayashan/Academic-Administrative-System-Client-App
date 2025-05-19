
import {Title} from "../entity/title";
import {Civilstatus} from "../entity/civilstatus";
import {Qualification} from "../entity/qualifications";
import {Gradetype} from "../entity/gradetype";
import {Grade} from "../entity/grade";
import {Empstatus} from "../entity/empstatus";
import {Officetype} from "../entity/officetype";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Userstatus} from "../entity/userstatus";
import {Role} from "../entity/role";

@Injectable({
  providedIn: 'root'
})

export class Roleservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Role>>{

    const roles = await this.http.get<Array<Role>>('http://localhost:8080/roles/list').toPromise();
    if (roles == undefined){
      return [];
    }

    return roles;
 }
}
