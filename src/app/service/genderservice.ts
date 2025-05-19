import {Gender} from "../entity/gender";
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

export class Genderservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Gender>>{

    const genders = await this.http.get<Array<Gender>>('http://localhost:8080/genders/list').toPromise();
    if (genders == undefined){
      return [];
    }
    return genders;
 }
}
