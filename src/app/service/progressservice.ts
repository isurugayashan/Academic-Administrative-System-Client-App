import {Progress} from "../entity/progress";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Progresseservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Progress>> {

    const progresses = await this.http.get<Array<Progress>>('http://localhost:8080/progresses' + query).toPromise();
    if (progresses == undefined) {
      return [];
    }
   // console.log(progresses);
    return progresses;
  }


  async add(progressObj: Progress): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/progresses', progressObj).toPromise();
  }

  async update(progressObj: Progress): Promise<[]|undefined> {
    // console.log(progressObj);
    return this.http.put<[]>('http://localhost:8080/progresses', progressObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/progresses/'+id).toPromise();
  }

  async getByTeachers(id: any): Promise<Array<Progress>> {

    const progresses = await this.http.get<Array<Progress>>('http://localhost:8080/progresses/teachers/' + id).toPromise();
    if (progresses == undefined) {
      return [];
    }
    // console.log(progresses);
    return progresses;
  }

  async getByschool(id: number): Promise<Array<Progress>> {

    const progresses = await this.http.get<Array<Progress>>('http://localhost:8080/progresses/schools/' + id).toPromise();
    if (progresses == undefined) {
      return [];
    }
    // console.log(progresses);
    return progresses;
  }

}

