
import {Sublevel} from "../entity/sublevel";
import {Civilstatus} from "../entity/civilstatus";
import {Qualification} from "../entity/qualifications";
import {Gradetype} from "../entity/gradetype";
import {Grade} from "../entity/grade";
import {Empstatus} from "../entity/empstatus";
import {Officetype} from "../entity/officetype";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Sublevelservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Sublevel>>{

    const sublevels = await this.http.get<Array<Sublevel>>('http://localhost:8080/sublevels/list').toPromise();
    if (sublevels == undefined){
      return [];
    }

    return sublevels;
 }
}
