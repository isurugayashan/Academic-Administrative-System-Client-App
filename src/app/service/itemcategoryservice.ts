
import {Itemcategory} from "../entity/itemcategory";
import {Civilstatus} from "../entity/civilstatus";
import {Qualification} from "../entity/qualifications";
import {Gradetype} from "../entity/gradetype";
import {Grade} from "../entity/grade";
import {Empstatus} from "../entity/empstatus";
import {Officetype} from "../entity/officetype";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class Itemcategoryservice{

  constructor( private http: HttpClient) {}

  // @ts-ignore
 async getAllList(): Promise<Array<Itemcategory>>{

    const itemcategories = await this.http.get<Array<Itemcategory>>('http://localhost:8080/itemcategories/list').toPromise();
    if (itemcategories == undefined){
      return [];
    }

    return itemcategories;
 }
}
