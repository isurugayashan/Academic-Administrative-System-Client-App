import {CountByDesignation} from "./entity/countbydesignation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CountBySchtype} from "./entity/countbyschtype";
import {Countbydivision} from "./entity/countbydivision";
import {Countbyallqueries} from "./entity/countbyallqueries";
import {Countbyschstudent} from "./entity/countbyschstudent";
import {Countbyschgender} from "./entity/countbyschgender";
import {Countbyschlevel} from "./entity/countbyschlevel";
import {Countbystaffqualification} from "./entity/countbystaffqualification";
import {Countbystatus} from "./entity/countbystatus";
import {Countbylesssubject} from "./entity/countbylesssubject";
import {Countbysubjectmedium} from "./entity/countbysubjectmedium";
import {Countbyitemstatus} from "./entity/countbyitemstatus";
import {Countbysectionitem} from "./entity/countbysectionitem";
import {Subleveltotalteachercount} from "./entity/subleveltotalteachercount";
import {Arrearsbydivision} from "./entity/arrearsbydivision";
import {Countbyweeks} from "./entity/countbyweeks";
import {Countbygender} from "./entity/countbygender";


@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private http: HttpClient) {  }

  //General Quaries

  async countByDesignation(): Promise<Array<CountByDesignation>> {

    const countbydesignations = await this.http.get<Array<CountByDesignation>>('http://localhost:8080/reports/countbydesignation').toPromise();
    if(countbydesignations == undefined){
      return [];
    }
    return countbydesignations;
  }


  async countbyschtype(): Promise<Array<CountBySchtype>> {

    const countbyschtypes = await this.http.get<Array<CountBySchtype>>('http://localhost:8080/reports/countbyschtype').toPromise();
    if(countbyschtypes == undefined){
      return [];
    }
    return countbyschtypes;
  }

  async countbydivision(): Promise<Array<Countbydivision>> {

    const countbydivisions = await this.http.get<Array<Countbydivision>>('http://localhost:8080/reports/countbydivision').toPromise();
    if(countbydivisions == undefined){
      return [];
    }
    return countbydivisions;
  }

  async countbyschlevel(): Promise<Array<Countbyschlevel>> {

    const countbyschlevels = await this.http.get<Array<Countbyschlevel>>('http://localhost:8080/reports/countbyschlevel').toPromise();
    if(countbyschlevels == undefined){
      return [];
    }
    return countbyschlevels;
  }

  async countByQualification(): Promise<Array<Countbystaffqualification>> {

    const countbyqualifications = await this.http.get<Array<Countbystaffqualification>>('http://localhost:8080/reports/countbyqualification').toPromise();
    if(countbyqualifications == undefined){
      return [];
    }
    return countbyqualifications;
  }

  async countByStatus(): Promise<Array<Countbystatus>> {

    const Countbystatuses = await this.http.get<Array<Countbystatus>>('http://localhost:8080/reports/countbystatus').toPromise();
    if(Countbystatuses == undefined){
      return [];
    }
    return Countbystatuses;
  }

  async countByItemStatus(): Promise<Array<Countbyitemstatus>> {

    const Countbyitemstatuses = await this.http.get<Array<Countbyitemstatus>>('http://localhost:8080/reports/countbyitemstatus').toPromise();
    if(Countbyitemstatuses == undefined){
      return [];
    }
    return Countbyitemstatuses;
  }

  async countByLessSubject(): Promise<Array<Countbylesssubject>> {

    const LessSubjects = await this.http.get<Array<Countbylesssubject>>('http://localhost:8080/reports/countbylesssubject').toPromise();
    if(LessSubjects == undefined){
      return [];
    }
    return LessSubjects;
  }

  async countBySubjectMedium(): Promise<Array<Countbysubjectmedium>> {

    const SubjectMediums = await this.http.get<Array<Countbysubjectmedium>>('http://localhost:8080/reports/countbysubmedium').toPromise();
    if(SubjectMediums == undefined){
      return [];
    }
    return SubjectMediums;
  }

  async countbyschstudent(): Promise<Array<Countbyschstudent>> {

    const countbyschstudents = await this.http.get<Array<Countbyschstudent>>('http://localhost:8080/reports/countbyschstudent').toPromise();
    if(countbyschstudents == undefined){
      return [];
    }
    return countbyschstudents;
  }

  async countbyschgender(): Promise<Array<Countbyschgender>> {

    const countbyschgenders = await this.http.get<Array<Countbyschgender>>('http://localhost:8080/reports/countbyschgender').toPromise();
    if(countbyschgenders == undefined){
      return [];
    }
    return countbyschgenders;
  }

  async countbyschtypediv(): Promise<Array<Arrearsbydivision>> {

    const countbyschtypedivions = await this.http.get<Array<Arrearsbydivision>>('http://localhost:8080/reports/countbyschtypediv').toPromise();
    if(countbyschtypedivions == undefined){
      return [];
    }
    return countbyschtypedivions;
  }

  async countbysectionItem(): Promise<Array<Countbysectionitem>> {

    const Countbysectionitems = await this.http.get<Array<Countbysectionitem>>('http://localhost:8080/reports/countbysectionitems').toPromise();
    if(Countbysectionitems == undefined){
      return [];
    }
    return Countbysectionitems;
  }

  async subleveltotalteachercounts(): Promise<Array<Subleveltotalteachercount>> {

    const Countbysectionitems = await this.http.get<Array<Subleveltotalteachercount>>('http://localhost:8080/reports/teachersubjectgender').toPromise();
    if(Countbysectionitems == undefined){
      return [];
    }
    return Countbysectionitems;
  }

  async countByProgressWeek(): Promise<Array<Countbyweeks>> {

    const weeks = await this.http.get<Array<Countbyweeks>>('http://localhost:8080/reports/countbyweeks').toPromise();
    if(weeks == undefined){
      return [];
    }
    return weeks;
  }

  async countbyGenders(): Promise<Array<Countbygender>> {

    const genders = await this.http.get<Array<Countbygender>>('http://localhost:8080/reports/countbygenders').toPromise();
    if(genders == undefined){
      return [];
    }
    return genders;
  }


  //Dashboard queries
  async countbyallqueries(): Promise<Countbyallqueries | undefined> {

    const schcount = await this.http.get<Countbyallqueries>('http://localhost:8080/reports/countbyallqueries').toPromise();
    return schcount;
  }

  async countallbyteachers(): Promise<Countbyallqueries | undefined> {

    const teachcount = await this.http.get<Countbyallqueries>('http://localhost:8080/reports/countbyallteachers').toPromise();
    return teachcount;
  }

  async countallbysections(): Promise<Countbyallqueries | undefined> {

    const secCount = await this.http.get<Countbyallqueries>('http://localhost:8080/reports/countbyallsections').toPromise();
    return secCount;
  }

  async countallbydivisions(): Promise<Countbyallqueries | undefined> {

    const divCount = await this.http.get<Countbyallqueries>('http://localhost:8080/reports/countbyalldivisions').toPromise();
    return divCount;
  }

}


