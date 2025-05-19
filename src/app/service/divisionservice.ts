import {Division} from "../entity/division";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Schstudent} from "../entity/schstudent";

@Injectable({
  providedIn: 'root'
})

export class Divisionservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Division>> {

    const divisions = await this.http.get<Array<Division>>('http://localhost:8080/divisions' + query).toPromise();
    if (divisions == undefined) {
      return [];
    }
    console.log(divisions);
    return divisions;
  }


  // async add(divisionObj: Division): Promise<[] | undefined> {
  //   return this.http.post<[]>('http://localhost:8080/divisions', divisionObj).toPromise();
  // }
  //
  async update(divisionObj: Division): Promise<[]|undefined> {
    // console.log(divisionObj);
    return this.http.put<[]>('http://localhost:8080/divisions', divisionObj).toPromise();
  }

  async delete(id: number): Promise< [] | undefined> {
    // console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/divisions/'+id).toPromise();
  }

  async getAllList(): Promise<Array<Division>>{

    const divisions = await this.http.get<Array<Division>>('http://localhost:8080/divisions/list').toPromise();
    if (divisions == undefined){
      return [];
    }

    return divisions;
  }
}

