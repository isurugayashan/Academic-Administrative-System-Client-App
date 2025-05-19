
import {Isreview} from "../entity/isreview";
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

export class Isreviewservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Isreview>>{

    const isreviews = await this.http.get<Array<Isreview>>('http://localhost:8080/isreviewes/list').toPromise();
    if (isreviews == undefined){
      return [];
    }

    return isreviews;
 }
}
