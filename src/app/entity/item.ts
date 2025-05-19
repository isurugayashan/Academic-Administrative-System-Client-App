
import {Staff} from "./staff";
import {Itemstatus} from "./itemstatus";
import {Section} from "./section";
import {Itemcategory} from "./itemcategory";
import {Division} from "./division";

export class Item{

  public id !: number;

  public itemcode !: string;

  public name !: string;

  public quentity !: number;

  public purchasedate !: string;

  public description !: string;

  public warrenty !: string;

  public supplier !: string;

  public supplieraddress !: string;

  public unitprice !: number;

  public totalcost !: number;

  public loss !: number;

  public lossitem !: number;

  public itemstatus !: Itemstatus;

  public section !: Section;

  public staffCreator !: Staff;

  public itemcategory !: Itemcategory;

  public division !: Division;


  constructor(id: number, itemcode: string, name: string, quentity: number, purchasedate: string, description: string,
              warrenty: string, supplier: string, supplieraddress: string, unitprice: number, totalcost: number,
              loss: number, lossitem: number, itemstatus: Itemstatus, section: Section, staffCreator: Staff,
              itemcategory: Itemcategory, division: Division) {

    this.id = id;
    this.itemcode = itemcode;
    this.name = name;
    this.quentity = quentity;
    this.purchasedate = purchasedate;
    this.description = description;
    this.warrenty = warrenty;
    this.supplier = supplier;
    this.supplieraddress = supplieraddress;
    this.unitprice = unitprice;
    this.totalcost = totalcost;
    this.loss = loss;
    this.lossitem = lossitem;
    this.itemstatus = itemstatus;
    this.section = section;
    this.staffCreator = staffCreator;
    this.itemcategory = itemcategory;
    this.division = division;
  }
}
