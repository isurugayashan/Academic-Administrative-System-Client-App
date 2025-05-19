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
import {Staffsection} from "../../../entity/staffsection";
import {Subject} from "../../../entity/subject";
import {Teacherservice} from "../../../service/teacherservice";
import {Staffsectionservice} from "../../../service/staffsectionservice";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {Sublevelservice} from "../../../service/sublevelservice";
import {Gradeservice} from "../../../service/gradeservice";
import {Subjectservice} from "../../../service/subjectservice";
import {Regexservice} from "../../../service/regexservice";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Staff} from "../../../entity/staff";
import {Section} from "../../../entity/section";
import {Sectionservice} from "../../../service/sectionservice";
import {Staffservice} from "../../../service/staffservice";

@Component({
  selector: 'app-staffsection',
  templateUrl: './staffsection.component.html',
  styleUrls: ['./staffsection.component.css']
})
export class StaffsectionComponent {

  columns: string[] = ['staff','gradetype','grade','empstatus','officetype','section','secstatus','doassigned', 'doresigned','docreated','domodified'];
  headers: string[] = ['Staff Member', 'Grade-Type', 'Grade','Staff Status','Office-type','Section Name','Section Status','Date of Assign', 'Date of Resign','Date of Create','Date of Modify'];
  binders: string[] = ['staff.fullname','staff.grade.gradetype.name', 'staff.grade.name','staff.empstatus.name','staff.officetype.name','section.name','section.secstatus.name','doassigned', 'doresigned','docreated','domodified'];

  cscolumns: string[] = [ 'csstaff','cssection','csgradetype','csstatus'];
  csprompts: string[] = ['Search by Staff member name', 'Search by Section','Search by Grade-Type','Search by Status'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  staffsection!:Staffsection;
  oldstaffsection!:Staffsection|undefined;

  selectedRow: any;

  grades: Array<Grade> = [];
  gradetypes: Array<Gradetype> = [];
  staffs: Array<Staff> = [];
  sections: Array<Section> = [];

  staffsections: Array<Staffsection> = [];
  data!: MatTableDataSource<Staffsection>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  uiassist: UiAssist;

  constructor(
    private fb:FormBuilder,
    private staffservice:Staffservice,
    private staffsectionservice:Staffsectionservice,
    private gradetypeservice: Gradetypeservice,
    private gradeservice: Gradeservice,
    private sectionservice: Sectionservice,
    private dp:DatePipe,
    private dg:MatDialog,
    private regexservice:Regexservice,
    private matDialog: MatDialog,
  ) {

    this.uiassist = new UiAssist(this);
    this.staffsections = new Array<Staffsection>();

    this.csearch = this.fb.group({
      "csstaff": new FormControl(),
      "cssection": new FormControl(),
      "csgradetype": new FormControl(),
      "csstatus": new FormControl(),
    });

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form = this.fb.group({
      "staff": new FormControl('',[Validators.required]),
      "doassigned": new FormControl('',[Validators.required]),
      "doresigned": new FormControl({value:'', disabled: true}),
      'grade': new FormControl('',[Validators.required]),
      'gradetype': new FormControl('',[Validators.required]),
      "section": new FormControl('',[Validators.required]),
      "docreated": new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required])
    });

    // this.ssearch = this.fb.group({
    //   "ssitem": new FormControl(),
    //   "sscustomer": new FormControl(),
    //   "ssinvoicestatus": new FormControl()
    // });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {
    this.createView();

    this.gradetypeservice.getbyStaffsecgrade().then((grdtyps: Gradetype[]) =>{this.gradetypes = grdtyps;});

    this.sectionservice.get().then((secs:Section[])=>{
      this.sections = secs;
    });
    this.createForm();
  }
  //Grade loads
  loadGrade(id: number) {
    this.gradeservice.getById(id).then((grades: Grade[]) =>{this.grades = grades;});
  }
  //Teacher load
  loadStaff(id: number) {
    console.log(id);
    // @ts-ignore
    this.staffservice.getByStaffZonalId(id).then((staff: Staff[]) =>{this.staffs = staff ;});

  }


  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.staffsectionservice.getAll(query)
      .then((usrs: Staffsection[]) => {
        this.staffsections = usrs;
        console.log(this.staffsections)
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.staffsections);
        this.data.paginator = this.paginator;
      });
  }

  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.oldstaffsection = undefined;
    this.form.controls['staff'].reset();
    this.form.controls['doassigned'].reset();
    this.form.controls['doresigned'].reset();
    this.form.controls['grade'].reset();
    this.form.controls['gradetype'].reset();
    this.form.controls['section'].reset();
    this.form.controls['domodified'].reset();
    this.form.controls['docreated'].setValue(formattedDate);


  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();


    this.data.filterPredicate = (sec: Staffsection, filter: string) => {
       return (cserchdata.csstaff == null || sec.staff.fullname.toLowerCase().includes(cserchdata.csstaff))&&
        (cserchdata.csgradetype == null || sec.staff.grade.gradetype.name.toLowerCase().includes(cserchdata.csgradetype))&&
         (cserchdata.cssection == null || sec.section.name.toLowerCase().includes(cserchdata.cssection))&&
         (cserchdata.csstatus == null || sec.staff.empstatus.name.toLowerCase().includes(cserchdata.csstatus));
    };

    this.data.filter = 'xx';
  }

  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let customer = sserchdata.sscustomer;
    let statusid = sserchdata.ssinvoicestatus;

    let query = "";

    if (customer != null && customer.trim() != "") query = query + "&customer=" + customer;
    if (statusid != null) query = query + "&statusid=" + statusid;

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
    this.form.controls['staff'].setValidators([Validators.required]);
    this.form.controls['gradetype']?.setValidators([Validators.required]);
    this.form.controls['grade']?.setValidators([Validators.required]);
    this.form.controls['doassigned'].setValidators([Validators.required]);
    this.form.controls['doresigned'].setValidators([]);
    this.form.controls['section'].setValidators([Validators.required]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['domodified'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doassign" || controlName == "doresign" || controlName == "docreated")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldstaffsection != undefined && control.valid) {
            // @ts-ignore
            if (value === this.staffsection[controlName]) {
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

  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Staffsection Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.staffsection = this.form.getRawValue();
      console.log(this.staffsection)
      let staffsectionData: string = "";
      staffsectionData = staffsectionData + "<br>Title is : "+ this.staffsection.staff.fullname;
      staffsectionData = staffsectionData + "<br>Fullname is : "+ this.staffsection.section.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Staffsection Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ staffsectionData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.staffsectionservice.add(this.staffsection).then((responce: []|undefined) => {
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
  fillForm(staffsection: Staffsection){

    this.form.controls['domodified'].enable();
    this.form.controls['doresigned'].enable();
    this.form.controls['docreated'].disable();

    this.enableButtons(false,true,true);

    this.selectedRow=staffsection;
    this.staffsection = JSON.parse(JSON.stringify(staffsection));
    // console.log(this.staffObj)
    this.oldstaffsection = JSON.parse(JSON.stringify(staffsection));


    // @ts-ignore
    this.staffsection.gradetype = this.gradetypes.find(gradetype=> gradetype.id === this.staffsection.staff.grade.gradetype.id);
    // console.log("cccccc---"+ JSON.stringify(this.staffsectionObj.staffCreator.grade.gradetype.id));

    this.gradeservice.getById(this.staffsection.staff.grade.gradetype.id).then((grades: Grade[]) =>{
      this.grades = grades;
      // @ts-ignore
      this.staffsection.grade = this.grades.find(grade=> grade.id === this.staffsection.staff.grade.id);
      // @ts-ignore
      this.staffservice.getByStaffId(this.staffsection.grade.id).then((tech: Staff[]) =>{
        this.staffs = tech;
        // @ts-ignore
        this.staffsection.staff = this.staffs.find(ss=>ss.id === this.staffsection.staff.id)
        console.log(this.staffsection.staff.id);

        // @ts-ignore
        this.staffsection.section = this.sections.find(secs=> secs.id === this.staffsection.section.id);

        if (this.staffsection.domodified != null){
          // @ts-ignore
          this.staffsection.domodified = null;
          this.form.patchValue(this.staffsection);
          this.form.markAsPristine();
        }else {
          this.form.patchValue(this.staffsection);
          this.form.markAsPristine();
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

  //Update Staffsection
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Staffsection Update ", message: "You have following Errors <br> " + errors}
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
            this.staffsection = this.form.getRawValue();

            // @ts-ignore
            this.staffsection.id = this.oldstaffsection.id;
            this.staffsectionservice.update(this.staffsection).then((responce: [] | undefined) => {
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
                this.form.controls['doresigned'].disable();
                this.form.controls['docreated'].enable();
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enableButtons(true,false,false);
                this.loadTable("");
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Staffsection Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Staffsection Update", message: "Nothing Changed"}
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
        this.form.controls['doresigned'].disable();
        this.form.controls['docreated'].enable();
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.enableButtons(true,false,false);
        this.loadTable("");
      }
    });
  }

//Delete Staffsection

  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Staffsection Delete",
        message: "Are you sure to Delete folowing Member? <br> <br>" +
          this.staffsection.staff.fullname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.staffsectionservice.delete(this.staffsection.id).then((responce: [] | undefined) => {
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
            this.clearMainForm();
            this.form.controls['domodified'].disable();
            this.form.controls['doresigned'].disable();
            this.form.controls['docreated'].enable();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enableButtons(true,false,false);
            this.loadTable("");

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Staffsection Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

}
