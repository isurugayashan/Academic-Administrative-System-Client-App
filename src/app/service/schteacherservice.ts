
import {Schteacher} from "../entity/schteacher";
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

export class Schteacherservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Schteacher>>{

    const schteachers = await this.http.get<Array<Schteacher>>('http://localhost:8080/schteachers/list').toPromise();
    if (schteachers == undefined){
      return [];
    }

    return schteachers;
 }
}
