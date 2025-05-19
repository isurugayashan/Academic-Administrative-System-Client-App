import {Progress} from "../entity/progress";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Progressreview} from "../entity/progressreview";

@Injectable({
  providedIn: 'root'
})

export class Progressreviewservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Progressreview>> {

    const progresses = await this.http.get<Array<Progressreview>>('http://localhost:8080/progressreviewes' + query).toPromise();
    if (progresses == undefined) {
      return [];
    }
   // console.log(progresses);
    return progresses;
  }


  async add(progressreviewObj: Progressreview): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/progressreviewes', progressreviewObj).toPromise();
  }

  async update(progressreviewObj: Progressreview): Promise<[]|undefined> {
    // console.log(progressObj);
    return this.http.put<[]>('http://localhost:8080/progressreviewes', progressreviewObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/progressreviewes/'+id).toPromise();
  }


}

