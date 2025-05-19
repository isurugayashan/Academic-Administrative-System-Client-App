import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Grade} from "../../../entity/grade";
import {Gradetype} from "../../../entity/gradetype";
import {Teacher} from "../../../entity/teacher";
import {Sublevel} from "../../../entity/sublevel";
import {Progress} from "../../../entity/progress";
import {Subject} from "../../../entity/subject";
import {Teacherservice} from "../../../service/teacherservice";
import {Progresseservice} from "../../../service/progressservice";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {Sublevelservice} from "../../../service/sublevelservice";
import {Gradeservice} from "../../../service/gradeservice";
import {Subjectservice} from "../../../service/subjectservice";
import {Regexservice} from "../../../service/regexservice";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Staff} from "../../../entity/staff";
import {Division} from "../../../entity/division";
import {Divisionservice} from "../../../service/divisionservice";
import {Staffservice} from "../../../service/staffservice";
import {School} from "../../../entity/school";
import {Schoolservice} from "../../../service/schoolservice";
import {Schassign} from "../../../entity/schassign";
import {Schassignservice} from "../../../service/schassignservice";
import {AuthorizationManager} from "../../../service/authorizationmanager";

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent {

  columns: string[] = ['teacher','school','subject','topic','substatus','sublevel','dofrom','tofrom','docreated'];
  headers: string[] = ['Teacher Name','School-Name','Subject','Subject Topic','Subject-Status','Subject-Level', 'School-Level','Form-Date','To-Date','Date of Created'];
  binders: string[] = ['teacher.fullname','schassign.school.name','schassign.subject.name','topic','schassign.subject.substatus.name','schassign.subject.sublevel.name','dofrom','tofrom','docreated'];

  cscolumns: string[] = [ 'csteacher','csgrade','cssubject','csstatus'];
  csprompts: string[] = ['Search by teacher name','Search by Grade', 'Search by Subject','Search by Subject Status'];


  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  progressOBj!:Progress;
  oldprogress!:Progress|undefined;

  selectedRow: any;
  fileName = '';
  file!: FormData;
  file2!:File;

  grades: Array<Grade> = [];
  gradetypes: Array<Gradetype> = [];
  teachers: Array<Teacher> = [];
  subjects: Array<Subject> = [];
  sublevels: Array<Sublevel> = [];
  schassigns: Array<Schassign> = [];

  progresss: Array<Progress> = [];
  data!: MatTableDataSource<Progress>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imgeTeachurl: string = 'assets/userold.png';

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;
  enprint:boolean = false;

  uiassist: UiAssist;
  regexes: any;

  constructor(
    private fb:FormBuilder,
    private teacherservice:Teacherservice,
    private progressservice:Progresseservice,
    private gradetypeservice: Gradetypeservice,
    private gradeservice: Gradeservice,
    private subjectservice: Subjectservice,
    private sublevelservice: Sublevelservice,
    private schassignservice: Schassignservice,
    private dp:DatePipe,
    private dg:MatDialog,
    private regexservice:Regexservice,
    private matDialog: MatDialog,
    public authService:AuthorizationManager
  ) {

    this.uiassist = new UiAssist(this);
    this.progresss = new Array<Progress>();

    this.csearch = this.fb.group({
      "csteacher": new FormControl(),
      "csgrade": new FormControl(),
      "cssubject": new FormControl(),
      "csstatus": new FormControl(),
    });

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form = this.fb.group({
      "teacher": new FormControl({value: null, disabled: true},[Validators.required]),
      "schassign": new FormControl('',[Validators.required]),
      'grade': new FormControl('',[Validators.required]),
      'gradetype': new FormControl('',[Validators.required]),
      'file': new FormControl('',[Validators.required]),
      "subject": new FormControl('',[Validators.required]),
      "sublevel": new FormControl('',[Validators.required]),
      "docreated": new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      "dofrom": new FormControl('',[Validators.required]),
      "tofrom": new FormControl('',[Validators.required]),
      "description": new FormControl(),
      "topic": new FormControl('',[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required])
    });

    this.ssearch = this.fb.group({
      "sslevel": new FormControl(),
      "ssubject": new FormControl(),
    });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {
    this.createView();
    this.form.controls['dofrom'].valueChanges.subscribe((dofromValue) => {
      // Calculate the To Date by adding 7 days to the selected From Date
      if (dofromValue) {
        const toDate = new Date(dofromValue);
        toDate.setDate(toDate.getDate() + 7); // Add 7 days
        this.form.controls['tofrom'].setValue(this.dp.transform(toDate, 'yyyy-MM-dd'));
      }
    });
    this.gradetypeservice.getbyTeacherProgress().then((grdtyps: Gradetype[]) =>{this.gradetypes = grdtyps;});
    this.sublevelservice.getAllList().then((levels:Sublevel[])=>{
      this.sublevels = levels;
    });
      this.regexservice.get('progress').then((regs: []) =>{
        this.regexes = regs;
        this.createForm();
      });
  }

  //Grade loads
  loadGrade(id: number) {
    this.gradeservice.getById(id).then((grades: Grade[]) =>{
      this.grades = grades;

    });
  }
  //Teacher load
  loadTeacher(id: number) {
    this.form.controls['teacher'].enable();
    // @ts-ignore
    this.teacherservice.getByTeacherProgress(id).then((teach: Teacher[]) =>{this.teachers = teach ;});

  }


  //Load school by teacher id

  loadSchool(id: number){
    // @ts-ignore
    this.schassignservice.getBySchTeacherId(id).then((subs: Schassign[]) =>{
      this.schassigns = subs;
      console.log(this.schassigns)
      // this.oldsubjects = Array.from(this.oldsubjects);
    });
  }

  //keyup
  onKey(event: KeyboardEvent) {
    if (this.form.controls['grade'].value==null){
     false;
    }else {
      const value = (event.target as HTMLInputElement)?.value;
      this.teacherservice.onKey(value).then((subs: Teacher[]) =>{
        this.teachers = subs;
      })}
    }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.progressservice.getAll(query)
      .then((usrs: Progress[]) => {
        this.progresss = usrs;
        console.log(this.progresss)
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.progresss);
        this.data.paginator = this.paginator;
      });
  }

  selectImage(e:any): void{
    if (e.target.files){
      let reader = new FileReader();
      this.file2 = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{this.imgeTeachurl = event.target.result;this.fileName = this.file2.name;
        this.form.controls['file'].clearValidators();
      }
    }
  }

  clearImage():void{
    this.imgeTeachurl='assets/userold.png';
    this.form.controls['file'].setErrors({'required': true});
  }


  enaleButtons(add:boolean, upd:boolean, del:boolean,pri:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
    this.enprint = pri;
  }
  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.oldprogress = undefined;
    this.form.controls['teacher'].reset();
    this.form.controls['schassign'].reset();
    this.form.controls['grade'].reset();
    this.form.controls['gradetype'].reset();
    this.form.controls['file'].reset();
    this.form.controls['subject'].reset();
    this.form.controls['sublevel'].reset();
    this.form.controls['domodified'].reset();
    this.form.controls['tofrom'].reset();
    this.form.controls['description'].reset();
    this.form.controls['topic'].reset();
    this.form.controls['docreated'].setValue(formattedDate);
    this.form.controls['dofrom'].reset();

  }


  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();


    this.data.filterPredicate = (div: Progress, filter: string) => {
      return (cserchdata.csteacher == null || div.teacher.fullname.toLowerCase().includes(cserchdata.csteacher))&&
        (cserchdata.csgrade == null || div.teacher.grade.name.toLowerCase().replace(/\s/g, '').includes(cserchdata.csgrade.replace(/\s/g, '')))&&
        (cserchdata.cssubject == null || div.subject.name.toLowerCase().includes(cserchdata.cssubject))&&
        (cserchdata.csstatus == null || div.subject.substatus.name.toLowerCase().includes(cserchdata.csstatus));

    };

    this.data.filter = 'xx';

  }
  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let sublevelid = sserchdata.sslevel;
    let subname = sserchdata.ssubject;


    let query = "";


    if (sublevelid != null) query += "&sublevelid=" + sublevelid;
    if (subname != null && subname.trim() != "")query+="&subname="+subname;
    console.log(query)

    if (query != "") query = query.replace(/^./, "?")
    console.log(query)

    this.loadTable(query);

  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }


  createForm() {
    this.form.controls['teacher'].setValidators([Validators.required]);
    this.form.controls['schassign'].setValidators([Validators.required]);
    this.form.controls['gradetype']?.setValidators([Validators.required]);
    this.form.controls['grade']?.setValidators([Validators.required]);
    this.form.controls['file'].setValidators([Validators.required]);
    this.form.controls['subject'].setValidators([Validators.required]);
    this.form.controls['sublevel'].setValidators([Validators.required]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['domodified'].setValidators([Validators.required]);
    this.form.controls['dofrom'].setValidators([Validators.required]);
    this.form.controls['tofrom'].setValidators([Validators.required]);
    this.form.controls['topic'].setValidators([Validators.required,Validators.pattern(this.regexes['topic']['regex'])]);
    this.form.controls['description'].setValidators([Validators.pattern(this.regexes['topic']['regex'])]);


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doassign" || controlName == "doresign" || controlName == "docreated"|| controlName == "dofrom"|| controlName == "tofrom")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldprogress != undefined && control.valid) {
            // @ts-ignore
            if (value === this.progressOBj[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    this.enaleButtons(true,false,false,false);

  }

  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Progress Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.progressOBj = this.form.getRawValue();
      // @ts-ignore
      this.progressOBj.file=btoa(this.imgeTeachurl);

      console.log(this.progressOBj)
      let progressData: string = "";
      progressData = progressData + "<br>Fullname is : "+ this.progressOBj.teacher.fullname;
      progressData = progressData + "<br>Subject is : "+ this.progressOBj.schassign.subject.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Progress Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ progressData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.progressservice.add(this.progressOBj).then((responce: []|undefined) => {
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
              this.clearImage();
              this.fileName ='';
              this.clearMainForm();
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.enaleButtons(true,false,false,false);
              this.loadTable("");
              this.form.controls['teacher'].disable();
            }
            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Staff Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => { if (!result) { return;} }) ;} );
        }
      });
    }
  }


  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }

  //Fill form
  fillForm(progress: Progress){

    this.form.controls['domodified'].enable();
    this.form.controls['docreated'].disable();
    this.form.controls['teacher'].enable();

    this.enaleButtons(false,true,true,true);
    //
    this.selectedRow=progress;
    console.log(this.selectedRow)
    this.progressOBj = JSON.parse(JSON.stringify(progress));
     console.log(this.progressOBj)
    this.oldprogress = JSON.parse(JSON.stringify(progress));


    if (this.progressOBj.file != null){
      // @ts-ignore
      this.imgeTeachurl = atob(this.progressOBj.file);
      this.form.controls['file'].clearValidators();
    }else {
      // @ts-ignore
     this.clearImage();
    }

    this.progressOBj.file = "";

    // @ts-ignore
    this.progressOBj.gradetype = this.gradetypes.find(gradetype=> gradetype.id === this.progressOBj.teacher.grade.gradetype.id);
    // console.log("cccccc---"+ JSON.stringify(this.progressObj.staffCreator.grade.gradetype.id));

    this.gradeservice.getById(this.progressOBj.teacher.grade.gradetype.id).then((grades: Grade[]) =>{
      this.grades = grades;
      // @ts-ignore
      this.progressOBj.grade = this.grades.find(grade=> grade.id === this.progressOBj.teacher.grade.id);
      // @ts-ignore
      this.teacherservice.getByTeacherProgress(this.progressOBj.grade.id).then((tech: Teacher[]) =>{
        this.teachers = tech;
        // @ts-ignore
        this.progressOBj.teacher= this.teachers.find(ss=>ss.id === this.progressOBj.teacher.id);

        this.schassignservice.getBySchTeacherId(this.progressOBj.teacher.id).then((sch: Schassign[]) =>{
          this.schassigns=sch;

          // @ts-ignore
          this.progressOBj.schassign= this.schassigns.find(ss=>ss.id === this.progressOBj.schassign.id);

          // @ts-ignore
          this.progressOBj.subject = this.schassigns.find(sc => sc.subject.id === this.progressOBj.schassign.subject.id);
          // console.log("cccccc---"+ JSON.stringify(this.schassigns.find(sc => sc.id === this.progressOBj.schassign.subject.id)));

          // @ts-ignore
          this.progressOBj.sublevel = this.schassigns.find(sc => sc.subject.sublevel.id === this.progressOBj.schassign.subject.sublevel.id);

          if (this.progressOBj.domodified != null) {
            // @ts-ignore
            this.progressOBj.domodified = null;
            this.form.patchValue(this.progressOBj);
            this.form.markAsPristine();
          } else {
            this.form.patchValue(this.progressOBj);
            this.form.markAsPristine();
          }
        });

        });
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

  //Update Progress
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Progress Update ", message: "You have following Errors <br> " + errors}
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
            this.progressOBj = this.form.getRawValue();
            if (this.form.controls['file'].dirty) this.progressOBj.file = btoa(this.imgeTeachurl);
            else { // @ts-ignore
              this.progressOBj.file = this.oldprogress?.file;
            }
            // @ts-ignore
            this.progressOBj.id = this.oldprogress.id;
            this.progressservice.update(this.progressOBj).then((responce: [] | undefined) => {
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
                this.clearImage();
                this.fileName ='';
                this.form.controls['domodified'].disable();
                this.form.controls['docreated'].enable();
                this.form.controls['teacher'].disable();
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enaleButtons(true,false,false,false);
                this.loadTable("");
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Progress Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Progress Update", message: "Nothing Changed"}
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
        this.clearMainForm();
        this.clearImage();
        this.form.controls['domodified'].disable();
        this.form.controls['docreated'].enable();
        this.form.controls['teacher'].disable();
        this.fileName ='';
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.enaleButtons(true,false,false,false);
        this.loadTable("");
      }
    });
  }

//Delete Progress
  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Progress Delete",
        message: "Are you sure to Delete folowing Member? <br> <br>" +
          this.progressOBj.teacher.fullname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.progressservice.delete(this.progressOBj.id).then((responce: [] | undefined) => {
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
            this.fileName ='';
            this.form.controls['domodified'].disable();
            this.form.controls['docreated'].enable();
            this.form.controls['teacher'].disable();
            this.clearMainForm();
            this.clearImage();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enaleButtons(true,false,false,false);
            this.loadTable("");

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Progress Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

  print() {
    // @ts-ignore
    const imageDataUrl = atob(this.oldprogress?.file);
    const printWindow = window.open('', '_blank');

    // @ts-ignore
    printWindow.document.open();
    // @ts-ignore
    printWindow.document.write(`
    <html>
            <h1 style="text-align: center; font-size: 50px">Zonal Office Akuressa </h1>
      <body>
        <img src="${imageDataUrl}" style="height: 500px; width: 500px; margin-top: 100px; text-align: center"/>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 1000); // Delay of 1 second (adjust as needed)
          };
        </script>
      </body>
    </html>
  `);
    // @ts-ignore
    printWindow.document.close();

  }


}

