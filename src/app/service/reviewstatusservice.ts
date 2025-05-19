
import {Title} from "../entity/title";
import {Civilstatus} from "../entity/civilstatus";
import {Qualification} from "../entity/qualifications";
import {Gradetype} from "../entity/gradetype";
import {Grade} from "../entity/grade";
import {Empstatus} from "../entity/empstatus";
import {Officetype} from "../entity/officetype";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Reviewstatus} from "../entity/reviewstatus";

@Injectable({
  providedIn: 'root'
})

export class Reviewstatuservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Reviewstatus>>{

    const reviewstatus = await this.http.get<Array<Reviewstatus>>('http://localhost:8080/reviewstatuses/list').toPromise();
    if (reviewstatus == undefined){
      return [];
    }

    return reviewstatus;
 }
}
