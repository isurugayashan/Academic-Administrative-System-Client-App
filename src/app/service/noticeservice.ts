import {Notice} from "../entity/notice";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Noticeservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Notice>> {

    const notices = await this.http.get<Array<Notice>>('http://localhost:8080/notices' + query).toPromise();
    if (notices == undefined) {
      return [];
    }
    return notices;
  }


  async add(noticeObj: Notice): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/notices', noticeObj).toPromise();
  }

  async update(noticeObj: Notice): Promise<[]|undefined> {
    // console.log(noticeObj);
    return this.http.put<[]>('http://localhost:8080/notices', noticeObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/notices/'+id).toPromise();
  }



  async getAllByDopublishedAndTitle(): Promise<Array<Notice>> {

    const dashboardnotices = await this.http.get<Array<Notice>>('http://localhost:8080/notices/summarynotices').toPromise();
    if (dashboardnotices == undefined) {
      return [];
    }
    console.log(dashboardnotices);
    return dashboardnotices;
  }
}

