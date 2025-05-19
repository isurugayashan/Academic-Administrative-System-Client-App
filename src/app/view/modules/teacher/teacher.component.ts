import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Staff} from "../../../entity/staff";
import {Teacher} from "../../../entity/teacher";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Gender} from "../../../entity/gender";
import {Civilstatus} from "../../../entity/civilstatus";
import {Empstatus} from "../../../entity/empstatus";
import {Grade} from "../../../entity/grade";
import {Gradetype} from "../../../entity/gradetype";
import {Officetype} from "../../../entity/officetype";
import {Qualification} from "../../../entity/qualifications";
import {Staffdesignation} from "../../../entity/staffdesignation";
import {Title} from "../../../entity/title";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Staffservice} from "../../../service/staffservice";
import {Genderservice} from "../../../service/genderservice";
import {Civilstatusservice} from "../../../service/civilstatusservice";
import {Empstatusservice} from "../../../service/empstatusservice";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {Gradeservice} from "../../../service/gradeservice";
import {Officetypeservice} from "../../../service/officetypeservice";
import {Qualificationsservice} from "../../../service/qualificationservice";
import {Staffdesignationservice} from "../../../service/staffdesignationservice";
import {Titleservice} from "../../../service/titileservice";
import {MatDialog} from "@angular/material/dialog";
import {Regexservice} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";
import {Teacherservice} from "../../../service/teacherservice";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent {

  columns: string[] = ['title','callingname','fullname','dofirstappoint','nic', 'mobile','grade','gender','status','email'];
  headers: string[] = ['Title','Calling Name','Full Name','First Appointment','NIC', 'Mobile','Grade','Gender','Status','Email'];
  binders: string[] = ['title.name','callingname','fullname','dofirstappoint','nic', 'mobile','grade.name','gender.name','empstatus.name','email'];

  cscolumns: string[] = ['cscallingname','csnic','csgrade','csemail'];
  csprompts: string[] = ['Search by Calling Name','Search by NIC', 'Search by Grade', 'Search by Email'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  teacherObj!: Teacher;
  teacherOldObj!: Teacher| undefined;

  selectedRow: any;


  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;

  teachers: Array<Teacher> = [];
  imageurl : string = '';
  data!: MatTableDataSource<Teacher>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imgeTeachurl: string = 'assets/userold.png';

  //Supportive Arrays
  genders: Array<Gender> = [];
  civilstatuses: Array<Civilstatus> = [];
  empstatuses: Array<Empstatus> = [];
  grades: Array<Grade> = [];
  gradetypes: Array<Gradetype> = [];
  qualifications: Array<Qualification> = [];
  titiles: Array<Title> = [];

  regexes: any;

  uiassist: UiAssist;

  minDate!: Date;
  maxDate!: Date;
  maxDate2!: Date;

  constructor(private ts: Teacherservice,
              private fb: FormBuilder,
              private genderservice: Genderservice,
              private civilstatusservice: Civilstatusservice,
              private empstatusservice: Empstatusservice,
              private gradetypeservice: Gradetypeservice,
              private gradeservice: Gradeservice,
              private qualificationsservice: Qualificationsservice,
              private titleservice: Titleservice,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private dp: DatePipe,
              private breakpointObserver: BreakpointObserver) {

    this.uiassist = new UiAssist(this);

    //Client search form Group
    this.csearch = this.fb.group({
      'cscallingname': new FormControl(),
      'csnic': new FormControl(),
      'csgrade': new FormControl(),
      'csemail': new FormControl(),
    });

    //Server search form Group
    this.ssearch = this.fb.group({
      'sscallingname': new FormControl(),
      'ssnic': new FormControl(),
      'ssgender': new FormControl(),
      'ssStatus': new FormControl(),
    });
    this.minDate = new Date(1950, 0, 1); // January 1, 1950
    this.maxDate = new Date(1999, 11, 31); // December 31, 1999
    this.maxDate2 = new Date(); // December 31, 1999

    this.form= this.fb.group({
      'title': new FormControl('',[Validators.required]),
      'fullname': new FormControl('',[Validators.required]),
      'callingname': new FormControl('',[Validators.required]),
      'photo': new FormControl('',[Validators.required]),
      'dobirth': new FormControl('',[Validators.required]),
      'nic': new FormControl('',[Validators.required ]),
      'address': new FormControl('',[Validators.required ]),
      'email': new FormControl('',[Validators.required]),
      'mobile': new FormControl('',[Validators.required]),
      'dofirstappoint': new FormControl('',[Validators.required]),
      'description': new FormControl(''),
      'gender': new FormControl('',[Validators.required]),
      'empstatus': new FormControl('',[Validators.required]),
      'grade': new FormControl('',[Validators.required]),
      'gradetype': new FormControl('',[Validators.required]),
      'civilstatus': new FormControl('',[Validators.required]),
      'qualification': new FormControl('',[Validators.required]),

    });
  }


  //Table filter method according to a client search method
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();
    console.log()
    // @ts-ignore
    this.data.filterPredicate = (teach: Teacher, filter: string)=>{
      return(csearchdata.cscallingname==null||teach.callingname.toLowerCase().includes(csearchdata.cscallingname))&&
        // (csearchdata.csgender==null||staff.gender.name.toLowerCase().includes(csearchdata.csgender))&&
        (csearchdata.csnic==null||teach.nic.toLowerCase().includes(csearchdata.csnic))&&
        (csearchdata.csemail==null||teach.email.toLowerCase().includes(csearchdata.csemail))&&
      (csearchdata.csgrade == null || teach.grade.name.toLowerCase().replace(/\s/g, '').includes(csearchdata.csgrade.replace(/\s/g, '')))

    }
    this.data.filter="xx";
  }


  // All the data load in initial stage
  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }

  selectImage(e:any): void{
    if (e.target.files){
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{this.imgeTeachurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage():void{
    this.imgeTeachurl='assets/userold.png';
    this.form.controls['photo'].setErrors({'required': true});
  }

  createSearch() {}

  // Load the Main Table data
  loadTable(query:string){
    this.ts.getAll(query)
      .then((teach: Teacher[]) => {this.teachers=teach; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.teachers); this.data.paginator=this.paginator;});

  }

  ngOnInit(){
    this.initialize();
  }


  initialize() {
    this.createView();

    this.genderservice.getAllList().then((gens: Gender[]) =>{this.genders = gens;});
    this.civilstatusservice.getAllList().then((civils: Civilstatus[]) =>{this.civilstatuses = civils;});
    this.empstatusservice.getAllList().then((emps: Empstatus[]) =>{this.empstatuses = emps;});
    //this.gradeservice.getAllList().then((grades: Grade[]) =>{this.grades = grades;});
    this.gradetypeservice.getbygradetype().then((grdtyps: Gradetype[]) =>{this.gradetypes = grdtyps;});
    this.qualificationsservice.getAllList().then((qualfies: Qualification[]) =>{this.qualifications = qualfies;});
    this.titleservice.getAllList().then((titls: Title[]) =>{this.titiles = titls;});
    this.regexservice.get('teachers').then((regs: []) =>{
      this.regexes = regs;
      // console.log("R" + this.regexes['email']['regex']);
      this.createForm();
    });
    this.createSearch();
  }


  //Validate All form field
  createForm() {
    if (this.form.controls['fullname']) {
      this.form.controls['fullname'].setValidators([Validators.required, Validators.pattern(this.regexes['fullname']['regex'])]);
    }
    this.form.controls['title'].setValidators([Validators.required]);
    // this.form.controls['fullname']?.setValidators([Validators.required,Validators.pattern(this.regexes['fullname']['regex'])]);
    this.form.controls['callingname'].setValidators([Validators.required,Validators.pattern(this.regexes['callingname']['regex'])]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['dobirth'].setValidators([Validators.required]);
    this.form.controls['nic'].setValidators([Validators.required,Validators.pattern(this.regexes['nic']['regex'])]);
    this.form.controls['address'].setValidators([Validators.required,Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['mobile'].setValidators([Validators.required,Validators.pattern(this.regexes['mobile']['regex'])]);
    this.form.controls['dofirstappoint'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['gender'].setValidators([Validators.required]);
    this.form.controls['empstatus'].setValidators([Validators.required]);
    this.form.controls['grade'].setValidators([Validators.required]);
    this.form.controls['civilstatus'].setValidators([Validators.required]);
    this.form.controls['qualification'].setValidators([Validators.required]);
    this.form.controls['gradetype'].setValidators([Validators.required]);

     Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dobirth" || controlName=="dofirstappoint")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');


        if (this.teacherOldObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.teacherObj[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
     this.enaleButtons(true, false, false);

  }

  //Server search form add button
  btnSearchMc() {

    const sserchdata = this.ssearch.getRawValue();

    let callingname = sserchdata.sscallingname;
    let nic = sserchdata.ssnic;
    let genderid = sserchdata.ssgender;
    let statusid = sserchdata.ssStatus;

    let query = '';

    if (callingname != null && callingname.trim() != "") query+="&callingname="+callingname;
    if (nic != null && nic.trim() != "") query+="&nic="+nic;
    if (genderid != null) query+="&genderid="+genderid;
    // if (email != null && email.trim() != "") query+="&email="+email;
    if (statusid != null) query+="&statusid="+statusid;

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

  //Teacher Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - School-Staff Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.teacherObj = this.form.getRawValue();
      //console.log("Photo-Before"+this.staff.photo);
      this.teacherObj.photo=btoa(this.imgeTeachurl);
      //console.log("Photo-After"+this.staff.photo);
      let teacherData: string = "";
      teacherData = teacherData + "<br>Title is : "+ this.teacherObj.title.name;
      teacherData = teacherData + "<br>Fullname is : "+ this.teacherObj.fullname;
      teacherData = teacherData + "<br>Callingname is : "+ this.teacherObj.callingname;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Teacher Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ teacherData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.ts.add(this.teacherObj).then((responce: []|undefined) => {
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
              this.form.reset();
              this.clearImage();
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.loadTable("");
              this.enaleButtons(true,false,false);
            }
            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -School-Staff Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => { if (!result) { return;} }) ;} );
        }
      });
    }
  }

  enaleButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  // loadForm(){
  //   this.teacherOldObj = undefined;
  //   this.form.reset();
  //   this.clearImage();
  //   Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
  //   this.enaleButtons(true,false,false);
  //   this.loadTable("");
  //   this.selectedRow = null;
  //
  // }


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

  //Grade loads
  loadGrade(id: number) {
      this.gradeservice.getById(id).then((grades: Grade[]) =>{this.grades = grades;});
  }

  //Fill form
  fillForm(teacher: Teacher){

    this.enaleButtons(false,true,true);

    this.selectedRow=teacher;

    this.teacherObj = JSON.parse(JSON.stringify(teacher));
    // console.log(this.staffObj)
    this.teacherOldObj = JSON.parse(JSON.stringify(teacher));


    if (this.teacherObj.photo != null){
      this.imgeTeachurl = atob(this.teacherObj.photo);
      this.form.controls['photo'].clearValidators();
    }else {
      this.clearImage();
    }

    this.teacherObj.photo = "";

    // @ts-ignore
    this.teacherObj.title = this.titiles.find(title=> title.id === this.teacherObj.title.id);

    // @ts-ignore
    this.teacherObj.civilstatus = this.civilstatuses.find(civilstatus=> civilstatus.id === this.teacherObj.civilstatus.id);
    // @ts-ignore
    this.teacherObj.empstatus = this.empstatuses.find(empstatus=> empstatus.id === this.teacherObj.empstatus.id);
    // @ts-ignore
    this.teacherObj.qualification = this.qualifications.find(qualification=> qualification.id === this.teacherObj.qualification.id);
    // @ts-ignore
    this.teacherObj.gender = this.genders.find(gender=> gender.id === this.teacherObj.gender.id);

    // @ts-ignore
    this.teacherObj.gradetype = this.gradetypes.find(gradetype=> gradetype.id === this.teacherObj.grade.gradetype.id);
    //console.log("cccccc---"+ JSON.stringify(this.staffObj.grade.gradetype.id));

    // this.loadGrade(this.staffObj.grade.gradetype);

    this.gradeservice.getById(this.teacherObj.grade.gradetype.id).then((grades: Grade[]) =>{
      this.grades = grades;
      // @ts-ignore
      this.teacherObj.grade = this.grades.find(grade=> grade.id === this.teacherObj.grade.id);

      this.form.patchValue(this.teacherObj);
      this.form.markAsPristine();
    });

  }

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

  //Update Teacher
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Teacher Update ", message: "You have following Errors <br> " + errors}
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
            this.teacherObj = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.teacherObj.photo = btoa(this.imgeTeachurl);
            else { // @ts-ignore
              this.teacherObj.photo = this.teacherOldObj.photo;
            }

            // @ts-ignore
            this.teacherObj.id = this.teacherOldObj.id;
            this.ts.update(this.teacherObj).then((responce: [] | undefined) => {
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
                this.teacherOldObj = undefined;
                this.form.reset();
                this.clearImage();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.loadTable("");
                this.enaleButtons(true,false,false);
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -School-Staff Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation -School-Staff Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }


  //Clear Button
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
        this.teacherOldObj = undefined;
        this.form.reset();
        this.clearImage();
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.loadTable("");
        this.enaleButtons(true,false,false);
      }
    });
  }

//Delete Teacher

  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Teacher Delete",
        message: "Are you sure to Delete folowing Member? <br> <br>" +
          this.teacherObj.callingname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.ts.delete(this.teacherObj.id).then((responce: [] | undefined) => {
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
            this.form.reset();
            this.clearImage();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.loadTable("");
            this.enaleButtons(true,false,false);

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - School-Staff Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }


}
