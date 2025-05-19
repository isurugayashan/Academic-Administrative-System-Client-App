import {School} from "../entity/school";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Schoolservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<School>> {

    const schools = await this.http.get<Array<School>>('http://localhost:8080/schools' + query).toPromise();
    if (schools == undefined) {
      return [];
    }
    return schools;
  }

  async add(schoolObj: School): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/schools', schoolObj).toPromise();
  }

  async update(schoolObj: School): Promise<[]|undefined> {
    // console.log(schoolObj);
    return this.http.put<[]>('http://localhost:8080/schools', schoolObj).toPromise();
  }

  async delete(id: number): Promise< [] | undefined> {
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/schools/'+id).toPromise();
  }

 // @ts-ignore
  //School select with id
  async getById(id: number) {
    const schList = await this.http.get<Array<School>>('http://localhost:8080/schools/' + id).toPromise();
    if (schList == undefined) {
      return [];

    }
    return schList;
  }



}

