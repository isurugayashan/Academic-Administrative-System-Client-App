import {Teachersubject} from "../entity/teachersubject";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Teachersubjectservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Teachersubject>> {

    const teachersubjects = await this.http.get<Array<Teachersubject>>('http://localhost:8080/teachersubjects' + query).toPromise();
    if (teachersubjects == undefined) {
      return [];
    }
   // console.log(teachersubjects);
    return teachersubjects;
  }


  async add(teachersubjectObj: Teachersubject): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/teachersubjects', teachersubjectObj).toPromise();
  }

  async update(teachersubjectObj: Teachersubject): Promise<[]|undefined> {
    // console.log(teachersubjectObj);
    return this.http.put<[]>('http://localhost:8080/teachersubjects', teachersubjectObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/teachersubjects/'+id).toPromise();
  }
}

