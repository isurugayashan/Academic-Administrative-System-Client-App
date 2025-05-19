
import {Procategory} from "../entity/procategory";
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

export class Procategoryservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Procategory>>{

    const procategories = await this.http.get<Array<Procategory>>('http://localhost:8080/procategories/list').toPromise();
    if (procategories == undefined){
      return [];
    }

    return procategories;
 }
}
