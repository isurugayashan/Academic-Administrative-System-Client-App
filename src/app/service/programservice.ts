import {Program} from "../entity/program";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Section} from "../entity/section";

@Injectable({
  providedIn: 'root'
})

export class Programservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Program>> {
    const programs = await this.http.get<Array<Program>>('http://localhost:8080/programs' + query).toPromise();
    if (programs == undefined) {
      return [];
    }

    return programs;

  }


  async add(proObj: Program): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/programs', proObj).toPromise();
  }

  async update(programObj: Program): Promise<[]|undefined> {
    console.log(programObj);
    // console.log(programObj);
    return this.http.put<[]>('http://localhost:8080/programs', programObj).toPromise();
  }

  async delete(id: number): Promise< [] | undefined> {
    // console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/programs/'+id).toPromise();
  }
}

