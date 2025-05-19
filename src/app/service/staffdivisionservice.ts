import {Staffdivision} from "../entity/staffdivision";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Staffdivisionservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Staffdivision>> {

    const staffdivisions = await this.http.get<Array<Staffdivision>>('http://localhost:8080/staffdivisions' + query).toPromise();
    if (staffdivisions == undefined) {
      return [];
    }
   // console.log(staffdivisions);
    return staffdivisions;
  }


  async add(staffdivisionObj: Staffdivision): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/staffdivisions', staffdivisionObj).toPromise();
  }

  async update(staffdivisionObj: Staffdivision): Promise<[]|undefined> {
    // console.log(staffdivisionObj);
    return this.http.put<[]>('http://localhost:8080/staffdivisions', staffdivisionObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/staffdivisions/'+id).toPromise();
  }


}

