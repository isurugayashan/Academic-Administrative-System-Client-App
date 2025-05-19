

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

export class Regexservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async get(type:string): Promise<[]>{

    const regexes = await this.http.get<[]>('http://localhost:8080/regexes/'+type).toPromise();
    if (regexes == undefined){
      return [];
    }

    return regexes;
 }
}
