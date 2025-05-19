import {Teacher} from "../entity/teacher";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Grade} from "../entity/grade";

@Injectable({
  providedIn: 'root'
})

export class Teacherservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Teacher>> {

    const teachers = await this.http.get<Array<Teacher>>('http://localhost:8080/teachers' + query).toPromise();
    if (teachers == undefined) {
      return [];
    }
    // console.log(teachers);
    return teachers;
  }


  async add(teacherObj: Teacher): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/teachers', teacherObj).toPromise();
  }

  async update(teacherObj: Teacher): Promise<[]|undefined> {
    // console.log(teacherObj);
    return this.http.put<[]>('http://localhost:8080/teachers', teacherObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    // console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/teachers/'+id).toPromise();
  }

  async getById(id: number) {
    const teachelist = await this.http.get<Array<Teacher>>('http://localhost:8080/teachers/' +id).toPromise();
    console.log(teachelist);
    if (teachelist == undefined){
      return [];
    }

    return teachelist;
  }

  async getByTeacherProgress(id: number){
    const teachelist = await this.http.get<Array<Teacher>>('http://localhost:8080/teachers/progressupload/' +id).toPromise();
    console.log(teachelist);
    if (teachelist == undefined){
      return [];
    }

    return teachelist;
  }


  async onKey(value: any) {
    try {
      const teachelist = await this.http.get<Array<Teacher>>('http://localhost:8080/teachers/getlikesearch/' + value).toPromise();
      console.log(teachelist);
      if (teachelist === undefined) {
        return [];
      }

      return teachelist;
    } catch (error) {
      console.error(error);
      return [];
    }
  }


}

