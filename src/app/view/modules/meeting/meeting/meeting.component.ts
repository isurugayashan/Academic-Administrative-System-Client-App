import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../../util/ui.assist/ui.assist";
import {Meeting} from "../../../../entity/meeting";
import {Staff} from "../../../../entity/staff";
import {Staffdesignation} from "../../../../entity/staffdesignation";
import {Prostatus} from "../../../../entity/prostatus";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Regexservice} from "../../../../service/regexservice";
import {Prostatusservice} from "../../../../service/prostatusservice";
import {Staffservice} from "../../../../service/staffservice";
import {Meetingservice} from "../../../../service/meetingservice";
import {Staffdesignationservice} from "../../../../service/staffdesignationservice";
import {MessageComponent} from "../../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../../util/dialog/confirm/confirm.component";
import {User} from "../../../../entity/user";
import {Program} from "../../../../entity/program";
import {Procategory} from "../../../../entity/procategory";
import {Procategoryservice} from "../../../../service/procategoryservice";


@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent {

  //Table columns
  columns: string[] = ['title','text','duration','startdate', 'starttime','endtime','staff','procategory','location', 'meetingstatus'];
  headers: string[] = ['Title','Message','Duration','Date','Start-time','End-time','Coordinator', 'Meeting-Category','Location','Meeting-Status'];
  binders: string[] = ['title','text','getModi()','startdate','starttime','endtime','staff.fullname','getCategoty()','location','meetingstatus.name'];

  //Client Search columns
  cscolumns: string[] = ['cstitle','csmeetingtype','csmeetingstatus','csstaff'];
  csprompts: string[] = ['Search by Title','Search by Meeting type', 'Search by Meeting status','Search by Coordinator'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  selectedRow: any;

  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;

  modified: boolean = false;

  meetObj!: Meeting;
  oldmeetObj!: Meeting| undefined;
  procategotyOBJ!: Procategory| undefined;
  formattedTime: string | undefined;

  meetings: Array<Meeting> = [];
  imageurl : string = '';
  data!: MatTableDataSource<Meeting>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  prostatuses: Array<Prostatus> = [];
  procategories: Array<Procategory> = [];
  staffdesignations: Array<Staffdesignation> = [];
  staffs: Array<Staff> = [];
  staffCreators: Array<Staff> = [];
  regexes: any;

  uiassist: UiAssist;

  constructor(private prostatusservice:Prostatusservice,
              private designationservice :Staffdesignationservice,
              private staffservice: Staffservice,
              private procategoryservice: Procategoryservice,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private dp: DatePipe,
              private meetingservice: Meetingservice) {
    this.uiassist = new UiAssist(this);

    //Client search form Group
    this.csearch = this.fb.group({
      'cstitle': new FormControl(),
      'csstaff': new FormControl(),
      'csmeetingtype': new FormControl(),
      'csmeetingstatus': new FormControl()
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
      'title': new FormControl('',[Validators.required]),
      'text': new FormControl('',[Validators.required]),
      'duration': new FormControl('',[Validators.required]),
      'startdate': new FormControl('',[Validators.required]),
      'starttime': new FormControl('',[Validators.required]),
      'endtime': new FormControl('',[Validators.required ]),
      'docreated': new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required]),
      'description': new FormControl(''),
      'staff': new FormControl('',[Validators.required]),
      'designation': new FormControl('',[Validators.required]),
      'staffCreator': new FormControl('',[Validators.required]),
      'meetingstatus': new FormControl('',[Validators.required]),
      'location': new FormControl('',[Validators.required]),
      'procategory': new FormControl('',[Validators.required ])
    });
  }

  // Table filter method according to a client search method
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    // @ts-ignore
    this.data.filterPredicate = (meet: Meeting, filter: string)=>{
      return(csearchdata.cstitle==null||meet.title.toLowerCase().includes(csearchdata.cstitle))&&
        (csearchdata.csstaff==null||meet.staff.fullname.toLowerCase().includes(csearchdata.csstaff))&&
        (csearchdata.csmeetingtype == null || (meet.procategory.schdesignation && meet.procategory.schdesignation.name.toLowerCase().includes(csearchdata.csmeetingtype)) || (meet.procategory.gradetype && meet.procategory.gradetype.name.toLowerCase().includes(csearchdata.csmeetingtype)))&&
        (csearchdata.csmeetingstatus==null||meet.meetingstatus.name.toLowerCase().includes(csearchdata.csmeetingstatus))
    }
    this.data.filter="xx";
  }

  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }

  // Load the Main Table data
  loadTable(query:string){
    this.meetingservice.getAll(query)
      .then((pros: Meeting[]) => {this.meetings=pros; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.meetings); this.data.paginator=this.paginator;});

  }

  //Load staff
  loadstaff(id: number) {
    // @ts-ignore
    this.staffservice.getById(id).then((stf: Staff[]) =>{this.staffs = stf;});
  }


  getModi(element: Meeting) {
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
    //this.staffservice.getAllbyFullname().then((full: Staff[]) =>{this.staffs = full;});
    this.prostatusservice.getAllList().then((statuses: Prostatus[]) =>{this.prostatuses = statuses;});
    this.designationservice.getAllList().then((designs: Staffdesignation[]) =>{this.staffdesignations = designs;});
    this.staffservice.getAllByStaffdesignation().then((designs: Staff[]) =>{this.staffCreators = designs;});
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
    this.regexservice.get('meeting').then((regs: []) =>{
      this.regexes = regs;
      this.createForm();
    });
    // this.createSearch();
    this.createForm();
  }


  //Validate All form field
  createForm() {
    this.form.controls['title']?.setValidators([Validators.required,Validators.pattern(this.regexes['title']['regex'])]);
    this.form.controls['designation']?.setValidators([Validators.required]);
    this.form.controls['text']?.setValidators([Validators.required,Validators.pattern(this.regexes['text']['regex'])]);
    this.form.controls['duration']?.setValidators([Validators.required,Validators.pattern(this.regexes['duration']['regex'])]);
    this.form.controls['startdate']?.setValidators([Validators.required]);
    this.form.controls['starttime']?.setValidators([Validators.required]);
    this.form.controls['endtime']?.setValidators([Validators.required]);
    this.form.controls['docreated']?.setValidators([Validators.required]);
    this.form.controls['domodified']?.setValidators([Validators.required]);
    this.form.controls['description']?.setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['staff']?.setValidators([Validators.required]);
    this.form.controls['staffCreator']?.setValidators([Validators.required]);
    this.form.controls['meetingstatus']?.setValidators([Validators.required]);
    this.form.controls['location']?.setValidators([Validators.required,Validators.pattern(this.regexes['location']['regex'])]);
    this.form.controls['procategory']?.setValidators([Validators.required]);


     Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="startdate" || controlName == "docreated" || controlName == "domodified")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

        if (this.oldmeetObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.meetObj[controlName]){ control.markAsPristine(); }
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

  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form.controls['title'].reset();
    this.form.controls['text'].reset();
    this.form.controls['duration'].reset();
    this.form.controls['startdate'].reset();
    this.form.controls['domodified'].reset();
    this.form.controls['starttime'].reset();
    this.form.controls['endtime'].reset();
    this.form.controls['description'].reset()
    this.form.controls['staff'].reset();
    this.form.controls['designation'].reset();
    this.form.controls['location'].reset();
    this.form.controls['procategory'].reset();
    this.form.controls['staffCreator'].reset();
    this.form.controls['meetingstatus'].reset();

    this.form.controls['docreated'].setValue(formattedDate);
  }

  //Fill form
  fillForm(meeting: Meeting){
    this.form.controls['domodified'].enable();
    this.form.controls['docreated'].disable();

    this.enaleButtons(false,true,true);

    this.selectedRow=meeting;

    this.meetObj = JSON.parse(JSON.stringify(meeting));
    console.log(this.meetObj)
    this.oldmeetObj = JSON.parse(JSON.stringify(meeting));

    // @ts-ignore
    this.meetObj.designation = this.staffdesignations.find(desigs => desigs.id === this.meetObj.staff.staffdesignation.id);
    // @ts-ignore
    this.meetObj.procategory = this.procategories.find(procategory=> procategory.id === this.meetObj.procategory.id);
    // @ts-ignore
    this.meetObj.meetingstatus = this.prostatuses.find(prostatus=> prostatus.id === this.meetObj.meetingstatus.id);

    // @ts-ignore
    this.staffservice.getById(this.meetObj.designation.id).then((stf: Staff[]) =>{
      this.staffs = stf;
      // @ts-ignore
      this.meetObj.staffCreator = this.staffs.find(staff=> staff.id === this.meetObj.staffCreator.id);
      // @ts-ignore
      this.meetObj.staff = this.staffs.find(staff=> staff.id === this.meetObj.staff.id);
       this.form.patchValue(this.meetObj);
        this.form.markAsPristine();
    });
    if (this.meetObj.domodified != null) {
      // @ts-ignore
      this.meetObj.domodified = null;
      this.form.patchValue(this.meetObj);
      this.form.markAsPristine();
    } else {
      this.form.patchValue(this.meetObj);
      this.form.markAsPristine();
    }


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

  //Meeting Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Meeting Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{

      this.meetObj = this.form.getRawValue();
      const endtimeField = document.getElementById("endtimeInput");
      // @ts-ignore
      const endinputValue = endtimeField.value;
      const timeComponents1 = endinputValue.split(':');
      const hours1 = timeComponents1[0];
      const minutes1 = timeComponents1[1];
      const seconds1 = "00";

      this.meetObj.endtime = `${hours1}:${minutes1}:${seconds1}`;

      const inputField = document.getElementById("starttimeInput");
      // @ts-ignore
      const startinputValue = inputField.value;

      const timeComponents = startinputValue.split(':');
      const hours = timeComponents[0];
      const minutes = timeComponents[1];
      const seconds = "00";
      this.meetObj.starttime = `${hours}:${minutes}:${seconds}`;

      // // @ts-ignore
      // this.meetObj.duration = parseFloat(this.meetObj.duration).toFixed(2);

      let proData: string = "";
      proData = proData + "<br>Meeting Topic is : "+ this.meetObj.title;
      proData = proData + "<br>Meeting Coordinator is : "+ this.meetObj.staff.fullname;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Meeting Add",
          message: "Are you sure to Add the folowing Meeting Details? <br> <br>"+ proData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.meetingservice.add(this.meetObj).then((responce: []|undefined) => {
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
              this.oldmeetObj =undefined;
              this.form.controls['domodified'].disable();
              this.clearMainForm();
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.loadTable("");
              this.enaleButtons(true, false, false);
            }
            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Meeting Add", message: addmessage}
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
        data: {heading: "Errors - Meeting Update ", message: "You have following Errors <br> " + errors}
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
            this.meetObj = this.form.getRawValue();

            const endtimeField = document.getElementById("endtimeInput");
            // @ts-ignore
            const endinputValue = endtimeField.value;

            const timeComponents1 = endinputValue.split(':');
            const hours1 = timeComponents1[0];
            const minutes1 = timeComponents1[1];
            const seconds1 = "00";

            this.meetObj.endtime = `${hours1}:${minutes1}:${seconds1}`;

            const inputField = document.getElementById("starttimeInput");
            // @ts-ignore
            const startinputValue = inputField.value;

            const timeComponents = startinputValue.split(':');
            const hours = timeComponents[0];
            const minutes = timeComponents[1];
            const seconds = "00";
            this.meetObj.starttime = `${hours}:${minutes}:${seconds}`;

            // @ts-ignore
            this.meetObj.id = this.oldmeetObj.id;
            this.meetingservice.update(this.meetObj).then((responce: [] | undefined) => {
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
                this.oldmeetObj =undefined;
                this.form.controls['domodified'].disable();
                this.form.controls['docreated'].enable();
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.loadTable("");
                this.enaleButtons(true, false, false);

              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Meeting Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Meeting Update", message: "Nothing Changed"}
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
        this.oldmeetObj =undefined;
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
        heading: "Confirmation - Meeting Delete",
        message: "Are you sure to Delete folowing Meeting Delete? <br> <br>" +
          this.meetObj.title
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.meetingservice.delete(this.meetObj.id).then((responce: [] | undefined) => {
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
            this.oldmeetObj =undefined;
            this.form.controls['domodified'].disable();
            this.form.controls['docreated'].enable();
            this.clearMainForm();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.loadTable("");
            this.enaleButtons(true, false, false);
          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Meeting Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

}

