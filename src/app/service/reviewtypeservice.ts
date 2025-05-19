
import {Title} from "../entity/title";
import {Civilstatus} from "../entity/civilstatus";
import {Qualification} from "../entity/qualifications";
import {Gradetype} from "../entity/gradetype";
import {Grade} from "../entity/grade";
import {Empstatus} from "../entity/empstatus";
import {Officetype} from "../entity/officetype";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Reviewtype} from "../entity/reviewtype";

@Injectable({
  providedIn: 'root'
})

export class Reviewtypeservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Reviewtype>>{

    const reviewtype = await this.http.get<Array<Reviewtype>>('http://localhost:8080/reviewtypes/list').toPromise();
    if (reviewtype == undefined){
      return [];
    }

    return reviewtype;
 }
}
