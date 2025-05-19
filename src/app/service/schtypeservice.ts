
import {Schtype} from "../entity/schtype";
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

export class Schtypeservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Schtype>>{

    const schtypes = await this.http.get<Array<Schtype>>('http://localhost:8080/schtypes/list').toPromise();
    if (schtypes == undefined){
      return [];
    }

    return schtypes;
 }

}
