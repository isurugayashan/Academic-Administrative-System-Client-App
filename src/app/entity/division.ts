export class Division{

  public id !: number;

  public name !: string;

  public mobile !: string;

  public email !: string;

  public address !: string;

  public photo !: string;

  public description !: string;

  public staffcount !: string;


  constructor(id: number, name: string, mobile: string, email: string, address: string, photo: string, description: string, staffcount: string) {
    this.id = id;
    this.name = name;
    this.mobile = mobile;
    this.email = email;
    this.address = address;
    this.photo = photo;
    this.description = description;
    this.staffcount = staffcount;
  }
}
