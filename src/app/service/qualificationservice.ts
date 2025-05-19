
import {Gradetype} from "../entity/gradetype";
import {Grade} from "../entity/grade";
import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Qualification} from "../entity/qualifications";

@Injectable({
  providedIn: 'root'
})

export class Qualificationsservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Qualifications>>{

    const qualifications = await this.http.get<Array<Qualification>>('http://localhost:8080/qualifications/list').toPromise();
    if (qualifications == undefined){
      return [];
    }

    return qualifications;
 }
}
