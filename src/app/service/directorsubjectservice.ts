import {Directorsubject} from "../entity/directorsubject";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Progress} from "../entity/progress";

@Injectable({
  providedIn: 'root'
})

export class Directorsubjectservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Directorsubject>> {

    const directorsubjects = await this.http.get<Array<Directorsubject>>('http://localhost:8080/directorsubjects' + query).toPromise();
    if (directorsubjects == undefined) {
      return [];
    }
    console.log(directorsubjects);
    return directorsubjects;
  }


  async add(directorsubjectObj: Directorsubject): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/directorsubjects', directorsubjectObj).toPromise();
  }

  async update(directorsubjectObj: Directorsubject): Promise<[]|undefined> {
    // console.log(directorsubjectObj);
    return this.http.put<[]>('http://localhost:8080/directorsubjects', directorsubjectObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/directorsubjects/'+id).toPromise();
  }



  async getBySubjectId(id: any): Promise<Array<Directorsubject>> {

    const directors = await this.http.get<Array<Directorsubject>>('http://localhost:8080/directorsubjects/subject/' + id).toPromise();
    if (directors == undefined) {
      return [];
    }
    console.log(directors);
    return directors;
  }
}

