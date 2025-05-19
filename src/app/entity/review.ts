
import {Noticepriority} from "./noticepriority";
import {Noticecategory} from "./noticecategory";
import {Reviewtype} from "./reviewtype";
import {Reviewrating} from "./reviewrating";
import {Reviewstatus} from "./reviewstatus";
import {Isreview} from "./isreview";

export class Review{

  public id !: number;

  public topic !: string;

  public doreview !: string;

  public message !: string;

  public toreview !: string;

  public domodified !: string;

  public reviewtype !: Reviewtype;

  public reviewstatus !: Reviewstatus;

  public reviewrating !: Reviewrating;

  public reviewpriority !: Noticepriority;

  public isreview !: Isreview;


  constructor(id: number, topic: string, doreview: string, message: string, toreview: string, domodified: string, reviewtype: Reviewtype, reviewstatus: Reviewstatus, reviewrating: Reviewrating, reviewpriority: Noticepriority, isreview: Isreview) {
    this.id = id;
    this.topic = topic;
    this.doreview = doreview;
    this.message = message;
    this.toreview = toreview;
    this.domodified = domodified;
    this.reviewtype = reviewtype;
    this.reviewstatus = reviewstatus;
    this.reviewrating = reviewrating;
    this.reviewpriority = reviewpriority;
    this.isreview = isreview;
  }
}
