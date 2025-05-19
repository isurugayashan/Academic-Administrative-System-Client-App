
import {Schstudent} from "../entity/schstudent";
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

export class Schstudentservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Schstudent>>{

    const schstudents = await this.http.get<Array<Schstudent>>('http://localhost:8080/schstudents/list').toPromise();
    if (schstudents == undefined){
      return [];
    }

    return schstudents;
 }
}
