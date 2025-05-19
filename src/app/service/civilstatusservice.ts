
import {Title} from "../entity/title";
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

export class Civilstatusservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Civilstatus>>{

    const civilstatuses = await this.http.get<Array<Civilstatus>>('http://localhost:8080/civilstatuses/list').toPromise();
    if (civilstatuses == undefined){
      return [];
    }

    return civilstatuses;
 }
}
