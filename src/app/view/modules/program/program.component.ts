import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";


import {Procategory} from "../../../entity/procategory";
import {Staff} from "../../../entity/staff";
import {UiAssist} from "../../../util/ui.assist/ui.assist";

import {MatDialog} from "@angular/material/dialog";
import {Regexservice} from "../../../service/regexservice";
import {DatePipe, Time} from "@angular/common";

import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Program} from "../../../entity/program";
import {Prostatus} from "../../../entity/prostatus";
import {Procategoryservice} from "../../../service/procategoryservice";
import {Prostatusservice} from "../../../service/prostatusservice";
import {Programservice} from "../../../service/programservice";
import {Staffservice} from "../../../service/staffservice";
import * as path from "path";
import {isEmpty} from "rxjs";
import {Staffdesignation} from "../../../entity/staffdesignation";
import {Staffdesignationservice} from "../../../service/staffdesignationservice";
import {Grade} from "../../../entity/grade";
import {Meeting} from "../../../entity/meeting";

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent {

  //Table columns
  columns: string[] = ['topic','staff','duration','date', 'location','starttime','endtime', 'prostatus','procategory','description'];
  headers: string[] = ['Topic','Coordinator','Duration','Date','Location','Start-time', 'End-time','Program-Status','Category','Description'];
  binders: string[] = ['topic','staff.fullname','getModi()','date','location','starttime','endtime','prostatus.name','getCategoty()','description'];

  //Client Search columns
  cscolumns: string[] = ['cstopic','csstaff','cslocation','csprostatus', 'cscreator'];
  csprompts: string[] = ['Search by Topic','Search by Coordinator', 'Search by location', 'Search by Program status', "Search By Creator Name"];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  selectedRow: any;

  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;

  proObj!: Program;
  oldproObj!: Program| undefined;
  procategotyOBJ!: Procategory| undefined;
  formattedTime: string | undefined;

  programs: Array<Program> = [];
  imageurl : string = '';
  data!: MatTableDataSource<Program>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  prostatuses: Array<Prostatus> = [];
  procategories: Array<Procategory> = [];
  staffdesignations: Array<Staffdesignation> = [];
  staffs: Array<Staff> = [];
  staffCreators: Array<Staff> = [];
  regexes: any;

  uiassist: UiAssist;

  constructor(private procategoryservice: Procategoryservice,
              private prostatusservice:Prostatusservice,
              private designationservice :Staffdesignationservice,
              private staffservice: Staffservice,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private dp: DatePipe,
              private programservice: Programservice) {
    this.uiassist = new UiAssist(this);

    //Client search form Group
    this.csearch = this.fb.group({
      'cstopic': new FormControl(),
      'csstaff': new FormControl(),
      'cslocation': new FormControl(),
      'csprostatus': new FormControl(),
      'cscreator': new FormControl()

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
      'topic': new FormControl('',[Validators.required]),
      'designation': new FormControl('',[Validators.required]),
      'staff': new FormControl('',[Validators.required]),
      'duration': new FormControl('',[Validators.required]),
      'description': new FormControl(''),
      'date': new FormControl('',[Validators.required ]),
      'location': new FormControl('',[Validators.required]),
      'count': new FormControl('',[Validators.required]),
      'starttime': new FormControl('',[Validators.required]),
      'endtime': new FormControl('',[Validators.required]),
      'docreated': new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required]),
      'prostatus': new FormControl('',[Validators.required]),
      'procategory': new FormControl('',[Validators.required]),
      'staffCreator': new FormControl('',[Validators.required ])
    });
  }

  // Table filter method according to a client search method
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    // @ts-ignore
    this.data.filterPredicate = (pro: Program, filter: string)=>{
      return(csearchdata.cstopic==null||pro.topic.toLowerCase().includes(csearchdata.cstopic))&&
        (csearchdata.csstaff==null||pro.staff.fullname.toLowerCase().includes(csearchdata.csstaff))&&
        (csearchdata.cslocation==null||pro.location.toLowerCase().includes(csearchdata.cslocation))&&
        (csearchdata.csprostatus==null||pro.prostatus.name.toLowerCase().includes(csearchdata.csprostatus))&&
        (csearchdata.cscreator==null||pro.staffCreator.callingname.toLowerCase().includes(csearchdata.cscreator))

    }
    this.data.filter="xx";
  }

  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }

  // Load the Main Table data
  loadTable(query:string){
    this.programservice.getAll(query)
      .then((pros: Program[]) => {this.programs=pros; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.programs); this.data.paginator=this.paginator;});

  }

  loadstaff(id: number) {
    // @ts-ignore
    this.staffservice.getById(id).then((stf: Staff[]) =>{this.staffs = stf;});
  }

  getModi(element: Program) {
    // @ts-ignore
    if (element.duration.toString()[1]){
      return element.duration+'0';
    }else {
      return element.duration+'.00';
    }

  }

  // @ts-ignore
  getCategoty(element: Program){

    if (element.procategory.schdesignation == null) {
      // @ts-ignore
     return  element.procategory.gradetype.name
    }else{
      // @ts-ignore
      return  element.procategory.schdesignation.name
    }

  }
  ngOnInit(){
    this.initialize();
  }

  initialize() {
    this.createView();

    this.staffservice.getAllbyFullname().then((full: Staff[]) =>{this.staffs = full;});
     this.procategoryservice.getAllList().then((categies: Procategory[]) =>{
        this.procategories = categies;
       // @ts-ignore
       this.procategotyOBJ = categies;
       if (this.procategotyOBJ?.schdesignation == null && this.procategotyOBJ?.gradetype != null) {
         // @ts-ignore
         this.procategories = [this.procategotyOBJ.gradetype];
         this.form.controls['procategory'].setValue(this.procategotyOBJ.gradetype);
       } else if (this.procategotyOBJ?.gradetype == null && this.procategotyOBJ?.schdesignation != null) {
         // @ts-ignore
         this.procategories = [this.procategotyOBJ.schdesignation];
         this.form.controls['procategory'].setValue(this.procategotyOBJ.schdesignation);
       }
     });
     this.prostatusservice.getAllList().then((statuses: Prostatus[]) =>{this.prostatuses = statuses;});
     this.designationservice.getAllList().then((designs: Staffdesignation[]) =>{this.staffdesignations = designs;});
     this.staffservice.getAllByStaffdesignation().then((designs: Staff[]) =>{this.staffCreators = designs;});
    this.regexservice.get('program').then((regs: []) =>{
      this.regexes = regs;
      this.createForm();
    });
  }

  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form.controls['topic'].reset();
    this.form.controls['designation'].reset();
    this.form.controls['staff'].reset();
    this.form.controls['duration'].reset();
    this.form.controls['description'].reset();
    this.form.controls['date'].reset()
    this.form.controls['location'].reset();
    this.form.controls['count'].reset();
    this.form.controls['starttime'].reset();
    this.form.controls['endtime'].reset();
    this.form.controls['domodified'].reset();
    this.form.controls['prostatus'].reset();
    this.form.controls['procategory'].reset();
    this.form.controls['staffCreator'].reset();

    this.form.controls['docreated'].setValue(formattedDate);
  }

  //Validate All form field
  createForm() {
    this.form.controls['topic']?.setValidators([Validators.required,Validators.pattern(this.regexes['topic']['regex'])]);
    this.form.controls['designation']?.setValidators([Validators.required]);
    this.form.controls['staff']?.setValidators([Validators.required]);
    this.form.controls['duration']?.setValidators([Validators.required,Validators.pattern(this.regexes['duration']['regex'])]);
    this.form.controls['description']?.setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['date']?.setValidators([Validators.required]);
    this.form.controls['location']?.setValidators([Validators.required,Validators.pattern(this.regexes['location']['regex'])]);
    this.form.controls['count']?.setValidators([Validators.required,Validators.pattern(this.regexes['count']['regex'])]);
    this.form.controls['starttime']?.setValidators([Validators.required]);
    this.form.controls['endtime']?.setValidators([Validators.required]);
    this.form.controls['docreated']?.setValidators([Validators.required]);
    this.form.controls['domodified']?.setValidators([Validators.required]);
    this.form.controls['prostatus']?.setValidators([Validators.required]);
    this.form.controls['procategory']?.setValidators([Validators.required]);
    this.form.controls['prostatus']?.setValidators([Validators.required]);
    this.form.controls['staffCreator']?.setValidators([Validators.required]);

     Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="date" || controlName == "docreated" || controlName == "domodified")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

        if (this.oldproObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.proObj[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    this.enaleButtons(true, false, false);

  }


  enaleButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  //Fill form
  fillForm(program: Program){
    this.form.controls['domodified'].enable();
    this.form.controls['docreated'].disable();

    this.enaleButtons(false,true,true);

    this.selectedRow=program;

    this.proObj = JSON.parse(JSON.stringify(program));
    // console.log(this.staffObj)
    this.oldproObj = JSON.parse(JSON.stringify(program));

    // @ts-ignore
    this.proObj.designation = this.staffdesignations.find(desigs => desigs.id === this.proObj.staff.staffdesignation.id);
    // @ts-ignore
    this.proObj.procategory = this.procategories.find(procategory=> procategory.id === this.proObj.procategory.id);
    // @ts-ignore
    this.proObj.prostatus = this.prostatuses.find(prostatus=> prostatus.id === this.proObj.prostatus.id);

    // @ts-ignore
    this.staffservice.getById(this.proObj.designation.id).then((stf: Staff[]) =>{
      this.staffs = stf;
      // @ts-ignore
      this.proObj.staffCreator = this.staffs.find(staff=> staff.id === this.proObj.staff.id);
      // @ts-ignore
      this.proObj.staff = this.staffs.find(staff=> staff.id === this.proObj.staff.id);

      if (this.proObj.domodified != null) {
        // @ts-ignore
        this.proObj.domodified = null;
        this.form.patchValue(this.proObj);
        this.form.markAsPristine();
      } else {
        this.form.patchValue(this.proObj);
        this.form.markAsPristine();
      }
    });

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

  //Program Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Program Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{

      this.proObj = this.form.getRawValue();
      //console.log(this.proObj);
      // @ts-ignore
      this.proObj.count = JSON.parse(this.proObj.count);

      const endtimeField = document.getElementById("endtimeInput");
      // @ts-ignore
      const endinputValue = endtimeField.value;

      const timeComponents1 = endinputValue.split(':');
      const hours1 = timeComponents1[0];
      const minutes1 = timeComponents1[1];
      const seconds1 = "00";

      this.proObj.endtime = `${hours1}:${minutes1}:${seconds1}`;

      const inputField = document.getElementById("starttimeInput");
      // @ts-ignore
      const startinputValue = inputField.value;

      const timeComponents = startinputValue.split(':');
      const hours = timeComponents[0];
      const minutes = timeComponents[1];
      const seconds = "00";
      this.proObj.starttime = `${hours}:${minutes}:${seconds}`;

      let proData: string = "";
      proData = proData + "<br>Program Topic is : "+ this.proObj.topic;
      proData = proData + "<br>Program Coordinator is : "+ this.proObj.staff.fullname;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Program Add",
          message: "Are you sure to Add the folowing Program Details? <br> <br>"+ proData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      console.log(this.proObj);
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.programservice.add(this.proObj).then((responce: []|undefined) => {
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
              this.form.controls['domodified'].disable();
              this.oldproObj =undefined;
              this.clearMainForm();
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.loadTable("");
              this.enaleButtons(true, false, false);
            }
            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Program Add", message: addmessage}
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
        data: {heading: "Errors - Program Update ", message: "You have following Errors <br> " + errors}
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
            this.proObj = this.form.getRawValue();

            const inputField = document.getElementById("starttimeInput");
            // @ts-ignore
            const startinputValue = inputField.value;

            const timeComponents = startinputValue.split(':');
            const hours = timeComponents[0];
            const minutes = timeComponents[1];
            const seconds = "00";
            this.proObj.starttime = `${hours}:${minutes}:${seconds}`;

            const endtimeField = document.getElementById("endtimeInput");
            // @ts-ignore
            const endinputValue = endtimeField.value;
            console.log(endinputValue);

            const timeComponents1 = endinputValue.split(':');
            const hours1 = timeComponents1[0];
            const minutes1 = timeComponents1[1];
            const seconds1 = "00";

            this.proObj.endtime = `${hours1}:${minutes1}:${seconds1}`;

            // @ts-ignore
            this.proObj.id = this.oldproObj.id;
            this.programservice.update(this.proObj).then((responce: [] | undefined) => {
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
                this.form.controls['domodified'].disable();
                this.form.controls['docreated'].enable();
                this.oldproObj =undefined;
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.loadTable("");
                this.enaleButtons(true, false, false);

              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Program Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Program Update", message: "Nothing Changed"}
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
        this.oldproObj =undefined;
        this.form.controls['domodified'].disable();
        this.form.controls['docreated'].enable();
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
        heading: "Confirmation - Program Delete",
        message: "Are you sure to Delete folowing Program Delete? <br> <br>" +
          this.proObj.topic
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.programservice.delete(this.proObj.id).then((responce: [] | undefined) => {
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
            this.oldproObj =undefined;
            this.form.controls['domodified'].disable();
            this.form.controls['docreated'].enable();
            this.clearMainForm();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.loadTable("");
            this.enaleButtons(true, false, false);
          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Program Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

}
