import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";


import {Procategory} from "../../../entity/procategory";
import {Staff} from "../../../entity/staff";

import {MatDialog} from "@angular/material/dialog";
import {Regexservice} from "../../../service/regexservice";
import {DatePipe, Time} from "@angular/common";

import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Subject} from "../../../entity/subject";
import {Prostatus} from "../../../entity/prostatus";
import {Procategoryservice} from "../../../service/procategoryservice";
import {Prostatusservice} from "../../../service/prostatusservice";
import {Subjectservice} from "../../../service/subjectservice";
import {Staffservice} from "../../../service/staffservice";
import * as path from "path";
import {isEmpty} from "rxjs";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Substatusservice} from "../../../service/substatusservice";
import {Sublevelservice} from "../../../service/sublevelservice";
import {Submediumservice} from "../../../service/submediumservice";
import {Submedium} from "../../../entity/submedium";
import {Sublevel} from "../../../entity/sublevel";
import {Substatus} from "../../../entity/substatus";
import {parseJson} from "@angular/cli/src/utilities/json-file";

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent {

  //Table columns
  columns: string[] = ['name','description','studentcount','teachercount', 'creatordate','submedium','substatus','sublevel'];
  headers: string[] = ['Name','Student-Count','Teacher-Count','Medium','Status','Level','Description','Creator-Date'];
  binders: string[] = ['name','studentcount','teachercount','submedium.name','substatus.name','sublevel.name','description','creatordate'];

  //Client Search columns
  cscolumns: string[] = ['csname','csstatus','cssubmedium','cssubevel'];
  csprompts: string[] = ['Search by Name','Search by Subject status', 'Search by Subject medium', 'Search by Subject level'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  selectedRow: any;

  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;

  subObj!: Subject;
  oldsubObj!: Subject| undefined;
  formattedTime: string | undefined;

  subjects: Array<Subject> = [];
  imageurl : string = '';
  data!: MatTableDataSource<Subject>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  submediums: Array<Submedium> = [];
  sublevels: Array<Sublevel> = [];
  substatuses: Array<Substatus> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor(private subjectservice: Subjectservice,
              private substatusservice:Substatusservice,
              private sublevelservice: Sublevelservice,
              private submediumservice: Submediumservice,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private dp: DatePipe,
              ) {

    this.uiassist = new UiAssist(this);

    //Client search form Group
    this.csearch = this.fb.group({
      'csname': new FormControl(),
      'csstatus': new FormControl(),
      'cssubmedium': new FormControl(),
      'cssubevel': new FormControl()
    });

    //Server search form Group
    this.ssearch = this.fb.group({
      'sscategory': new FormControl(),
      'sstatus': new FormControl(),
      'ssdate': new FormControl(),
      'sscreator': new FormControl(),

    });

    const today = new Date();
    console.log(today)
    const formattedDate = today.toISOString().split("T")[0];

    this.form= this.fb.group({
      'name': new FormControl('',[Validators.required]),
      'description': new FormControl(''),
      'studentcount': new FormControl('',[Validators.required]),
      'teachercount': new FormControl('',[Validators.required]),
      'creatordate': new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'submedium': new FormControl('',[Validators.required]),
      'substatus': new FormControl('',[Validators.required]),
      'sublevel': new FormControl('',[Validators.required])
    });
  }

  // Table filter method according to a client search method
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    // @ts-ignore
    this.data.filterPredicate = (sub: Subject, filter: string)=>{
      return(csearchdata.csname==null||sub.name.toLowerCase().includes(csearchdata.csname))&&
        (csearchdata.csstatus==null||sub.substatus.name.toLowerCase().includes(csearchdata.csstatus))&&
        (csearchdata.cssubmedium==null||sub.submedium.name.toLowerCase().includes(csearchdata.cssubmedium))&&
        (csearchdata.cssubevel==null||sub.sublevel.name.toLowerCase().includes(csearchdata.cssubevel))

    }
    this.data.filter="xx";
  }

  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }

  // Load the Main Table data
  loadTable(query:string){
    this.subjectservice.getAll(query)
      .then((pros: Subject[]) => {this.subjects=pros; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.subjects); this.data.paginator=this.paginator;});

  }

  ngOnInit(){
    this.initialize();
  }

  initialize() {
    this.createView();

    this.sublevelservice.getAllList().then((levels: Sublevel[]) =>{this.sublevels = levels;});
    this.submediumservice.getAllList().then((mediums: Submedium[]) =>{this.submediums = mediums;});
    this.substatusservice.getAllList().then((statuses: Substatus[]) =>{this.substatuses = statuses;});
    // this.staffservice.getAllByStaffdesignation().then((designs: Staff[]) =>{this.staffCreators = designs;});
    this.regexservice.get('subject').then((regs: []) =>{
      this.regexes = regs;
      this.createForm();
    });
  }


  //Validate All form field
  createForm() {
    this.form.controls['name']?.setValidators([Validators.required,Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['creatordate']?.setValidators([Validators.required]);
    this.form.controls['description']?.setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['teachercount']?.setValidators([Validators.required,Validators.pattern(this.regexes['teachercount']['regex'])]);
    this.form.controls['studentcount']?.setValidators([Validators.required,Validators.pattern(this.regexes['studentcount']['regex'])]);
    this.form.controls['submedium']?.setValidators([Validators.required]);
    this.form.controls['substatus']?.setValidators([Validators.required]);
    this.form.controls['sublevel']?.setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="creatordate")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

        if (this.oldsubObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.subObj[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    this.enaleButtons(true, false, false);

  }
  clearMainForm(){
    this.form.controls['name'].reset();
    this.form.controls['description'].reset();
    this.form.controls['teachercount'].reset();
    this.form.controls['studentcount'].reset();
    this.form.controls['submedium'].reset();
    this.form.controls['substatus'].reset();
    this.form.controls['sublevel'].reset();

  }

  enaleButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  //Fill form
  fillForm(subject: Subject){

    this.form.controls['creatordate'].disable();

    this.enaleButtons(false,true,true);

    this.selectedRow=subject;

    this.subObj = JSON.parse(JSON.stringify(subject));
    // console.log(this.staffObj)
    this.oldsubObj = JSON.parse(JSON.stringify(subject));

    // @ts-ignore
    this.subObj.submedium = this.submediums.find(submedium => submedium.id  === this.subObj.submedium.id);
    // @ts-ignore
    this.subObj.sublevel = this.sublevels.find(sublevel=> sublevel.id === this.subObj.sublevel.id);
    // @ts-ignore
    this.subObj.substatus = this.substatuses.find(substatus=> substatus.id === this.subObj.substatus.id);

    this.form.patchValue(this.subObj);
    this.form.markAsPristine();


  }

  //Server search form add button
  btnSearchMc() {

    const sserchdata = this.ssearch.getRawValue();

    let categoryid = sserchdata.sscategory;
    let statusid = sserchdata.sstatus;
    let date = sserchdata.ssdate;
    let creatorid = sserchdata.sscreator;

    let query = '';

    if (date != null && typeof date === 'string' && date.trim() !== '') query+= "&date="+encodeURIComponent(date);
    if (statusid != null) query+="&statusid="+statusid;
    if (categoryid != null) query+="&categoryid="+categoryid;
    if (creatorid != null) query+="&classid="+creatorid;


    if (query !="") query = query.replace(/^./,"?");

    console.log(query);

    this.loadTable(query);

  }

  //Server search form clear button
  btnSearchClearMc() {
    // @ts-ignore
    const cofirm = this.matDialog.open(ConfirmComponent,{
      with: '500px',
      data: {heading: "Search Clear", message: "Are you sure to clear the Search?"}
    });

    cofirm.afterClosed().subscribe(async result => {
      if (result){
        this.ssearch.reset();
        this.loadTable("");
      }
    });
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

  //Subject Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Subject Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.subObj = this.form.getRawValue();
      // this.subObj.studentcount = JSON.parse(this.subObj.studentcount);
      // // @ts-ignore
      // this.subObj.teachercount = JSON.parse(this.subObj.teachercount);
      //console.log("Photo-Before"+this.staff.photo);
      //console.log("Photo-After"+this.staff.photo);
      let proData: string = "";
      proData = proData + "<br>Subject Name is : "+ this.subObj.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Subject Add",
          message: "Are you sure to Add the folowing Subject Details? <br> <br>"+ proData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.subjectservice.add(this.subObj).then((responce: []|undefined) => {
            console.log("Res-"+responce);
            console.log("Un-"+responce==undefined);
            if(responce!=undefined){ // @ts-ignore
              console.log("Add-"+responce['id']+"-"+responce['url']+"-"+(responce['errors']==""));
              // @ts-ignore
              addstatus = responce['errors']=="";
              console.log("Add Sta-"+addstatus);
              if(!addstatus) { // @ts-ignore
                addmessage=responce['errors'];
              }
            }
            else{
              console.log("undefined");
              addstatus=false;
              addmessage="Content Not Found"
            }
          }).finally( () =>{
            if(addstatus) {
              addmessage = "Successfully Saved";
              this.oldsubObj =undefined;
              this.clearMainForm();
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.loadTable("");
              this.enaleButtons(true, false, false);
            }
            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Subject Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => { if (!result) { return;} }) ;} );
        }
      });
    }
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
        data: {heading: "Errors - Subject Update ", message: "You have following Errors <br> " + errors}
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
            this.subObj = this.form.getRawValue();

            // @ts-ignore
            this.subObj.id = this.oldsubObj.id;
            this.subjectservice.update(this.subObj).then((responce: [] | undefined) => {
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
                this.oldsubObj =undefined;
                this.form.controls['creatordate'].enable();
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.loadTable("");
                this.enaleButtons(true, false, false);

              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Subject Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Subject Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }


  //Clear Form
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
        this.oldsubObj =undefined;
        this.form.controls['creatordate'].enable();
        this.clearMainForm();
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.loadTable("");
        this.enaleButtons(true, false, false);
      }
    });
  }


  //Delete Method
  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Subject Delete",
        message: "Are you sure to Delete folowing Subject Delete? <br> <br>" +
          this.subObj.name
      }
    });
   try {
     confirm.afterClosed().subscribe(async result => {
       if (result) {
         let delstatus: boolean = false;
         let delmessage: string = "Server Not Found";
         // @ts-ignore
         this.subjectservice.delete(this.subObj.id).then((responce: [] | undefined) => {
           if (responce != undefined) { // @ts-ignore
             delstatus = responce['errors'] == "";
             if (!delstatus) { // @ts-ignore
               delmessage = responce['errors'];
             }
           } else {
             delstatus = false;
             delmessage = "Content Not Found"
           }
         } ).finally(() => {
           if (delstatus) {
             delmessage = "Successfully Deleted";
             this.oldsubObj =undefined;
             this.clearMainForm();
             Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
             this.loadTable("");
             this.enaleButtons(true, false, false);
           }
           const stsmsg = this.matDialog.open(MessageComponent, {
             width: '500px',
             data: {heading: "Status - Subject Delete ", message: delmessage}
           });
           stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
           });
         });
       }
     });
   } catch (error) {
        // Handle the error appropriately (e.g., log the error)
        console.error("Error occurred during subject deletion:", error);
        // Show a generic error message to the user
        const errMsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: { heading: "Error", message: "An error occurred during subject deletion." }
        });
      }
  }

}

