import {Meeting} from "../entity/meeting";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Section} from "../entity/section";

@Injectable({
  providedIn: 'root'
})

export class Meetingservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Meeting>> {
    const meetings = await this.http.get<Array<Meeting>>('http://localhost:8080/meetings' + query).toPromise();
    console.log(meetings)
    if (meetings == undefined) {
      return [];
    }

    return meetings;

  }


  async add(meetingObj: Meeting): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/meetings', meetingObj).toPromise();
  }

  async update(meetingObj: Meeting): Promise<[]|undefined> {

    return this.http.put<[]>('http://localhost:8080/meetings', meetingObj).toPromise();
  }

  async delete(id: number): Promise< [] | undefined> {
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/meetings/'+id).toPromise();
  }
}

