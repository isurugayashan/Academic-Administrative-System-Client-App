import {Section} from "../entity/section";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Schstudent} from "../entity/schstudent";
import {Staffsection} from "../entity/staffsection";

@Injectable({
  providedIn: 'root'
})

export class Sectionservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Section>> {

    const sections = await this.http.get<Array<Section>>('http://localhost:8080/sections' + query).toPromise();
    if (sections == undefined) {
      return [];
    }
    console.log(sections);
    return sections;
  }


  async add(sectionObj: Section): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/sections', sectionObj).toPromise();
  }

  async update(sectionObj: Section): Promise<[]|undefined> {
    // console.log(sectionObj);
    return this.http.put<[]>('http://localhost:8080/sections', sectionObj).toPromise();
  }

  async delete(id: number): Promise< [] | undefined> {
    // console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/sections/'+id).toPromise();
  }

  async getAllList(): Promise<Array<Section>>{

    const sections = await this.http.get<Array<Section>>('http://localhost:8080/sections/list').toPromise();
    if (sections == undefined){
      return [];
    }

    return sections;
  }

  async get(): Promise<Array<Section>> {

    const staffsections = await this.http.get<Array<Section>>('http://localhost:8080/sections/Names').toPromise();
    if (staffsections == undefined) {
      return [];
    }
    // console.log(staffsections);
    return staffsections;
  }
}

