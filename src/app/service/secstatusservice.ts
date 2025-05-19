
import {Title} from "../entity/title";
import {Civilstatus} from "../entity/civilstatus";
import {Qualification} from "../entity/qualifications";
import {Gradetype} from "../entity/gradetype";
import {Grade} from "../entity/grade";
import {Empstatus} from "../entity/empstatus";
import {Officetype} from "../entity/officetype";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Secstatus} from "../entity/secstatus";

@Injectable({
  providedIn: 'root'
})

export class Secstatusservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Secstatus>>{

    const statuses = await this.http.get<Array<Title>>('http://localhost:8080/secstatuses/list').toPromise();
    if (statuses == undefined){
      return [];
    }

    return statuses;
 }
}
