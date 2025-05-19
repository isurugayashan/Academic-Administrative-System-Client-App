
import {Submedium} from "../entity/submedium";
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

export class Submediumservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Submedium>>{

    const submediums = await this.http.get<Array<Submedium>>('http://localhost:8080/submediums/list').toPromise();
    if (submediums == undefined){
      return [];
    }

    return submediums;
 }
}
