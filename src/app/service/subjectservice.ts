import {Subject} from "../entity/subject";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Grade} from "../entity/grade";

@Injectable({
  providedIn: 'root'
})

export class Subjectservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Subject>> {

    const subjects = await this.http.get<Array<Subject>>('http://localhost:8080/subjects' + query).toPromise();
    if (subjects == undefined) {
      return [];
    }
    return subjects;
  }


  async add(subjectObj: Subject): Promise<[] | undefined> {
    console.log(subjectObj);
    return this.http.post<[]>('http://localhost:8080/subjects', subjectObj).toPromise();
  }

  async update(subjectObj: Subject): Promise<[]|undefined> {
    // console.log(subjectObj);
    return this.http.put<[]>('http://localhost:8080/subjects', subjectObj).toPromise();
  }

  async delete(id: number): Promise< [] | undefined> {
    // console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/subjects/'+id).toPromise();
  }

  //subject id load
  async getById(id: number) {

    const sublist = await this.http.get<Array<Subject>>('http://localhost:8080/subjects/' +id).toPromise();
    if (sublist == undefined){
      return [];
    }

    return sublist;
  }
}

