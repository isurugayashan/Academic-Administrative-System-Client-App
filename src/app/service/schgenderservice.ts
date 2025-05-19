
import {Schgender} from "../entity/schgender";
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

export class Schgenderservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Schgender>>{

    const schgenders = await this.http.get<Array<Schgender>>('http://localhost:8080/schgenders/list').toPromise();
    if (schgenders == undefined){
      return [];
    }

    return schgenders;
 }
}
