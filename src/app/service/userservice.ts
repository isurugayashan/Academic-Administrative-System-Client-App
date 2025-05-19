import {User} from "../entity/user";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Userservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<User>> {

    const users = await this.http.get<Array<User>>('http://localhost:8080/users' + query).toPromise();
    if (users == undefined) {
      return [];
    }
    return users;
  }


  async add(userObj: User): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/users', userObj).toPromise();
  }

  async update(userObj: User): Promise<[]|undefined> {
    // console.log(userObj);
    return this.http.put<[]>('http://localhost:8080/users', userObj).toPromise();
  }

  async delete(id: any): Promise< void | undefined> {
    console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/users/'+id).toPromise();
  }



  async getbyActiveUser(): Promise<Array<User>> {

    const dashboardusers = await this.http.get<Array<User>>('http://localhost:8080/users/active').toPromise();
    if (dashboardusers == undefined) {
      return [];
    }
    return dashboardusers;
  }

  async getPhoto(name: string) {
    console.log(name);
    // @ts-ignore
    const dashboardusers = await this.http.get<User>('http://localhost:8080/users/'+name).toPromise();
    console.log(dashboardusers);
    if (dashboardusers == undefined) {
      return null;
    }
    return dashboardusers;
  }
}

