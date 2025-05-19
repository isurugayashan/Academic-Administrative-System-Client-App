import {Staff} from "../entity/staff";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Grade} from "../entity/grade";

@Injectable({
  providedIn: 'root'
})

export class Staffservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Staff>> {

    const staffs = await this.http.get<Array<Staff>>('http://localhost:8080/staffs' + query).toPromise();
    if (staffs == undefined) {
      return [];
    }
    return staffs;
  }


  async add(staffObj: Staff): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/staffs', staffObj).toPromise();
  }

  async update(staffObj: Staff): Promise<[]|undefined> {
    // console.log(staffObj);
    return this.http.put<[]>('http://localhost:8080/staffs', staffObj).toPromise();
  }

  async delete(id: number): Promise< [] | undefined> {
    // console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/staffs/'+id).toPromise();
  }

  // @ts-ignore
  async getAllbyFullname(): Promise<Array<Staff>> {

    const staffs = await this.http.get<Array<Staff>>('http://localhost:8080/staffs/fullnames').toPromise();
    if (staffs == undefined) {
      return [];
    }
    return staffs;
  }

  // @ts-ignore
  async getAllByStaffdesignation(): Promise<Array<Staff>> {

    const designations = await this.http.get<Array<Staff>>('http://localhost:8080/staffs/designations').toPromise();
    if (designations == undefined) {
      return [];
    }

    return designations;
  }

  async getById(id: number) {
    const staffList = await this.http.get<Array<Grade>>('http://localhost:8080/staffs/' +id).toPromise();
    if (staffList == undefined){
      return [];
    }

    return staffList;
  }

  async getAllbyCallingname(): Promise<Array<Staff>> {

    const callingnames = await this.http.get<Array<Staff>>('http://localhost:8080/staffs/callingnames').toPromise();
    if (callingnames == undefined) {
      return [];
    }

    return callingnames;
  }

  //staff select with id
  async getByStaffId(id: number) {
    const staffListId = await this.http.get<Array<Grade>>('http://localhost:8080/staffs/notices/' +id).toPromise();
    if (staffListId == undefined){
      return [];
    }

    return staffListId;
  }

  //zonal staff select with id
  async getByStaffZonalId(id: number) {
    const staffListZonl = await this.http.get<Array<Grade>>('http://localhost:8080/staffs/zonal/' +id).toPromise();
    if (staffListZonl == undefined){
      return [];
    }

    return staffListZonl;
  }


  //zonal staff select with id
  async getByStaffDivId(id: number) {
    const staffListDiv = await this.http.get<Array<Grade>>('http://localhost:8080/staffs/divisional/' +id).toPromise();
    if (staffListDiv == undefined){
      return [];
    }

    return staffListDiv;
  }

}

