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
import {Schassign} from "../../../entity/schassign";
import {Subject} from "../../../entity/subject";
import {Teacherservice} from "../../../service/teacherservice";
import {Schassignservice} from "../../../service/schassignservice";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {Sublevelservice} from "../../../service/sublevelservice";
import {Gradeservice} from "../../../service/gradeservice";
import {Subjectservice} from "../../../service/subjectservice";
import {Regexservice} from "../../../service/regexservice";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Staff} from "../../../entity/staff";
import {School} from "../../../entity/school";
import {Schoolservice} from "../../../service/schoolservice";
import {Schdesignation} from "../../../entity/schdesignation";
import {Schdesignationservice} from "../../../service/schdesignationservice";
import {Schtypeservice} from "../../../service/schtypeservice";
import {Schtype} from "../../../entity/schtype";


@Component({
  selector: 'app-schassign',
  templateUrl: './schassign.component.html',
  styleUrls: ['./schassign.component.css']
})
export class SchassignComponent {

  columns: string[] = ['teacher','grade','empstatus', 'schdesignation', 'subject','sublevel','doassign', 'doresign','schtype','school','docreated'];
  headers: string[] = ['Name','Grade', 'Teacher-Status','Designation','Subject','Subject-Level','Date of Assign', 'Date of Resign','School-Type','School','Date of Created'];
  binders: string[] = ['teacher.fullname','teacher.grade.name', 'teacher.empstatus.name','schdesignation.name','getSubject()','getSublevel()','doassign', 'doresign','school.schtype.name','school.name','docreated'];

  cscolumns: string[] = [ 'csteacher','csgrade','cssubject','csstatus', 'csschool'];
  csprompts: string[] = ['Search by  Name', 'Search by Grade','Search By Subject','Search by Status', 'Search by School'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  schassign!:Schassign;
  oldschassign!:Schassign|undefined;

  selectedRow: any;

  grades: Array<Grade> = [];
  gradetypes: Array<Gradetype> = [];
  teachers: Array<Teacher> = [];
  subjectlevels: Array<Sublevel> = [];
  subjects: Array<Subject> = [];
  schools: Array<School> = [];
  schtypes: Array<Schtype> = [];
  schdesignations: Array<Schdesignation> = [];


  schassigns: Array<Schassign> = [];
  data!: MatTableDataSource<Schassign>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  uiassist: UiAssist;

  constructor(
    private fb:FormBuilder,
    private schassignservice:Schassignservice,
    private teacherservice:Teacherservice,
    private gradetypeservice: Gradetypeservice,
    private gradeservice: Gradeservice,
    private schoolservice: Schoolservice,
    private subjectservice: Subjectservice,
    private sublevelservice: Sublevelservice,
    private schdesignationservice: Schdesignationservice,
    private schtypeservice: Schtypeservice,
    private dp:DatePipe,
    private dg:MatDialog,
    private regexservice:Regexservice,
    private matDialog: MatDialog,
  ) {

    this.uiassist = new UiAssist(this);
    this.schassigns = new Array<Schassign>();

    this.csearch = this.fb.group({
      "csteacher": new FormControl(),
      "csschool": new FormControl(),
      "csstatus": new FormControl(),
      "csgrade": new FormControl(),
      "cssubject": new FormControl(),
    });

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form = this.fb.group({
      "teacher": new FormControl('',[Validators.required]),
      "schtype": new FormControl('',[Validators.required]),
      "school": new FormControl('',[Validators.required]),
      "doassign": new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      "doresign": new FormControl({value:"", disabled: true}),
      'grade': new FormControl('',[Validators.required]),
      'gradetype': new FormControl('',[Validators.required]),
      "subject": new FormControl(),
      "sublevel": new FormControl(),
      "docreated": new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      "schdesignation": new FormControl('',[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required])
    });

    this.ssearch = this.fb.group({
      "sstype": new FormControl(),
      "ssdesignation": new FormControl()
    });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {
    this.createView();

    this.gradetypeservice.getbygradetype().then((grdtyps: Gradetype[]) =>{this.gradetypes = grdtyps;});

    this.schdesignationservice.getAllList().then((des:Schdesignation[])=> {
      this.schdesignations = des;
    });
      this.schtypeservice.getAllList().then((types:Schtype[])=>{
        this.schtypes = types;
    });
    this.sublevelservice.getAllList().then((levels:Sublevel[])=>{
      this.subjectlevels = levels;
    });
    this.createForm();
  }

  //Grade loads
  loadGrade(id: number) {
    this.gradeservice.getById(id).then((grades: Grade[]) =>{this.grades = grades;});
  }
  //Teacher load
  loadTeacher(id: number) {
    console.log(id);
    // @ts-ignore
    this.teacherservice.getById(id).then((teachers: Teacher[]) =>{this.teachers = teachers ;});

  }
  //Subject Load
  loadSubject(id: number) {
    // @ts-ignore
    this.subjectservice.getById(id).then((subs: Subject[]) =>{
      this.subjects = subs;
      // console.log(this.subjects)
      // this.oldsubjects = Array.from(this.oldsubjects);
    });
  }


  //Schtype id load
  loadSchtype(id: number) {
    // @ts-ignore
    this.schoolservice.getById(id).then((sch: School[]) =>{

      this.schools = sch;
      console.log(this.schools)
      // this.oldsubjects = Array.from(this.oldsubjects);
    });
  }

  // @ts-ignore
  getSubject(element:Schassign){
    if (element.subject != null){
      return element.subject.name
    }else {
      return null;
    }
  }

  getSublevel(element:Schassign){
    if (element.subject != null){
      return element.subject.sublevel.name
    }else {
      return null;
    }
  }
  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.schassignservice.getAll(query)
      .then((usrs: Schassign[]) => {
        this.schassigns = usrs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.schassigns);
        this.data.paginator = this.paginator;
      });
  }



  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();


    this.data.filterPredicate = (tech: Schassign, filter: string) => {
      if (cserchdata.cssubject === '') {
        return (cserchdata.csteacher == null || tech.teacher.fullname.toLowerCase().includes(cserchdata.csteacher))&&
          (cserchdata.csschool == null || tech.school.name.toLowerCase().includes(cserchdata.csschool))&&
          (cserchdata.csstatus == null || tech.teacher.empstatus.name.toLowerCase().includes(cserchdata.csstatus))&&
         // (cserchdata.cssubject == null || tech.subject? tech.subject.name.toLowerCase().includes(cserchdata.cssubject):false)&&
          (cserchdata.csgrade == null || tech.teacher.grade.name.toLowerCase().replace(/\s/g, '').includes(cserchdata.csgrade.replace(/\s/g, '')));

      }else {
        return (cserchdata.csteacher == null || tech.teacher.fullname.toLowerCase().includes(cserchdata.csteacher))&&
          (cserchdata.csschool == null || tech.school.name.toLowerCase().includes(cserchdata.csschool))&&
          (cserchdata.csstatus == null || tech.teacher.empstatus.name.toLowerCase().includes(cserchdata.csstatus))&&
          (cserchdata.cssubject == null || tech.subject? tech.subject.name.toLowerCase().includes(cserchdata.cssubject):false)&&
          (cserchdata.csgrade == null || tech.teacher.grade.name.toLowerCase().replace(/\s/g, '').includes(cserchdata.csgrade.replace(/\s/g, '')));
      }
    };

    this.data.filter = 'xx';

  }


  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let typeid = sserchdata.sstype;
    let designationid = sserchdata.ssdesignation;


    let query = "";

    if (typeid != null) query = query + "&typeid=" + typeid;
    if (designationid != null) query = query + "&designationid=" + designationid;

    if (query != "") query = query.replace(/^./, "?")

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
    this.form.controls['schtype'].setValidators([Validators.required]);
    this.form.controls['schdesignation'].setValidators([Validators.required]);
    this.form.controls['school'].setValidators([Validators.required]);
    this.form.controls['gradetype']?.setValidators([Validators.required]);
    this.form.controls['grade']?.setValidators([Validators.required]);
    this.form.controls['doassign'].setValidators([Validators.required]);
    this.form.controls['doresign'].setValidators([]);
    this.form.controls['subject'].setValidators([]);
    this.form.controls['sublevel'].setValidators([]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['domodified'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doassign" || controlName == "doresign" || controlName == "docreated" || controlName == "domodified")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldschassign != undefined && control.valid) {
            // @ts-ignore
            if (value === this.schassign[controlName]) {
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

    this.enableButtons(true,false,false);

  }

  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.oldschassign = undefined;
    this.form.controls['teacher'].reset();
    this.form.controls['schtype'].reset();
    this.form.controls['schdesignation'].reset();
    this.form.controls['school'].reset();
    this.form.controls['gradetype'].reset();
    this.form.controls['grade'].reset();
    this.form.controls['subject'].reset();
    this.form.controls['sublevel'].reset();
    this.form.controls['domodified'].reset();
    this.form.controls['doassign'].setValue(formattedDate);
    this.form.controls['docreated'].setValue(formattedDate);
  }

  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Schassign Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.schassign = this.form.getRawValue();
      console.log(this.schassign)
      let schassignData: string = "";
      schassignData = schassignData + "<br>Name is : "+ this.schassign.teacher.callingname;
      schassignData = schassignData + "<br>School is : "+ this.schassign.school.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Schassign Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ schassignData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.schassignservice.add(this.schassign).then((responce: []|undefined) => {
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
              this.clearMainForm();
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.enableButtons(true,false,false);
              this.loadTable("");
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

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
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
  fillForm(schassign: Schassign){

    this.form.controls['domodified'].enable();
    this.form.controls['doresign'].enable();
    this.form.controls['docreated'].disable();

    this.enableButtons(false,true,true);

    this.selectedRow=schassign;
    this.schassign = JSON.parse(JSON.stringify(schassign));

    this.oldschassign = JSON.parse(JSON.stringify(schassign));

     // @ts-ignore
    this.schassign.gradetype = this.gradetypes.find(gradetype=> gradetype.id === this.schassign.teacher.grade.gradetype.id);

    // @ts-ignore
    this.schassign.schtype = this.schtypes.find(type=> type.id === this.schassign.school.schtype.id);

    // @ts-ignore
    this.schassign.schdesignation = this.schdesignations.find(schdes=> schdes.id === this.schassign.schdesignation.id);
    // console.log("cccccc---"+ JSON.stringify(this.schassignObj.staffCreator.grade.gradetype.id));

    this.gradeservice.getById(this.schassign.teacher.grade.gradetype.id).then((grades: Grade[]) =>{
      this.grades = grades;
      // @ts-ignore
      this.schassign.grade = this.grades.find(grade=> grade.id === this.schassign.teacher.grade.id);
      // @ts-ignore
      this.teacherservice.getById(this.schassign.grade.id).then((tech: Teacher[]) =>{
        this.teachers = tech;
        // @ts-ignore
        this.schassign.teacher = this.teachers.find(sc=>sc.id === this.schassign.teacher.id)

        //Subject Null or not
        if (this.schassign.subject == null){

          // @ts-ignore
          this.schassign.schtype = this.schtypes.find(types=>types.id === this.schassign.school.schtype.id);

          this.schoolservice.getById(this.schassign.school.schtype.id).then((tech: School[]) =>{
          this.schools = tech;
          // @ts-ignore
          this.schassign.school = this.schools.find(sc=>sc.id === this.schassign.school.id)
          // @ts-ignore
            this.schassign.sublevel = null;

            if (this.schassign.domodified != null){
              // @ts-ignore
              this.schassign.domodified = null;
              this.form.patchValue(this.schassign);
              this.form.markAsPristine();
            }else {
              this.form.patchValue(this.schassign);
              this.form.markAsPristine();
            }

        });
        }else {
          // @ts-ignore
          this.schassign.sublevel = this.subjectlevels.find(sublevel=>sublevel.id === this.schassign.subject.sublevel.id);

          this.subjectservice.getById(this.schassign.subject.sublevel.id).then((tech: Subject[]) =>{
            this.subjects = tech;
            // @ts-ignore
            this.schassign.subject = this.subjects.find(sc=>sc.id === this.schassign.subject.id);

            // @ts-ignore
            this.schassign.schtype = this.schtypes.find(types=>types.id === this.schassign.school.schtype.id);

            this.schoolservice.getById(this.schassign.school.schtype.id).then((tech: School[]) =>{
              this.schools = tech;
              // @ts-ignore
              this.schassign.school = this.schools.find(sc=>sc.id === this.schassign.school.id)

              if (this.schassign.domodified != null){
                // @ts-ignore
                this.schassign.domodified = null;
                this.form.patchValue(this.schassign);
                this.form.markAsPristine();
              }else {
                this.form.patchValue(this.schassign);
                this.form.markAsPristine();
              }
            });
          });
        }
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

  //Update Schassign
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Schassign Update ", message: "You have following Errors <br> " + errors}
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
            this.schassign = this.form.getRawValue();

            // @ts-ignore
            this.schassign.id = this.oldschassign.id;
            this.schassignservice.update(this.schassign).then((responce: [] | undefined) => {
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
                this.form.controls['doresign'].disable();
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enableButtons(true,false,false);
                this.loadTable("");
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Schassign Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Schassign Update", message: "Nothing Changed"}
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
        this.form.controls['domodified'].disable();
        this.form.controls['docreated'].enable();
        this.form.controls['doresign'].disable();
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.enableButtons(true,false,false);
        this.loadTable("");
      }
    });
  }

//Delete Schassign

  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Schassign Delete",
        message: "Are you sure to Delete folowing Member? <br> <br>" +
          this.schassign.teacher.callingname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.schassignservice.delete(this.schassign.id).then((responce: [] | undefined) => {
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
            this.form.controls['domodified'].disable();
            this.form.controls['docreated'].enable();
            this.form.controls['doresign'].disable();
            this.clearMainForm();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enableButtons(true,false,false);
            this.loadTable("");

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Schassign Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

}
