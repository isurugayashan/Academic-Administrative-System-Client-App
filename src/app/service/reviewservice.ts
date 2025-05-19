import {Review} from "../entity/review";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Section} from "../entity/section";

@Injectable({
  providedIn: 'root'
})

export class Reviewservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Review>> {
    const reviews = await this.http.get<Array<Review>>('http://localhost:8080/reviews' + query).toPromise();
    if (reviews == undefined) {
      return [];
    }

    return reviews;

  }


  async add(reviewObj: Review): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/reviews', reviewObj).toPromise();
  }

  async update(reviewObj: Review): Promise<[]|undefined> {
    console.log(reviewObj);
    // console.log(reviewObj);
    return this.http.put<[]>('http://localhost:8080/reviews', reviewObj).toPromise();
  }

  async delete(id: number): Promise< [] | undefined> {
    // console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/reviews/'+id).toPromise();
  }
}

