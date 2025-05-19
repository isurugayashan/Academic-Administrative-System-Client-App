
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

export class Gradeservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Grade>>{

    const grades = await this.http.get<Array<Grade>>('http://localhost:8080/grades/list').toPromise();
    if (grades == undefined){
      return [];
    }

    return grades;
 }

  async getById(id: number): Promise<Array<Grade>>{

    const gradelist = await this.http.get<Array<Grade>>('http://localhost:8080/grades/' +id).toPromise();
    if (gradelist == undefined){
      return [];
    }

    return gradelist;
  }
}
