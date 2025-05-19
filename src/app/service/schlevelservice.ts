
import {Schlevel} from "../entity/schlevel";
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

export class Schlevelservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Schlevel>>{

    const schlevels = await this.http.get<Array<Schlevel>>('http://localhost:8080/schlevels/list').toPromise();
    if (schlevels == undefined){
      return [];
    }

    return schlevels;
 }
}
