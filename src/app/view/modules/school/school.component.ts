import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Staff} from "../../../entity/staff";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {School} from "../../../entity/school";
import {Gender} from "../../../entity/gender";
import {Civilstatus} from "../../../entity/civilstatus";
import {Empstatus} from "../../../entity/empstatus";
import {Grade} from "../../../entity/grade";
import {Gradetype} from "../../../entity/gradetype";
import {Officetype} from "../../../entity/officetype";
import {Qualification} from "../../../entity/qualifications";
import {Staffdesignation} from "../../../entity/staffdesignation";
import {Title} from "../../../entity/title";
import {Schgender} from "../../../entity/schgender";
import {Schtype} from "../../../entity/schtype";
import {Schclass} from "../../../entity/schclass";
import {Schstatus} from "../../../entity/schstatus";
import {Schteacher} from "../../../entity/schteacher";
import {Schstudent} from "../../../entity/schstudent";
import {Division} from "../../../entity/division";
import {Schlevel} from "../../../entity/schlevel";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Schgenderservice} from "../../../service/schgenderservice";
import {Schtypeservice} from "../../../service/schtypeservice";
import {Schclassservice} from "../../../service/schclassservice";
import {Schteacherservice} from "../../../service/schteacherservice";
import {Schstudentservice} from "../../../service/schstudentservice";
import {Divisionservice} from "../../../service/divisionservice";
import {Schlevelservice} from "../../../service/schlevelservice";
import {Schoolservice} from "../../../service/schoolservice";
import {MatDialog} from "@angular/material/dialog";
import {Regexservice} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";
import {Schstatusservice} from "../../../service/schstatusservice";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent {

  //Table columns
  columns: string[] = ['censusnumber','name','mobile','schclass', 'schgender','schtype','techercount','studentcount', 'division','schlevel','email'];
  headers: string[] = ['Census','Name','Division','Mobile','Class-type','Gender-type', 'School-type','Teacher-Count','Student-Count','School-level','Email'];
  binders: string[] = ['censusnumber','name','division.name','mobile','schclass.name','schgender.name','schtype.name','techercount','studentcount','schlevel.name','email'];

  //Client Search columns
  cscolumns: string[] = ['cscensus','csname','csgender','csdivision','cslevel'];
  csprompts: string[] = ['Search by Census Number','Search by Name', 'Search by Gender-wise', 'Search by Division', 'Serarch by Levels'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  selectedRow: any;

  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;

  schObj!: School;
  oldschObj!: School| undefined;

  schools: Array<School> = [];
  imageurl : string = '';
  data!: MatTableDataSource<School>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imgeSchUrl: string = 'assets/userold.png';


  schgenders: Array<Schgender> = [];
  schtypes: Array<Schtype> = [];
  schclasses: Array<Schclass> = [];
  schstatuses: Array<Schstatus> = [];
  schteachers: Array<Schteacher> = [];
  schstudents: Array<Schstudent> = [];
  divisions: Array<Division> = [];
  schlevels: Array<Schlevel> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor( private schgender: Schgenderservice,
               private schtype: Schtypeservice,
               private schclass: Schclassservice,
               private schstatus: Schstatusservice,
               private schteacher: Schteacherservice,
               private schstudent: Schstudentservice,
               private division: Divisionservice,
               private schlevel: Schlevelservice,
               private fb: FormBuilder,
               private matDialog: MatDialog,
               private regexservice: Regexservice,
               private dp: DatePipe,
               private schoolservice: Schoolservice
              ) {


    this.uiassist = new UiAssist(this);


    //Client search form Group
    this.csearch = this.fb.group({
      'cscensus': new FormControl(),
      'csname': new FormControl(),
      'csgender': new FormControl(),
      'csdivision': new FormControl(),
      'cslevel': new FormControl(),
    });

    //Server search form Group
    this.ssearch = this.fb.group({
      'ssname': new FormControl(),
      'sstype': new FormControl(),
      'sstatus': new FormControl(),
      'ssclass': new FormControl(),
      'ssSchstudent': new FormControl(),
    });

    this.form= this.fb.group({
      'censusnumber': new FormControl('',[Validators.required]),
      'name': new FormControl('',[Validators.required]),
      'address': new FormControl('',[Validators.required]),
      'mobile': new FormControl('',[Validators.required]),
      'startdate': new FormControl('',[Validators.required ]),
      'email': new FormControl('',[Validators.required]),
      'techercount': new FormControl('',[Validators.required]),
      'studentcount': new FormControl('',[Validators.required]),
      'description': new FormControl(''),
      'division': new FormControl('',[Validators.required]),
      'photo': new FormControl(),
      'schlevel': new FormControl('',[Validators.required]),
      'schtype': new FormControl('',[Validators.required]),
      'schgender': new FormControl('',[Validators.required ]),
      'schstatus': new FormControl('',[Validators.required ]),
      'schclass': new FormControl('',[Validators.required ]),
      'schstudent': new FormControl('',[Validators.required]),
      'schteacher': new FormControl('',[Validators.required]),


    });
  }

  // Table filter method according to a client search method
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    // @ts-ignore
    this.data.filterPredicate = (sch: School, filter: string)=>{
      return(csearchdata.cscensus==null||sch.censusnumber.toString().includes(csearchdata.cscensus))&&
        // (csearchdata.csgender==null||staff.gender.name.toLowerCase().includes(csearchdata.csgender))&&
        (csearchdata.csname==null||sch.name.toLowerCase().includes(csearchdata.csname))&&
        (csearchdata.csgender==null||sch.schgender.name.toLowerCase().includes(csearchdata.csgender))&&
        (csearchdata.csdivision==null||sch.division.name.toLowerCase().includes(csearchdata.csdivision))&&
        (csearchdata.cslevel==null||sch.schlevel.name.toLowerCase().includes(csearchdata.cslevel));
    }
    this.data.filter="xx";
  }

  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }

  selectImage(e:any): void{
    console.log("Hiii");
    if (e.target.files){
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{this.imgeSchUrl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage():void{
    this.imgeSchUrl='assets/userold.png';
    this.form.controls['photo'].clearValidators();
  }

  loadForm(){
    this.oldschObj =undefined;
    this.form.reset();
    this.clearImage();
    Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
    this.loadTable("");
    this.enaleButtons(true, false, false);
    this.selectedRow = null;
  }

  // Load the Main Table data
  loadTable(query:string){
    this.schoolservice.getAll(query)
      .then((schs: School[]) => {this.schools=schs; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.schools); this.data.paginator=this.paginator;});

  }

  ngOnInit(){
    this.initialize();
  }

  initialize() {
    this.createView();

    this.schgender.getAllList().then((gens: Schgender[]) =>{this.schgenders = gens;});
    this.schtype.getAllList().then((types: Schtype[]) =>{this.schtypes = types;});
    this.schclass.getAllList().then((classes: Schclass[]) =>{this.schclasses = classes;});
    this.schstatus.getAllList().then((statuses: Schstatus[]) =>{this.schstatuses = statuses;});
    this.schteacher.getAllList().then((teachers: Schteacher[]) =>{this.schteachers = teachers;});
    this.schstudent.getAllList().then((students: Schstudent[]) =>{this.schstudents = students;});
    this.division.getAllList().then((divisions: Division[]) =>{this.divisions = divisions;});
    this.schlevel.getAllList().then((levels: Schlevel[]) =>{this.schlevels = levels;});
    this.regexservice.get('school').then((regs: []) =>{
      this.regexes = regs;
      // console.log("R" + this.regexes['email']['regex']);
      this.createForm();
    });
    // this.createSearch();
    this.createForm();
  }

  //Validate All form field
  createForm() {
    this.form.controls['censusnumber'].setValidators([Validators.required,Validators.pattern(this.regexes['censusnumber']['regex'])]);
    // this.form.controls['fullname']?.setValidators([Validators.required,Validators.pattern(this.regexes['fullname']['regex'])]);
    this.form.controls['name'].setValidators([Validators.required,Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['startdate'].setValidators([Validators.required]);
    this.form.controls['address'].setValidators([Validators.required,Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['mobile'].setValidators([Validators.required,Validators.pattern(this.regexes['mobile']['regex'])]);
    this.form.controls['techercount'].setValidators([Validators.required,Validators.pattern(this.regexes['techercount']['regex'])]);
    this.form.controls['studentcount'].setValidators([Validators.required,Validators.pattern(this.regexes['studentcount']['regex'])]);
    this.form.controls['description'].setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['division'].setValidators([Validators.required]);
    this.form.controls['schlevel'].setValidators([Validators.required]);
    this.form.controls['schtype'].setValidators([Validators.required]);
    this.form.controls['schgender'].setValidators([Validators.required]);
    this.form.controls['schstatus'].setValidators([Validators.required]);
    this.form.controls['schclass'].setValidators([Validators.required]);
    this.form.controls['schstudent'].setValidators([Validators.required]);
    this.form.controls['schteacher'].setValidators([Validators.required]);
    this.form.controls['photo'].setValidators([]);

    // Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="startdate")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');


        if (this.oldschObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.schObj[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    //this.enaleButtons(true, false, false);
    this.loadForm();
  }

  enaleButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  //Fill form
  fillForm(school: School){

    this.enaleButtons(false,true,true);

    this.selectedRow=school;

    this.schObj = JSON.parse(JSON.stringify(school));
    // console.log(this.staffObj)
    this.oldschObj = JSON.parse(JSON.stringify(school));
    // console.log(this.oldschObj);

    if (this.schObj.photo != null){
      this.imgeSchUrl = atob(this.schObj.photo);
      this.form.controls['photo'].clearValidators();
    }else {
      this.clearImage();
    }

    this.schObj.photo = "";

    // @ts-ignore
    this.schObj.division = this.divisions.find(div=> div.id === this.schObj.division.id);
    // @ts-ignore
    this.schObj.schlevel = this.schlevels.find(schl => schl.id  === this.schObj.schlevel.id);
    // @ts-ignore
    this.schObj.schtype = this.schtypes.find(scht=> scht.id === this.schObj.schtype.id);
    // @ts-ignore
    this.schObj.schgender = this.schgenders.find(schg=> schg.id === this.schObj.schgender.id);
    // @ts-ignore
    this.schObj.schstatus = this.schstatuses.find(schs=> schs.id === this.schObj.schstatus.id);
    // @ts-ignore
    this.schObj.schclass = this.schclasses.find(schc=> schc.id === this.schObj.schclass.id);
    // @ts-ignore
    this.schObj.schstudent = this.schstudents.find(schst=> schst.id === this.schObj.schstudent.id);
    // @ts-ignore
    this.schObj.schteacher = this.schteachers.find(scht=> scht.id  === this.schObj.schteacher.id);


    this.form.patchValue(this.schObj);
    this.form.markAsPristine();

    this.selectedRow=school;
  }

  //Server search form add button
  btnSearchMc() {

    const sserchdata = this.ssearch.getRawValue();

    let name = sserchdata.ssname;
    let statusid = sserchdata.sstatus;
    let typeid = sserchdata.sstype;
    let classid = sserchdata.ssclass;
    let studentid = sserchdata.ssSchstudent;

    let query = '';

    if (name != null && name.trim() != "") query+="&name="+name;
    if (statusid != null) query+="&statusid="+statusid;
    if (typeid != null) query+="&typeid="+typeid;
    // if (email != null && email.trim() != "") query+="&email="+email;
    if (classid != null) query+="&classid="+classid;
    if (studentid != null) query+="&studentid="+studentid;

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

  //School Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - School Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.schObj = this.form.getRawValue();
      // @ts-ignore
      this.schObj.censusnumber = JSON.parse(this.schObj.censusnumber);
      //console.log("Photo-Before"+this.staff.photo);
        this.schObj.photo=btoa(this.imgeSchUrl);
      //console.log("Photo-After"+this.staff.photo);
      let schData: string = "";
      schData = schData + "<br>Census-Number is : "+ this.schObj.censusnumber;
      schData = schData + "<br>School Name is : "+ this.schObj.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - School Add",
          message: "Are you sure to Add the folowing School Details? <br> <br>"+ schData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.schoolservice.add(this.schObj).then((responce: []|undefined) => {
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
              this.loadForm();
            }
            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -School Add", message: addmessage}
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
        data: {heading: "Errors - School Update ", message: "You have following Errors <br> " + errors}
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
            this.schObj = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.schObj.photo = btoa(this.imgeSchUrl);
            else { // @ts-ignore
              this.schObj.photo = this.oldschObj.photo;
            }

            // @ts-ignore
            this.schObj.id = this.oldschObj.id;
            this.schoolservice.update(this.schObj).then((responce: [] | undefined) => {
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
                data: {heading: "Status -School Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - School Update", message: "Nothing Changed"}
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
        this.loadForm();
      }
    });
  }


  //Delete Method
  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - School Delete",
        message: "Are you sure to Delete folowing School Delete? <br> <br>" +
          this.schObj.name
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.schoolservice.delete(this.schObj.id).then((responce: [] | undefined) => {
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
            this.loadForm();
          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - School Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }
}
