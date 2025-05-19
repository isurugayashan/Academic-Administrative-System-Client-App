
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

export class Gradetypeservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Gradetype>>{

    const gradetypes = await this.http.get<Array<Gradetype>>('http://localhost:8080/gradetypes/list').toPromise();
    if (gradetypes == undefined){
      return [];
    }
    return gradetypes;
 }

 // Teacher module gradetype list
  async getbygradetype(): Promise<Array<Gradetype>>{

    const gradetypes = await this.http.get<Array<Gradetype>>('http://localhost:8080/gradetypes/gradebyid').toPromise();
    if (gradetypes == undefined){
      return [];
    }
    return gradetypes;
  }

  // Notice module gradetype list
  async getbyNoticegrade(): Promise<Array<Gradetype>>{

    const gradetypes = await this.http.get<Array<Gradetype>>('http://localhost:8080/gradetypes/noticegrade').toPromise();
    if (gradetypes == undefined){
      return [];
    }
    return gradetypes;
  }

  // Director Subject gradetype list
  async getbyDirectorSubgrade(): Promise<Array<Gradetype>>{

    const gradetypes = await this.http.get<Array<Gradetype>>('http://localhost:8080/gradetypes/staffdivision').toPromise();
    if (gradetypes == undefined){
      return [];
    }
    return gradetypes;
  }



  // Staffsection module gradetype list
  async getbyStaffsecgrade(): Promise<Array<Gradetype>>{

    const gradetypes = await this.http.get<Array<Gradetype>>('http://localhost:8080/gradetypes/staffsection').toPromise();
    if (gradetypes == undefined){
      return [];
    }
    return gradetypes;
  }

  //User grade staff
  async getbyUserStaffsecgrade(): Promise<Array<Gradetype>>{

    const gradetypes = await this.http.get<Array<Gradetype>>('http://localhost:8080/gradetypes/userstaff').toPromise();
    if (gradetypes == undefined){
      return [];
    }
    return gradetypes;
  }

  //Teacher only gradetype load

  async getbyTeacherProgress(): Promise<Array<Gradetype>>{

    const gradetypes = await this.http.get<Array<Gradetype>>('http://localhost:8080/gradetypes/teacherprogress').toPromise();
    if (gradetypes == undefined){
      return [];
    }
    return gradetypes;
  }
}
