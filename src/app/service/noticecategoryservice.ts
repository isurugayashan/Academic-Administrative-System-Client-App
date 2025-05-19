
import {Noticecategory} from "../entity/noticecategory";
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

export class Noticecategoryservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Noticecategory>>{

    const noticecategories = await this.http.get<Array<Noticecategory>>('http://localhost:8080/noticecategories/list').toPromise();
    if (noticecategories == undefined){
      return [];
    }

    return noticecategories;
 }
}
