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
import {Sublevel} from "../../../entity/sublevel";
import {Directorsubject} from "../../../entity/directorsubject";
import {Subject} from "../../../entity/subject";
import {Directorsubjectservice} from "../../../service/directorsubjectservice";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {Sublevelservice} from "../../../service/sublevelservice";
import {Gradeservice} from "../../../service/gradeservice";
import {Subjectservice} from "../../../service/subjectservice";
import {Regexservice} from "../../../service/regexservice";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Staff} from "../../../entity/staff";
import {Staffservice} from "../../../service/staffservice";
import {AuthorizationManager} from "../../../service/authorizationmanager";

@Component({
  selector: 'app-directorsubject',
  templateUrl: './directorsubject.component.html',
  styleUrls: ['./directorsubject.component.css']
})
export class DirectorsubjectComponent {

  columns: string[] = ['director','empstatus','grade','staffdesignation', 'doassign', 'doresign','subject','medium','sublevel','substatus','docreated',];
  headers: string[] = ['Director','Staff-Status','Grade','Designation', 'Date of Assign', 'Date of Resign','Subject','Subject-Medium', 'Subject-Level','Subject-Status','Date of Created'];
  binders: string[] = ['staff.fullname','staff.empstatus.name','staff.grade.name','staff.staffdesignation.name', 'doassign', 'doresign','subject.name','subject.submedium.name','subject.sublevel.name','subject.substatus.name','docreated'];

  cscolumns: string[] = [ 'csdirector','csdesignation','cssubject', 'cssublevel'];
  csprompts: string[] = ['Search by Director name', 'Search by Designation','Search by Subject ', 'Search by Subject level'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  directorsubject!:Directorsubject;
  olddirectorsubject!:Directorsubject|undefined;

  selectedRow: any;

  grades: Array<Grade> = [];
  gradetypes: Array<Gradetype> = [];
  directors: Array<Staff> = [];
  subjectlevels: Array<Sublevel> = [];
  subjects: Array<Subject> = [];

  directorsubjects: Array<Directorsubject> = [];
  data!: MatTableDataSource<Directorsubject>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  uiassist: UiAssist;

  constructor(
    private fb:FormBuilder,
    private staffservice:Staffservice,
    private directorsubjectservice:Directorsubjectservice,
    private gradetypeservice: Gradetypeservice,
    private gradeservice: Gradeservice,
    private sublevelservice: Sublevelservice,
    private subjectservice: Subjectservice,
    private dp:DatePipe,
    private dg:MatDialog,
    private regexservice:Regexservice,
    private matDialog: MatDialog,
    public authService:AuthorizationManager
  ) {

    this.uiassist = new UiAssist(this);
    this.directorsubjects = new Array<Directorsubject>();

    this.csearch = this.fb.group({
      "csdirector": new FormControl(),
      "cssubject": new FormControl(),
      "cssublevel": new FormControl(),
      "csdesignation": new FormControl(),
    });

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form = this.fb.group({
      "staff": new FormControl('',[Validators.required]),
      "doassign": new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      "doresign": new FormControl(),
      'grade': new FormControl('',[Validators.required]),
      'gradetype': new FormControl('',[Validators.required]),
      "subject": new FormControl('',[Validators.required]),
      "sublevel": new FormControl('',[Validators.required]),
      "docreated": new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required])
    });

    this.ssearch = this.fb.group({
      "sslevel": new FormControl()
    });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {
    this.createView();

    this.gradetypeservice.getbyDirectorSubgrade().then((grdtyps: Gradetype[]) =>{this.gradetypes = grdtyps;});

    this.sublevelservice.getAllList().then((levels:Sublevel[])=>{
      this.subjectlevels = levels;
    });
    this.createForm();
  }
  //Grade loads
  loadGrade(id: number) {
    this.gradeservice.getById(id).then((grades: Grade[]) =>{this.grades = grades;});
  }
  //Director load
  loadDirector(id: number) {
    console.log(id);
    // @ts-ignore
    this.staffservice.getByStaffId(id).then((directors: Staff[]) =>{this.directors = directors ;});

  }
  //Subject Load
  loadSubject(id: number) {
    // @ts-ignore
    this.subjectservice.getById(id).then((subs: Subject[]) =>{
      this.subjects = subs;
      console.log(this.subjects)
      // this.oldsubjects = Array.from(this.oldsubjects);
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.directorsubjectservice.getAll(query)
      .then((usrs: Directorsubject[]) => {
        this.directorsubjects = usrs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.directorsubjects);
        this.data.paginator = this.paginator;
      });
  }



  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();


    this.data.filterPredicate = (tech: Directorsubject, filter: string) => {
      return  (cserchdata.csdirector == null || tech.staff.fullname.toLowerCase().includes(cserchdata.csdirector))&&
        (cserchdata.csdesignation == null || tech.staff.staffdesignation.name.toLowerCase().includes(cserchdata.csdesignation))&&
        (cserchdata.cssubject == null || tech.subject.name.toLowerCase().includes(cserchdata.cssubject)) &&
        (cserchdata.cssublevel == null || tech.subject.sublevel.name.toLowerCase().includes(cserchdata.cssublevel))

    };

    this.data.filter = 'xx';

  }


  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let sublevelid = sserchdata.sslevel;


    let query = "";


    if (sublevelid != null) query = query + "&sublevelid=" + sublevelid;
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
    this.form.controls['staff'].setValidators([Validators.required]);
    this.form.controls['gradetype']?.setValidators([Validators.required]);
    this.form.controls['grade']?.setValidators([Validators.required]);
    this.form.controls['doassign'].setValidators([Validators.required]);
    this.form.controls['doresign'].setValidators([]);
    this.form.controls['subject'].setValidators([Validators.required]);
    this.form.controls['sublevel'].setValidators([Validators.required]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['domodified'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doassign" || controlName == "doresign" || controlName == "docreated"  || controlName == "domodified")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olddirectorsubject != undefined && control.valid) {
            // @ts-ignore
            if (value === this.directorsubject[controlName]) {
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

    this.olddirectorsubject = undefined;
    this.form.controls['staff'].reset();
    this.form.controls['gradetype'].reset();
    this.form.controls['grade'].reset();
    this.form.controls['doresign'].reset();
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
        data: {heading: "Errors - Directorsubject Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.directorsubject = this.form.getRawValue();

      let directorsubjectData: string = "";
      directorsubjectData = directorsubjectData + "<br>Title is : "+ this.directorsubject.staff.callingname;
      directorsubjectData = directorsubjectData + "<br>Fullname is : "+ this.directorsubject.subject.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Directorsubject Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ directorsubjectData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.directorsubjectservice.add(this.directorsubject).then((responce: []|undefined) => {
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
              this.clearMainForm()
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
  fillForm(directorsubject: Directorsubject){
    this.form.controls['domodified'].enable();

    this.enableButtons(false,true,true);

    this.selectedRow=directorsubject;
    this.directorsubject = JSON.parse(JSON.stringify(directorsubject));
    // console.log(this.staffObj)
    this.olddirectorsubject = JSON.parse(JSON.stringify(directorsubject));


    // @ts-ignore
    this.directorsubject.gradetype = this.gradetypes.find(gradetype=> gradetype.id === this.directorsubject.staff.grade.gradetype.id);
    // console.log("cccccc---"+ JSON.stringify(this.directorsubjectObj.staffCreator.grade.gradetype.id));

    this.gradeservice.getById(this.directorsubject.staff.grade.gradetype.id).then((grades: Grade[]) =>{
      this.grades = grades;
      // @ts-ignore
      this.directorsubject.grade = this.grades.find(grade=> grade.id === this.directorsubject.staff.grade.id);
      // @ts-ignore
      this.staffservice.getByStaffId(this.directorsubject.grade.id).then((tech: Director[]) =>{
        this.directors = tech;
        // @ts-ignore
        this.directorsubject.staff = this.directors.find(sc=>sc.id === this.directorsubject.staff.id)
        console.log( this.directorsubject.staff)

        // @ts-ignore
        this.directorsubject.sublevel = this.subjectlevels.find(sublevel=>sublevel.id === this.directorsubject.subject.sublevel.id);
        // @ts-ignore
        this.subjectservice.getById(this.directorsubject.subject.sublevel.id).then((tech: Subject[]) =>{
          this.subjects = tech;
          // @ts-ignore
          this.directorsubject.subject = this.subjects.find(sc=>sc.id === this.directorsubject.subject.id)
           console.log(this.directorsubject);
          this.form.patchValue(this.directorsubject);
          this.form.markAsPristine();
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

  //Update Directorsubject
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Directorsubject Update ", message: "You have following Errors <br> " + errors}
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
            this.directorsubject = this.form.getRawValue();

            // @ts-ignore
            this.directorsubject.id = this.olddirectorsubject.id;
            this.directorsubjectservice.update(this.directorsubject).then((responce: [] | undefined) => {
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
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enableButtons(true,false,false);
                this.loadTable("");
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Directorsubject Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Directorsubject Update", message: "Nothing Changed"}
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
        this.form.controls['domodified'].disable();
        this.clearMainForm();
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.enableButtons(true,false,false);
        this.loadTable("");
      }
    });
  }

//Delete Directorsubject

  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Directorsubject Delete",
        message: "Are you sure to Delete folowing Member? <br> <br>" +
          this.directorsubject.staff.callingname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.directorsubjectservice.delete(this.directorsubject.id).then((responce: [] | undefined) => {
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
            this.clearMainForm();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enableButtons(true,false,false);
            this.loadTable("");

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Directorsubject Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

}
