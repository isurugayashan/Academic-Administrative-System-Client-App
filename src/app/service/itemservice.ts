import {Item} from "../entity/item";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Section} from "../entity/section";

@Injectable({
  providedIn: 'root'
})

export class Itemservice {

  constructor(private http: HttpClient) {
  }

  // @ts-ignore
  async getAll(query: string): Promise<Array<Item>> {
    const items = await this.http.get<Array<Item>>('http://localhost:8080/items' + query).toPromise();
    if (items == undefined) {
      return [];
    }

    return items;

  }


  async add(itemObj: Item): Promise<[] | undefined> {
    return this.http.post<[]>('http://localhost:8080/items', itemObj).toPromise();
  }

  async update(itemObj: Item): Promise<[]|undefined> {
    console.log(itemObj);
    // console.log(itemObj);
    return this.http.put<[]>('http://localhost:8080/items', itemObj).toPromise();
  }

  async delete(id: number): Promise< [] | undefined> {
    // console.log(id);
    // @ts-ignore
    return this.http.delete<[]>('http://localhost:8080/items/'+id).toPromise();
  }
}

