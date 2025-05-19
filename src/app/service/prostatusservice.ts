
import {Prostatus} from "../entity/prostatus";
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

export class Prostatusservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Prostatus>>{

    const prostatuses = await this.http.get<Array<Prostatus>>('http://localhost:8080/prostatuses/list').toPromise();
    if (prostatuses == undefined){
      return [];
    }

    return prostatuses;
 }
}
