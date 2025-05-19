
import {Schstatus} from "../entity/schstatus";
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

export class Schstatusservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Schstatus>>{

    const schstatuses = await this.http.get<Array<Schstatus>>('http://localhost:8080/schstatuses/list').toPromise();
    if (schstatuses == undefined){
      return [];
    }

    return schstatuses;
 }
}
