import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {School} from "../../../entity/school";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Division} from "../../../entity/division";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Divisionservice} from "../../../service/divisionservice";
import {MatDialog} from "@angular/material/dialog";
import {Regexservice} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";
import {Schgender} from "../../../entity/schgender";
import {Schtype} from "../../../entity/schtype";
import {Schclass} from "../../../entity/schclass";
import {Schstatus} from "../../../entity/schstatus";
import {Schteacher} from "../../../entity/schteacher";
import {Schstudent} from "../../../entity/schstudent";
import {Schlevel} from "../../../entity/schlevel";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {AuthorizationManager} from "../../../service/authorizationmanager";

@Component({
  selector: 'app-division',
  templateUrl: './division.component.html',
  styleUrls: ['./division.component.css']
})
export class DivisionComponent {


  //Table columns
  columns: string[] = ['name','mobile','email','staffcount','address','description'];
  headers: string[] = ['Name','Contact Number','Email','Staff Members', 'Address','Description'];
  binders: string[] = ['name','mobile','email','staffcount','address','description'];

  //Client Search columns
  cscolumns: string[] = ['csname','caddress','cemail'];
  csprompts: string[] = ['Search by Name', 'Search by Address', 'Serarch by Email'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  selectedRow: any;

  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;

  divObj!: Division;
  oldDivObj!: Division| undefined;

  divisions: Array<Division> = [];
  imageurl : string = '';
  data!: MatTableDataSource<Division>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imgedivUrl: string = 'assets/userold.png';

  regexes: any;

  uiassist: UiAssist;

  constructor(private divisionservice: Divisionservice,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private dp: DatePipe,
              public authService:AuthorizationManager
              ) {

    this.uiassist = new UiAssist(this);

    //Client search form Group
    this.csearch = this.fb.group({
      'csname': new FormControl(),
      'caddress': new FormControl(),
      'cemail': new FormControl()
    });

    this.form= this.fb.group({
      'name': new FormControl('',[Validators.required]),
      'address': new FormControl('',[Validators.required]),
      'mobile': new FormControl('',[Validators.required]),
      'email': new FormControl('',[Validators.required]),
      'staffcount': new FormControl('',[Validators.required]),
      'description': new FormControl(),
      'photo': new FormControl()

    });
  }

  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }

  selectImage(e:any): void{
    if (e.target.files){
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{this.imgedivUrl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage():void{
    this.imgedivUrl='assets/userold.png';
    this.form.controls['photo'].setErrors({'required': true});
  }

  loadForm(){
    this.oldDivObj =undefined;
    this.form.reset();
    this.clearImage();
    Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
    this.loadTable("");
    this.enaleButtons(true, false, false);
  }

  //filter table
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    // @ts-ignore
    this.data.filterPredicate = (div: Division, filter: string)=>{
      return(csearchdata.csname==null||div.name.toLowerCase().includes(csearchdata.csname))&&
        (csearchdata.cemail==null||div.email.toLowerCase().includes(csearchdata.cemail))&&
        (csearchdata.caddress==null||div.address.toLowerCase().includes(csearchdata.caddress));
    }
    this.data.filter="xx";
  }

  // Load the Main Table data
  loadTable(query:string){
    this.divisionservice.getAll(query)
      .then((div: Division[]) => {this.divisions=div; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.divisions); this.data.paginator=this.paginator;});

  }

  ngOnInit(){
    this.initialize();
  }

  initialize() {
    this.createView();

    this.regexservice.get('division').then((regs: []) =>{
      this.regexes = regs;
      console.log("R" + this.regexes['email']['regex']);
      this.createForm();
    });
  }


  //Validate All form field
  createForm() {
    // this.form.controls['fullname']?.setValidators([Validators.required,Validators.pattern(this.regexes['fullname']['regex'])]);
    this.form.controls['name']?.setValidators([Validators.required,Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['address']?.setValidators([Validators.required,Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['email']?.setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['mobile']?.setValidators([Validators.required,Validators.pattern(this.regexes['mobile']['regex'])]);
    this.form.controls['description']?.setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['staffcount']?.setValidators([Validators.required,Validators.pattern(this.regexes['staffcount']['regex'])]);
    this.form.controls['photo'].setValidators([]);

    this.loadForm();
  }


   enaleButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  add() {

   this.divObj  = this.form.getRawValue();
    console.log(this.form.controls['star']);
  }
  //Form Errors handle
  getErrors(){
    let errors:string='';
    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];
      if (control.errors){
        if (this.regexes[controlName]!=undefined){
          errors=errors+"<br>"+ this.regexes[controlName]['message'];}
        else
        {errors =errors+"<br>Invalid "+ controlName;}
      }
    }
    return errors;
  }


  //Get updates
  getUpdates(): string{
    let updates: string = "";
    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];
      if (control.dirty){
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }


  // Update function
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Division Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    } else {
      let updates: string = this.getUpdates();
      if (updates != "") {
        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";
        const confirm = this.matDialog.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Server Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.divObj = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.divObj.photo = btoa(this.imgedivUrl);
            else { // @ts-ignore
              this.divObj.photo = this.oldDivObj.photo;
            }

            // @ts-ignore
            this.divObj.id = this.oldDivObj.id;
            this.divisionservice.update(this.divObj).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                // @ts-ignore
                updstatus = responce['errors'] == "";

                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.loadForm();

              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Division Data Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Division Data Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }



  delete(divObj: any) {

  }

  //Fill form
  fillForm(division: Division){

    this.enaleButtons(false,true,true);

    this.selectedRow=division;

    this.divObj = JSON.parse(JSON.stringify(division));
    // console.log(this.staffObj)
    this.oldDivObj = JSON.parse(JSON.stringify(division));
    console.log(this.divObj);

    if (this.divObj.photo != null){
      this.imgedivUrl = atob(this.divObj.photo);
      this.form.controls['photo'].clearValidators();
    }else {
      this.clearImage();
    }

    this.divObj.photo = "";

    this.form.patchValue(this.divObj);
    this.form.markAsPristine();
  }

  //Clear Form
  currentRating: any;
  clearForm() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Clear Form",
        message: "Are you sure to Clear folowing Data ? <br> <br>"
      }
    });
    confirm.afterClosed().subscribe(async result =>{
      if (result){
        this.loadForm();
      }
    });
  }

  handleRatingUpdated($event: number) {

  }
}
