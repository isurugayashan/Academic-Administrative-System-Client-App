import {Schassign} from "../entity/schassign";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Grade} from "../entity/grade";
import {Teacher} from "../entity/teacher";
import {School} from "../entity/school";

@Injectable({
  providedIn: 'root'
})

export class Schassignservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Schassign>> {

    const schassigns = await this.http.get<Array<Schassign>>('http://localhost:8080/schassigns' + query).toPromise();
    if (schassigns == undefined) {
      return [];
    }
   // console.log(schassigns);
    return schassigns;
  }


  async add(schassignObj: Schassign): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/schassigns', schassignObj).toPromise();
  }

  async update(schassignObj: Schassign): Promise<[]|undefined> {
    // console.log(schassignObj);
    return this.http.put<[]>('http://localhost:8080/schassigns', schassignObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/schassigns/'+id).toPromise();
  }

  //teacher select with id
  async getBySchteacherId(id: number) {
    const staffListDiv = await this.http.get<Array<Teacher>>('http://localhost:8080/teachersubjects/schteacher/' +id).toPromise();
    console.log(staffListDiv)
    if (staffListDiv == undefined){
      return [];
    }

    return staffListDiv;
  }

  async getBySchTeacherId(id: number) {
    const schList = await this.http.get<Array<Schassign>>('http://localhost:8080/schassigns/teachers/' + id).toPromise();
    if (schList == undefined) {
      return [];

    }
    return schList;
  }
}

