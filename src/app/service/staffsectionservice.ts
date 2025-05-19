import {Staffsection} from "../entity/staffsection";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Staffsectionservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Staffsection>> {

    const staffsections = await this.http.get<Array<Staffsection>>('http://localhost:8080/staffsections' + query).toPromise();
    if (staffsections == undefined) {
      return [];
    }
   // console.log(staffsections);
    return staffsections;
  }


  async add(staffsectionObj: Staffsection): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/staffsections', staffsectionObj).toPromise();
  }

  async update(staffsectionObj: Staffsection): Promise<[]|undefined> {
    // console.log(staffsectionObj);
    return this.http.put<[]>('http://localhost:8080/staffsections', staffsectionObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/staffsections/'+id).toPromise();
  }


}

